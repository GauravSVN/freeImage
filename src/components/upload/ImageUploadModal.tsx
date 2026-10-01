import React, { useState, useRef } from 'react';
import { X, UploadCloud, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useImages } from '../../context/ImageContext';
import { useAuth } from '../../context/AuthContext';
import { ImageOrientation } from '../../types';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { uploadImage, categories, addCategory } = useImages();
  const { currentUser, isAuthenticated, isAdmin } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [showAddCatInline, setShowAddCatInline] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [camera, setCamera] = useState('');
  const [lens, setLens] = useState('');
  const [dimensions, setDimensions] = useState<{ width: number; height: number; orientation: ImageOrientation }>({
    width: 3840,
    height: 2560,
    orientation: 'landscape',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid JPEG, PNG, or WEBP photograph.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds 25MB limit. Please upload a smaller image.');
      return;
    }

    setSelectedFile(file);

    // Read and parse image dimensions & preview
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      setPreviewUrl(result);

      // Detect natural image dimensions
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || 3840;
        const h = img.naturalHeight || 2560;
        let orient: ImageOrientation = 'landscape';
        if (h > w * 1.05) orient = 'portrait';
        else if (Math.abs(w - h) < 50) orient = 'square';

        setDimensions({
          width: w,
          height: h,
          orientation: orient,
        });

        // Pre-fill title if empty
        if (!title) {
          const cleanName = file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
          setTitle(cleanName);
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!previewUrl) {
      setError('Please choose or drop an image file to upload.');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a title for your photograph.');
      return;
    }

    const selectedCategory = categories.find(c => c.id === categoryId) || categories[0];
    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase().replace(/^#/, ''))
      .filter(t => t.length > 0);

    if (parsedTags.length === 0) {
      parsedTags.push(selectedCategory.slug, 'photography');
    }

    setIsUploading(true);
    setUploadProgress(15);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 25;
      });
    }, 180);

    try {
      await new Promise(r => setTimeout(r, 900));

      const sizeMB = selectedFile
        ? (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB'
        : '8.4 MB';

      await uploadImage({
        title: title.trim(),
        description: description.trim() || `Original work by ${currentUser?.name || 'Creator'}.`,
        url: previewUrl,
        thumbnailUrl: previewUrl,
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,
        tags: parsedTags,
        width: dimensions.width,
        height: dimensions.height,
        orientation: dimensions.orientation,
        fileType: selectedFile?.type?.split('/')[1]?.toUpperCase() || 'JPEG',
        fileSize: sizeMB,
        exif: camera || lens ? { camera, lens } : undefined,
        license: 'Free for commercial and personal use under FreeImage Pro Open License.',
      });

      setUploadProgress(100);
      setUploadSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 1800);
    } catch (err: any) {
      setError(err?.message || 'Failed to complete image upload.');
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setTitle('');
    setDescription('');
    setTagsInput('');
    setError(null);
    setUploadSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Upload to FreeImage Pro</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit your high-resolution photography for curation & community discovery
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {uploadSuccess ? (
          <div className="p-10 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-1">Image Uploaded Successfully</h4>
            <p className="text-xs text-slate-600 max-w-md mb-2">
              Your photo is now queued in the <strong>Curator Moderation Queue</strong>. Once reviewed and approved by our admin team, it will appear live across all public Explore feeds.
            </p>
            <span className="text-[11px] text-slate-400">Closing automatically...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Drag and drop zone */}
            {!previewUrl ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleFileProcess(e.target.files[0])}
                />
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-600">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900 mb-1">
                  Drag and drop your high-resolution photograph here
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Or <span className="text-slate-900 font-medium underline">browse files</span> from your computer
                </p>
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                  <span>JPEG, PNG, WEBP</span>
                  <span>·</span>
                  <span>Up to 25 MB</span>
                  <span>·</span>
                  <span>Minimum 2000px recommended</span>
                </div>
              </div>
            ) : (
              /* Preview thumbnail container */
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200">
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="w-full h-48 object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-lg text-xs flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Replace Photo</span>
                </button>
                <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-md text-[11px] text-white/90 font-mono">
                  {dimensions.width} × {dimensions.height} px · {dimensions.orientation}
                </div>
              </div>
            )}

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alpenglow Over Pine Ridge"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowAddCatInline(!showAddCatInline)}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      {showAddCatInline ? 'Close' : '+ New Category'}
                    </button>
                  )}
                </div>

                {showAddCatInline && isAdmin ? (
                  <div className="flex items-center gap-1.5 mb-2 p-2 bg-emerald-50 rounded-xl border border-emerald-200">
                    <input
                      type="text"
                      placeholder="Enter new category name..."
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      className="flex-1 px-2.5 py-1 text-xs bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newCatName.trim()) return;
                        const slug = newCatName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
                        const created = addCategory({
                          name: newCatName.trim(),
                          slug,
                          description: `${newCatName.trim()} photography collection.`,
                          coverUrl: '',
                        });
                        if (created) {
                          setCategoryId(created.id);
                        }
                        setNewCatName('');
                        setShowAddCatInline(false);
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : null}

                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="">Select a Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="mountains, landscape, sunrise, fog"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Description / Story
                </label>
                <textarea
                  rows={2}
                  placeholder="Share details about the location, conditions, or creative vision behind this shot..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Camera Body (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sony A7R V"
                  value={camera}
                  onChange={e => setCamera(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Lens (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24-70mm f/2.8 GM"
                  value={lens}
                  onChange={e => setLens(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Progress bar */}
            {isUploading && (
              <div className="pt-2">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Uploading asset...</span>
                  <span className="font-mono tabular-nums">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Curator Notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">Quality Moderation Policy: </span>
              All submissions enter the moderation queue where our admin curators verify image fidelity, resolution, and licensing before public syndication.
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !previewUrl}
                className="px-5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl transition-colors shadow-xs"
              >
                {isUploading ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
