export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  location?: string;
  website?: string;
  socialX?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  socialTiktok?: string;
  donationPlatform?: string;
  donationLink?: string;
  optOutAiTraining?: boolean;
  displayMessageButton?: boolean;
  openToUsageEmail?: boolean;
  status: 'active' | 'suspended';
  createdAt: string;
}

export type ImageStatus = 'pending' | 'approved' | 'rejected';
export type ImageOrientation = 'landscape' | 'portrait' | 'square';

export interface ExifData {
  camera?: string;
  lens?: string;
  focalLength?: string;
  iso?: string;
  aperture?: string;
  shutter?: string;
}

export interface ImageItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  width: number;
  height: number;
  orientation: ImageOrientation;
  fileType: string;
  fileSize: string;
  likesCount: number;
  downloadsCount: number;
  sharesCount?: number;
  status: ImageStatus;
  rejectionReason?: string;
  exif?: ExifData;
  location?: string;
  colors?: string[];
  authorBio?: string;
  viewsCount?: number;
  license: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverUrl: string;
}

export interface LikeRecord {
  id: string;
  userId: string;
  imageId: string;
  createdAt: string;
}

export interface SaveRecord {
  id: string;
  userId: string;
  imageId: string;
  createdAt: string;
}

export interface DownloadRecord {
  id: string;
  userId?: string;
  imageId: string;
  quality: 'small' | 'medium' | 'large' | 'original';
  createdAt: string;
}

export interface ShareRecord {
  id: string;
  userId?: string;
  imageId: string;
  platform?: string;
  createdAt: string;
}

export interface ModerationLog {
  id: string;
  imageId: string;
  imageTitle: string;
  adminId: string;
  adminName: string;
  action: 'approve' | 'reject' | 'delete' | 'category_update';
  reason?: string;
  timestamp: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  orientation: 'all' | ImageOrientation;
  sortBy: 'popular' | 'newest' | 'downloads';
}

export type ActiveView = 
  | 'landing' 
  | 'explore' 
  | 'categories'
  | 'image-details' 
  | 'user-dashboard' 
  | 'admin-dashboard' 
  | 'about';

export type UserDashboardTab = 
  | 'overview' 
  | 'saved' 
  | 'liked' 
  | 'downloads' 
  | 'shares'
  | 'profile';

export type AdminDashboardTab = 
  | 'overview' 
  | 'moderation' 
  | 'images' 
  | 'users' 
  | 'categories' 
  | 'logs';
