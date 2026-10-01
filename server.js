import express from 'express';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for in-memory uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Connect to MongoDB Atlas
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas Database (imageStore)'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));
} else {
  console.warn('⚠️ MONGO_URI environment variable not defined');
}

// ---------------------------------------------------------
// MongoDB Schemas & Models
// ---------------------------------------------------------
const imageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    url: { type: String, required: true },
    cloudinaryPublicId: { type: String },
    categoryId: { type: String, required: true },
    categoryName: { type: String, default: 'General' },
    orientation: { type: String, enum: ['landscape', 'portrait', 'square'], default: 'landscape' },
    tags: [{ type: String }],
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    authorUsername: { type: String, required: true },
    authorAvatar: { type: String },
    likesCount: { type: Number, default: 0 },
    downloadsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  },
  { timestamps: true }
);

const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);

// ---------------------------------------------------------
// API Routes
// ---------------------------------------------------------

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'missing',
    port: PORT,
  });
});

// Get all images
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upload image to Cloudinary & Save to MongoDB
app.post('/api/images/upload', upload.single('imageFile'), async (req, res) => {
  try {
    const { title, description, categoryId, categoryName, orientation, tags, authorId, authorName, authorUsername, authorAvatar, imageBase64 } = req.body;

    let imageUrl = '';
    let publicId = '';

    // Upload file buffer or base64 to Cloudinary
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const cRes = await cloudinary.uploader.upload(dataURI, { folder: 'freeimage_pro' });
      imageUrl = cRes.secure_url;
      publicId = cRes.public_id;
    } else if (imageBase64) {
      const cRes = await cloudinary.uploader.upload(imageBase64, { folder: 'freeimage_pro' });
      imageUrl = cRes.secure_url;
      publicId = cRes.public_id;
    } else if (req.body.url) {
      imageUrl = req.body.url;
    } else {
      return res.status(400).json({ success: false, error: 'No image file or URL provided' });
    }

    const parsedTags = Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : [];

    const newImage = new Image({
      title: title || 'Untitled Photograph',
      description: description || '',
      url: imageUrl,
      cloudinaryPublicId: publicId,
      categoryId: categoryId || 'cat-nature',
      categoryName: categoryName || 'Nature & Landscapes',
      orientation: orientation || 'landscape',
      tags: parsedTags,
      authorId: authorId || 'user-admin',
      authorName: authorName || 'Elena Vance',
      authorUsername: authorUsername || 'elenavance',
      authorAvatar: authorAvatar || '',
      status: 'approved',
    });

    await newImage.save();
    console.log('📸 Uploaded photo to Cloudinary & saved to MongoDB:', newImage.id);
    res.status(201).json({ success: true, data: newImage });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Increment share count
app.post('/api/images/:id/share', async (req, res) => {
  try {
    const updated = await Image.findByIdAndUpdate(
      req.params.id,
      { $inc: { sharesCount: 1 } },
      { new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
