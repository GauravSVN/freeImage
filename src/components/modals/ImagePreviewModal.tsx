import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  Bookmark,
  Share2,
  Maximize2,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Info,
  Send,
  MapPin,
  ZoomIn,
  Trash2,
  Edit2,
  Save,
  Star,
  Plus,
} from 'lucide-react';
import { ImageItem } from '../../types';
import { useImages } from '../../context/ImageContext';
import { useAuth } from '../../context/AuthContext';

interface ImagePreviewModalProps {
  image: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: (image: ImageItem) => void;
  onSelectImage?: (image: ImageItem) => void;
  onSelectTag?: (tag: string) => void;
  onRequireAuth?: (message?: string) => void;
}

type SizeOption = 'original' | 'large' | 'medium' | 'small' | 'custom';

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  image,
  isOpen,
  onClose,
  onShare,
  onSelectImage,
  onSelectTag,
  onRequireAuth,
}) => {
  const {
    images,
    approvedImages,
    toggleLike,
    isLiked,
    toggleSave,
    isSaved,
    recordDownload,
    deleteUserImage,
    updateUserImage,
    categories,
  } = useImages();
  const { isAuthenticated, isAdmin } = useAuth();

  // Navigation between images
  const allImages = approvedImages.length > 0 ? approvedImages : images;
  const currentIndex = image ? allImages.findIndex(img => img.id === image.id) : -1;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    if (currentIndex > 0) {
      onSelectImage?.(allImages[currentIndex - 1]);
    } else {
      // Loop to last
      onSelectImage?.(allImages[allImages.length - 1]);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    if (currentIndex < allImages.length - 1 && currentIndex !== -1) {
      onSelectImage?.(allImages[currentIndex + 1]);
    } else {
      // Loop to first
      onSelectImage?.(allImages[0]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !image) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, image, currentIndex, allImages]);

  // Size Dropdown State (Image 1 style)
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [selectedSize, setSelectedSize] = useState<SizeOption>('original');
  const [customWidth, setCustomWidth] = useState('1920');
  const [customHeight, setCustomHeight] = useState('1080');
  const [downloading, setDownloading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSizeDropdown(false);
      }
    };
    if (showSizeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSizeDropdown]);

  // Admin inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editSavedSuccess, setEditSavedSuccess] = useState(false);

  useEffect(() => {
    if (image) {
      setEditTitle(image.title);
      setEditDescription(image.description || '');
      setEditCategoryId(image.categoryId);
      setEditTags(image.tags.join(', '));
      setIsEditing(false);
      setEditSavedSuccess(false);

      // sync custom sizes
      setCustomWidth(String(image.width || 3640));
      setCustomHeight(String(image.height || 5298));
    }
  }, [image]);

  if (!isOpen || !image) return null;

  const liked = isLiked(image.id);
  const saved = isSaved(image.id);

  // Proportional sizes calculation
  const imgW = image.width || 3640;
  const imgH = image.height || 5298;
  const ratio = imgH / imgW;

  const sizeOptions = {
    original: { label: 'Original', w: imgW, h: imgH },
    large: { label: 'Large', w: Math.min(imgW, 1920), h: Math.round(Math.min(imgW, 1920) * ratio) },
    medium: { label: 'Medium', w: Math.min(imgW, 1280), h: Math.round(Math.min(imgW, 1280) * ratio) },
    small: { label: 'Small', w: Math.min(imgW, 640), h: Math.round(Math.min(imgW, 640) * ratio) },
  };

  // Aspect ratio calculation
  const calculateAspectRatio = (w: number, h: number): string => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(w, h);
    const rW = Math.round(w / divisor);
    const rH = Math.round(h / divisor);
    if (rW > 100 || rH > 100) {
      return `${Math.round(w / 2)} : ${Math.round(h / 2)}`;
    }
    return `${rW} : ${rH}`;
  };

  // Color palette (from image or harmonious fallback)
  const colorPalette = image.colors || ['#1c1a18', '#4b3e34', '#8c7664', '#c4b3a1', '#e8dfd5'];

  // Location display
  const locationDisplay = image.location || 'Nancy, Grand Est, France';

  // Date formatting
  const formattedDate = new Date(image.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDownload = async (sizeToDownload: SizeOption = selectedSize) => {
    if (!isAuthenticated) {
      onRequireAuth?.('Please sign in to download high-resolution photography.');
      return;
    }
    setDownloading(true);

    let targetW = imgW;
    let qualityKey: 'small' | 'medium' | 'large' | 'original' = 'original';

    if (sizeToDownload === 'small') {
      targetW = sizeOptions.small.w;
      qualityKey = 'small';
    } else if (sizeToDownload === 'medium') {
      targetW = sizeOptions.medium.w;
      qualityKey = 'medium';
    } else if (sizeToDownload === 'large') {
      targetW = sizeOptions.large.w;
      qualityKey = 'large';
    } else if (sizeToDownload === 'custom') {
      targetW = parseInt(customWidth, 10) || imgW;
    }

    recordDownload(image.id, qualityKey);

    try {
      let downloadUrl = image.url;
      if (sizeToDownload !== 'original') {
        downloadUrl += `&w=${targetW}`;
      }

      const response = await fetch(downloadUrl, { mode: 'cors' }).catch(() => null);
      if (response && response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `${image.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${sizeToDownload}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.target = '_blank';
        link.download = `${image.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${sizeToDownload}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error('Download error', e);
      window.open(image.url, '_blank');
    } finally {
      setTimeout(() => {
        setDownloading(false);
        setShowSizeDropdown(false);
      }, 700);
    }
  };

  const handleSaveAdminEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    const chosenCat = categories.find(c => c.id === editCategoryId);
    const parsedTags = editTags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    updateUserImage(image.id, {
      title: editTitle.trim() || image.title,
      description: editDescription.trim(),
      categoryId: editCategoryId,
      categoryName: chosenCat?.name || image.categoryName,
      tags: parsedTags.length > 0 ? parsedTags : image.tags,
    });

    setEditSavedSuccess(true);
    setTimeout(() => {
      setEditSavedSuccess(false);
      setIsEditing(false);
    }, 1200);
  };

  const handleDeleteByAdmin = () => {
    if (!isAdmin) return;
    if (confirm(`Admin Action: Permanently delete photograph "${image.title}"?`)) {
      deleteUserImage(image.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`relative w-full bg-white md:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto transition-all ${
          isFullscreen ? 'fixed inset-0 rounded-none z-50' : 'max-w-6xl max-h-[96vh]'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* ======================================================== */}
        {/* 1. TOP HEADER BAR: Like Count + Free Download Dropdown   */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-100 bg-white sticky top-0 z-30">
          {/* Creator Avatar & Name */}
          <div className="flex items-center gap-3 min-w-0 pr-3">
            <img
              src={image.authorAvatar}
              alt={image.authorName}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0 hidden sm:block">
              <span className="text-xs font-semibold text-slate-900 truncate block">
                {image.authorName}
              </span>
              <span className="text-[11px] text-slate-500 truncate block">
                @{image.authorUsername}
              </span>
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2">
            {/* Heart / Like Button with count (as in Image 1: ♡ 20) */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onRequireAuth?.('Please sign in to like photographs.');
                  return;
                }
                toggleLike(image.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                liked
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
              title={liked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current text-rose-600' : 'text-slate-800'}`} />
              <span className="tabular-nums font-bold text-xs">{image.likesCount}</span>
            </button>

            {/* Save / Bookmark Button right beside Like button */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onRequireAuth?.('Please sign in to save photographs to your collection.');
                  return;
                }
                toggleSave(image.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                saved
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
              title={saved ? 'Remove from saved' : 'Save to collection'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current text-white' : 'text-slate-800'}`} />
              <span className="hidden sm:inline font-medium text-xs">{saved ? 'Saved' : 'Save'}</span>
            </button>

            {/* FREE DOWNLOAD DROPDOWN (Matches Image 1 precisely) */}
            <div className="relative" ref={dropdownRef}>
              <div className="inline-flex rounded-xl overflow-hidden shadow-xs bg-[#2ec486]">
                {/* Main Download Button */}
                <button
                  onClick={() => handleDownload()}
                  disabled={downloading}
                  className="px-4 py-2 bg-[#2ec486] hover:bg-[#28b078] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  {downloading ? 'Downloading...' : 'Free download'}
                </button>

                {/* Vertical Divider */}
                <div className="w-px bg-white/30" />

                {/* Arrow Dropdown Toggle */}
                <button
                  onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                  className="px-2.5 py-2 bg-[#2ec486] hover:bg-[#28b078] text-white transition-colors cursor-pointer flex items-center justify-center"
                  title="Choose resolution size"
                >
                  {showSizeDropdown ? (
                    <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
              </div>

              {/* DROPDOWN CARD (Matches Image 1 layout) */}
              {showSizeDropdown && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-xs font-medium text-slate-500 mb-3">
                    Choose a size:
                  </div>

                  <div className="space-y-1 text-xs">
                    {/* Original */}
                    <div
                      onClick={() => setSelectedSize('original')}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-900 font-medium"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-900">Original</span>
                        <span className="text-slate-700 font-mono">
                          {sizeOptions.original.w}x{sizeOptions.original.h}
                        </span>
                      </div>
                      {selectedSize === 'original' && (
                        <Check className="w-4 h-4 text-slate-900 stroke-[3]" />
                      )}
                    </div>

                    {/* Large */}
                    <div
                      onClick={() => setSelectedSize('large')}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-900 font-medium border-t border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-700">Large</span>
                        <span className="text-slate-500 font-mono">
                          {sizeOptions.large.w}x{sizeOptions.large.h}
                        </span>
                      </div>
                      {selectedSize === 'large' && (
                        <Check className="w-4 h-4 text-slate-900 stroke-[3]" />
                      )}
                    </div>

                    {/* Medium */}
                    <div
                      onClick={() => setSelectedSize('medium')}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-900 font-medium border-t border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-700">Medium</span>
                        <span className="text-slate-500 font-mono">
                          {sizeOptions.medium.w}x{sizeOptions.medium.h}
                        </span>
                      </div>
                      {selectedSize === 'medium' && (
                        <Check className="w-4 h-4 text-slate-900 stroke-[3]" />
                      )}
                    </div>

                    {/* Small */}
                    <div
                      onClick={() => setSelectedSize('small')}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer text-slate-900 font-medium border-t border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-700">Small</span>
                        <span className="text-slate-500 font-mono">
                          {sizeOptions.small.w}x{sizeOptions.small.h}
                        </span>
                      </div>
                      {selectedSize === 'small' && (
                        <Check className="w-4 h-4 text-slate-900 stroke-[3]" />
                      )}
                    </div>

                    {/* Custom */}
                    <div
                      onClick={() => setSelectedSize('custom')}
                      className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer border-t border-slate-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-700 font-medium">Custom</span>
                        {selectedSize === 'custom' && (
                          <Check className="w-4 h-4 text-slate-900 stroke-[3]" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2" onClick={e => e.stopPropagation()}>
                        <input
                          type="number"
                          value={customWidth}
                          onChange={e => {
                            setCustomWidth(e.target.value);
                            setSelectedSize('custom');
                          }}
                          placeholder="Width"
                          className="px-3 py-1.5 text-xs text-slate-800 font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 text-center"
                        />
                        <input
                          type="number"
                          value={customHeight}
                          onChange={e => {
                            setCustomHeight(e.target.value);
                            setSelectedSize('custom');
                          }}
                          placeholder="Height"
                          className="px-3 py-1.5 text-xs text-slate-800 font-mono bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-900 text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Download Selected Size Button */}
                  <button
                    onClick={() => handleDownload(selectedSize)}
                    disabled={downloading}
                    className="w-full mt-3 py-2.5 bg-[#2ec486] hover:bg-[#28b078] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center block"
                  >
                    {downloading ? 'Preparing Download...' : 'Download Selected Size'}
                  </button>
                </div>
              )}
            </div>

            {/* ADMIN ONLY ACTIONS (Edit & Delete) */}
            {isAdmin && (
              <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isEditing
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                  title="Admin: Edit photograph details"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleDeleteByAdmin}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Admin: Permanently delete photograph"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer ml-1"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* UNIFIED SCROLLABLE BODY: Image Stage + Information Section          */}
        {/* =================================================================== */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* 2. MAIN VISUAL STAGE WITH LEFT & RIGHT ARROWS (Image 3) */}
          <div className="relative bg-black flex items-center justify-center p-2 sm:p-6 min-h-[380px] md:min-h-[520px] select-none group">
            {/* Main Large Visual Image */}
            <img
              src={image.url}
              alt={image.title}
              referrerPolicy="no-referrer"
              className="max-h-[66vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-all"
            />

            {/* LEFT NAVIGATION ARROW (Image 3 style) */}
            <button
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 text-white/80 hover:text-white transition-all hover:scale-125 cursor-pointer drop-shadow-md"
              title="Previous photograph (Left Arrow)"
            >
              <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
            </button>

            {/* RIGHT NAVIGATION ARROW (Image 3 style) */}
            <button
              onClick={handleNext}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 text-white/80 hover:text-white transition-all hover:scale-125 cursor-pointer drop-shadow-md"
              title="Next photograph (Right Arrow)"
            >
              <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
            </button>

            {/* Scroll down prompt badge */}
            <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/80 text-[11px] font-medium border border-white/10 pointer-events-none select-none">
              <span>Scroll down for information</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
            </div>

            {/* Raw Full Resolution Direct Link */}
            <a
              href={image.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3.5 right-4 flex items-center gap-1.5 px-3 py-1 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium rounded-lg border border-white/10 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full Resolution</span>
            </a>
          </div>

          {/* ======================================================== */}
          {/* 3. INFORMATION SECTION (Matches Image 2 precisely)       */}
          {/* ======================================================== */}
          <div className="p-6 sm:p-8 space-y-6 bg-white">
          {/* Admin Inline Editor form if active */}
          {isAdmin && isEditing && (
            <form onSubmit={handleSaveAdminEdit} className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Admin Photography Editor
                  </span>
                </div>
                {editSavedSuccess && (
                  <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Changes saved!</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Photograph Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Assigned Category</label>
                  <select
                    value={editCategoryId}
                    onChange={e => setEditCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={e => setEditTags(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Author Card Row */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={image.authorAvatar}
                alt={image.authorName}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
              />
              {/* Level / Star Gold Badge */}
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold shadow-xs">
                4
              </div>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {image.authorName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {image.authorBio || 'Passionate about image street and nature France and elsewhere'}
              </p>
            </div>
          </div>

          {/* METADATA HORIZONTAL STRIP */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-2 border-y border-slate-100 text-xs">
            {/* License */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5 font-medium">License</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Free</span>
              </span>
            </div>

            {/* Dimensions */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5 font-medium">Dimensions</span>
              <span className="font-semibold text-slate-900 font-mono">
                {image.width} × {image.height}
              </span>
            </div>

            {/* Aspect Ratio */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5 font-medium">Aspect Ratio</span>
              <span className="font-semibold text-slate-900 font-mono">
                {calculateAspectRatio(image.width, image.height)}
              </span>
            </div>

            {/* Colors */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1 font-medium">Colors</span>
              <div className="flex items-center gap-1">
                {colorPalette.slice(0, 5).map((col, idx) => (
                  <span
                    key={idx}
                    className="w-4 h-3 rounded-xs border border-black/10 inline-block shadow-2xs"
                    style={{ backgroundColor: col }}
                    title={col}
                  />
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5 font-medium">Date</span>
              <span className="font-semibold text-slate-900">{formattedDate}</span>
            </div>

            {/* Downloads */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5 font-medium">Downloads</span>
              <span className="font-semibold text-slate-900 font-mono">
                {image.downloadsCount.toLocaleString()}
              </span>
            </div>

            {/* Views */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5 font-medium">Views</span>
              <span className="font-semibold text-slate-900 font-mono">
                {(image.viewsCount || (image.downloadsCount * 5 + image.likesCount * 8 + 120)).toLocaleString()}
              </span>
            </div>

            {/* Likes */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5 font-medium">Likes</span>
              <span className="font-semibold text-slate-900 font-mono">
                {image.likesCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Location & Description (Image 2 style) */}
          <div className="space-y-3">
            {/* Location with Pin */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{locationDisplay}</span>
            </div>

            {/* Description */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Description</span>
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                {image.description || 'A person walks along a shadowed street corner in Nancy, France, during sunset.'}
              </p>
            </div>
          </div>

          {/* Technical Camera & EXIF specs */}
          {image.exif && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 mb-3">
                <Camera className="w-4 h-4 text-slate-600" />
                <span>Camera & EXIF Data</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                <div>
                  <span className="block text-[11px] text-slate-400">Camera</span>
                  <span className="font-semibold text-slate-800">{image.exif?.camera || 'Sony Alpha 7R'}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Lens</span>
                  <span className="font-semibold text-slate-800 truncate block">{image.exif?.lens || 'FE 24-70mm F2.8'}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Focal Length</span>
                  <span className="font-semibold text-slate-800 font-mono">{image.exif?.focalLength || '35mm'}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Aperture</span>
                  <span className="font-semibold text-slate-800 font-mono">{image.exif?.aperture || 'f/5.6'}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">Shutter</span>
                  <span className="font-semibold text-slate-800 font-mono">{image.exif?.shutter || '1/250s'}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-400">ISO</span>
                  <span className="font-semibold text-slate-800 font-mono">{image.exif?.iso || '100'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Related Tags */}
          {image.tags && image.tags.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-500 mb-2">Related Tags</h4>
              <div className="flex flex-wrap gap-2">
                {image.tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      onSelectTag?.(tag);
                      onClose();
                    }}
                    className="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};
