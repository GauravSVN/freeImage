import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  ImageItem,
  Category,
  LikeRecord,
  SaveRecord,
  DownloadRecord,
  ShareRecord,
  ModerationLog,
  SearchFilters,
} from '../types';
import {
  SEED_IMAGES,
  SEED_CATEGORIES,
  SEED_MODERATION_LOGS,
} from '../data/seedData';
import { useAuth } from './AuthContext';

interface ImageContextType {
  images: ImageItem[];
  categories: Category[];
  likes: LikeRecord[];
  saves: SaveRecord[];
  downloads: DownloadRecord[];
  shares: ShareRecord[];
  moderationLogs: ModerationLog[];
  
  // Public Approved Images
  approvedImages: ImageItem[];
  pendingImages: ImageItem[];
  rejectedImages: ImageItem[];

  // Actions
  toggleLike: (imageId: string) => boolean; // returns true if liked, false if unliked
  isLiked: (imageId: string) => boolean;
  toggleSave: (imageId: string) => boolean; // returns true if saved, false if unsaved
  isSaved: (imageId: string) => boolean;
  recordDownload: (imageId: string, quality: 'small' | 'medium' | 'large' | 'original') => void;
  recordShare: (imageId: string, platform?: string) => void;
  
  // User Actions
  uploadImage: (image: Omit<ImageItem, 'id' | 'likesCount' | 'downloadsCount' | 'status' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName' | 'authorUsername' | 'authorAvatar'>) => Promise<ImageItem>;
  updateUserImage: (id: string, updates: Partial<ImageItem>) => void;
  deleteUserImage: (id: string) => void;

  // Admin Actions
  approveImage: (imageId: string) => void;
  rejectImage: (imageId: string, reason?: string) => void;
  deleteAdminImage: (imageId: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => Category | undefined;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Search & Filtering
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  filteredImages: ImageItem[];
  resetFilters: () => void;

  // User-specific Queries
  getUserImages: (userId: string) => ImageItem[];
  getUserSavedImages: (userId: string) => ImageItem[];
  getUserLikedImages: (userId: string) => ImageItem[];
  getUserDownloads: (userId: string) => DownloadRecord[];
  getUserShares: (userId: string) => ShareRecord[];

  // Single Image query
  getImageById: (id: string) => ImageItem | undefined;
  clearAllSampleImages: () => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

const IMAGES_KEY = 'freeimagepro_all_images_v4';
const CATEGORIES_KEY = 'freeimagepro_all_categories_v6';
const LIKES_KEY = 'freeimagepro_all_likes_v4';
const SAVES_KEY = 'freeimagepro_all_saves_v4';
const DOWNLOADS_KEY = 'freeimagepro_all_downloads_v4';
const SHARES_KEY = 'freeimagepro_all_shares_v4';
const LOGS_KEY = 'freeimagepro_moderation_logs_v4';

const defaultFilters: SearchFilters = {
  query: '',
  category: '',
  orientation: 'all',
  sortBy: 'popular',
};

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();

  const [images, setImages] = useState<ImageItem[]>(() => {
    try {
      const stored = localStorage.getItem(IMAGES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load images from storage', e);
    }
    return SEED_IMAGES;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem(CATEGORIES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
    return SEED_CATEGORIES;
  });

  const [likes, setLikes] = useState<LikeRecord[]>(() => {
    try {
      const stored = localStorage.getItem(LIKES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load likes', e);
    }
    return [];
  });

  const [saves, setSaves] = useState<SaveRecord[]>(() => {
    try {
      const stored = localStorage.getItem(SAVES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load saves', e);
    }
    return [];
  });

  const [downloads, setDownloads] = useState<DownloadRecord[]>(() => {
    try {
      const stored = localStorage.getItem(DOWNLOADS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load downloads', e);
    }
    return [];
  });

  const [shares, setShares] = useState<ShareRecord[]>(() => {
    try {
      const stored = localStorage.getItem(SHARES_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load shares', e);
    }
    return [];
  });

  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>(() => {
    try {
      const stored = localStorage.getItem(LOGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load logs', e);
    }
    return SEED_MODERATION_LOGS;
  });

  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
    } catch (e) {
      console.error('Failed to save images', e);
    }
  }, [images]);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
    } catch (e) {
      console.error('Failed to save likes', e);
    }
  }, [likes]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
    } catch (e) {
      console.error('Failed to save saves', e);
    }
  }, [saves]);

  useEffect(() => {
    try {
      localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
    } catch (e) {
      console.error('Failed to save downloads', e);
    }
  }, [downloads]);

  useEffect(() => {
    try {
      localStorage.setItem(SHARES_KEY, JSON.stringify(shares));
    } catch (e) {
      console.error('Failed to save shares', e);
    }
  }, [shares]);

  useEffect(() => {
    try {
      localStorage.setItem(LOGS_KEY, JSON.stringify(moderationLogs));
    } catch (e) {
      console.error('Failed to save logs', e);
    }
  }, [moderationLogs]);

  const approvedImages = useMemo(() => {
    return images.filter(img => img.status === 'approved');
  }, [images]);

  const pendingImages = useMemo(() => {
    return images.filter(img => img.status === 'pending');
  }, [images]);

  const rejectedImages = useMemo(() => {
    return images.filter(img => img.status === 'rejected');
  }, [images]);

  const isLiked = (imageId: string): boolean => {
    if (!currentUser) return false;
    return likes.some(l => l.userId === currentUser.id && l.imageId === imageId);
  };

  const toggleLike = (imageId: string): boolean => {
    if (!currentUser) return false;
    const exists = likes.some(l => l.userId === currentUser.id && l.imageId === imageId);

    if (exists) {
      setLikes(prev => prev.filter(l => !(l.userId === currentUser.id && l.imageId === imageId)));
      setImages(prev =>
        prev.map(img => (img.id === imageId ? { ...img, likesCount: Math.max(0, img.likesCount - 1) } : img))
      );
      return false;
    } else {
      const newLike: LikeRecord = {
        id: `like-${Date.now()}`,
        userId: currentUser.id,
        imageId,
        createdAt: new Date().toISOString(),
      };
      setLikes(prev => [...prev, newLike]);
      setImages(prev =>
        prev.map(img => (img.id === imageId ? { ...img, likesCount: img.likesCount + 1 } : img))
      );
      return true;
    }
  };

  const isSaved = (imageId: string): boolean => {
    if (!currentUser) return false;
    return saves.some(s => s.userId === currentUser.id && s.imageId === imageId);
  };

  const toggleSave = (imageId: string): boolean => {
    if (!currentUser) return false;
    const exists = saves.some(s => s.userId === currentUser.id && s.imageId === imageId);

    if (exists) {
      setSaves(prev => prev.filter(s => !(s.userId === currentUser.id && s.imageId === imageId)));
      return false;
    } else {
      const newSave: SaveRecord = {
        id: `save-${Date.now()}`,
        userId: currentUser.id,
        imageId,
        createdAt: new Date().toISOString(),
      };
      setSaves(prev => [...prev, newSave]);
      return true;
    }
  };

  const recordDownload = (imageId: string, quality: 'small' | 'medium' | 'large' | 'original') => {
    const newRecord: DownloadRecord = {
      id: `dl-${Date.now()}`,
      userId: currentUser?.id,
      imageId,
      quality,
      createdAt: new Date().toISOString(),
    };
    setDownloads(prev => [newRecord, ...prev]);
    setImages(prev =>
      prev.map(img => (img.id === imageId ? { ...img, downloadsCount: img.downloadsCount + 1 } : img))
    );
  };

  const recordShare = (imageId: string, platform?: string) => {
    const newRecord: ShareRecord = {
      id: `share-${Date.now()}`,
      userId: currentUser?.id,
      imageId,
      platform: platform || 'direct_link',
      createdAt: new Date().toISOString(),
    };
    setShares(prev => [newRecord, ...prev]);
    setImages(prev =>
      prev.map(img => (img.id === imageId ? { ...img, sharesCount: (img.sharesCount || 0) + 1 } : img))
    );
  };

  const uploadImage = async (
    imageInput: Omit<ImageItem, 'id' | 'likesCount' | 'downloadsCount' | 'status' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName' | 'authorUsername' | 'authorAvatar'>
  ): Promise<ImageItem> => {
    if (!currentUser || !isAdmin) {
      throw new Error('Upload access is restricted to Administrators only.');
    }

    const newImage: ImageItem = {
      ...imageInput,
      id: `img-admin-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      likesCount: 0,
      downloadsCount: 0,
      status: 'approved', // Admin direct upload is immediately approved
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setImages(prev => [newImage, ...prev]);
    return newImage;
  };

  const updateUserImage = (id: string, updates: Partial<ImageItem>) => {
    if (!isAdmin) {
      console.warn('Permission Denied: Only administrators can edit photographs.');
      return;
    }
    setImages(prev =>
      prev.map(img => {
        if (img.id === id) {
          return { ...img, ...updates, updatedAt: new Date().toISOString() };
        }
        return img;
      })
    );
  };

  const deleteUserImage = (id: string) => {
    if (!isAdmin) {
      console.warn('Permission Denied: Only administrators can delete photographs.');
      return;
    }
    setImages(prev => prev.filter(img => img.id !== id));
    setLikes(prev => prev.filter(l => l.imageId !== id));
    setSaves(prev => prev.filter(s => s.imageId !== id));
  };

  const approveImage = (imageId: string) => {
    if (!isAdmin) return;
    const target = images.find(img => img.id === imageId);
    if (!target) return;

    setImages(prev =>
      prev.map(img => (img.id === imageId ? { ...img, status: 'approved', rejectionReason: undefined, updatedAt: new Date().toISOString() } : img))
    );

    const log: ModerationLog = {
      id: `log-${Date.now()}`,
      imageId,
      imageTitle: target.title,
      adminId: currentUser?.id || 'admin',
      adminName: currentUser?.name || 'Administrator',
      action: 'approve',
      timestamp: new Date().toISOString(),
    };
    setModerationLogs(prev => [log, ...prev]);
  };

  const rejectImage = (imageId: string, reason?: string) => {
    if (!isAdmin) return;
    const target = images.find(img => img.id === imageId);
    if (!target) return;

    setImages(prev =>
      prev.map(img => (img.id === imageId ? { ...img, status: 'rejected', rejectionReason: reason || 'Does not meet platform quality standards.', updatedAt: new Date().toISOString() } : img))
    );

    const log: ModerationLog = {
      id: `log-${Date.now()}`,
      imageId,
      imageTitle: target.title,
      adminId: currentUser?.id || 'admin',
      adminName: currentUser?.name || 'Administrator',
      action: 'reject',
      reason,
      timestamp: new Date().toISOString(),
    };
    setModerationLogs(prev => [log, ...prev]);
  };

  const deleteAdminImage = (imageId: string) => {
    if (!isAdmin) return;
    const target = images.find(img => img.id === imageId);
    if (target) {
      const log: ModerationLog = {
        id: `log-${Date.now()}`,
        imageId,
        imageTitle: target.title,
        adminId: currentUser?.id || 'admin',
        adminName: currentUser?.name || 'Administrator',
        action: 'delete',
        timestamp: new Date().toISOString(),
      };
      setModerationLogs(prev => [log, ...prev]);
    }
    deleteUserImage(imageId);
  };

  const addCategory = (categoryData: Omit<Category, 'id'>): Category | undefined => {
    if (!isAdmin) return;
    const newCat: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    };
    setCategories(prev => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    if (!isAdmin) return;
    setCategories(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCategory = (id: string) => {
    if (!isAdmin) return;
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Filtered approved images based on search query, category, orientation, and sort
  const filteredImages = useMemo(() => {
    let result = [...approvedImages];

    if (filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      result = result.filter(
        img =>
          img.title.toLowerCase().includes(q) ||
          img.description.toLowerCase().includes(q) ||
          img.tags.some(tag => tag.toLowerCase().includes(q)) ||
          img.authorName.toLowerCase().includes(q) ||
          img.categoryName.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      result = result.filter(img => img.categoryId === filters.category);
    }

    if (filters.orientation !== 'all') {
      result = result.filter(img => img.orientation === filters.orientation);
    }

    if (filters.sortBy === 'popular') {
      result.sort((a, b) => b.likesCount - a.likesCount);
    } else if (filters.sortBy === 'downloads') {
      result.sort((a, b) => b.downloadsCount - a.downloadsCount);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [approvedImages, filters]);

  const getUserImages = (userId: string) => {
    return images.filter(img => img.authorId === userId);
  };

  const getUserSavedImages = (userId: string) => {
    const userSaves = saves.filter(s => s.userId === userId);
    const savedIds = new Set(userSaves.map(s => s.imageId));
    return images.filter(img => savedIds.has(img.id));
  };

  const getUserLikedImages = (userId: string) => {
    const userLikes = likes.filter(l => l.userId === userId);
    const likedIds = new Set(userLikes.map(l => l.imageId));
    return images.filter(img => likedIds.has(img.id));
  };

  const getUserDownloads = (userId: string) => {
    return downloads.filter(d => d.userId === userId);
  };

  const getUserShares = (userId: string) => {
    return shares.filter(s => s.userId === userId);
  };

  const getImageById = (id: string) => {
    return images.find(img => img.id === id);
  };

  const clearAllSampleImages = () => {
    setImages([]);
    setLikes([]);
    setSaves([]);
    setShares([]);
  };

  return (
    <ImageContext.Provider
      value={{
        images,
        categories,
        likes,
        saves,
        downloads,
        shares,
        moderationLogs,
        approvedImages,
        pendingImages,
        rejectedImages,
        toggleLike,
        isLiked,
        toggleSave,
        isSaved,
        recordDownload,
        recordShare,
        uploadImage,
        updateUserImage,
        deleteUserImage,
        approveImage,
        rejectImage,
        deleteAdminImage,
        addCategory,
        updateCategory,
        deleteCategory,
        filters,
        setFilters,
        filteredImages,
        resetFilters,
        getUserImages,
        getUserSavedImages,
        getUserLikedImages,
        getUserDownloads,
        getUserShares,
        getImageById,
        clearAllSampleImages,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};
