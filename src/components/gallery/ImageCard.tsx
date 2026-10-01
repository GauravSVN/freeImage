import React from 'react';
import { Heart, Bookmark, Download, Share2, Trash2 } from 'lucide-react';
import { ImageItem } from '../../types';
import { useImages } from '../../context/ImageContext';
import { useAuth } from '../../context/AuthContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ImageCardProps {
  image: ImageItem;
  onClick: (image: ImageItem) => void;
  onShare: (image: ImageItem) => void;
  onRequireAuth?: (message?: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onClick, onShare, onRequireAuth }) => {
  const { toggleLike, isLiked, toggleSave, isSaved, recordDownload, deleteUserImage } = useImages();
  const { isAuthenticated, isAdmin } = useAuth();

  const liked = isLiked(image.id);
  const saved = isSaved(image.id);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onRequireAuth?.('Please sign in to download high-resolution photography.');
      return;
    }
    recordDownload(image.id, 'large');

    // Trigger download
    const link = document.createElement('a');
    link.href = image.url;
    link.target = '_blank';
    link.download = `${image.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onRequireAuth?.('Please sign in to like photographs.');
      return;
    }
    toggleLike(image.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onRequireAuth?.('Please sign in to save photographs to your collection.');
      return;
    }
    toggleSave(image.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onRequireAuth?.('Please sign in to share photographs.');
      return;
    }
    onShare(image);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (confirm(`Admin Action: Remove photograph "${image.title}"?`)) {
      deleteUserImage(image.id);
    }
  };

  return (
    <div
      onClick={() => onClick(image)}
      className="group relative mb-6 break-inside-avoid overflow-hidden rounded-2xl bg-slate-900 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300"
    >
      {/* Visual Asset */}
      <ImageWithFallback
        src={image.thumbnailUrl || image.url}
        alt={image.title}
        fallbackTitle={image.title}
        className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
      />

      {/* Scrim Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 pointer-events-none">
        {/* Top Action Row */}
        <div className="flex items-center justify-between pointer-events-auto">
          <span className="text-[11px] font-medium text-white/90 drop-shadow-xs truncate max-w-[180px]">
            {image.categoryName}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
                liked
                  ? 'bg-rose-600 text-white'
                  : 'bg-black/40 hover:bg-black/60 text-white/90'
              }`}
              title={liked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
                saved
                  ? 'bg-amber-500 text-white'
                  : 'bg-black/40 hover:bg-black/60 text-white/90'
              }`}
              title={saved ? 'Saved' : 'Save'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>

            {/* Quick Delete Button - Admin Only */}
            {isAdmin && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg backdrop-blur-md bg-rose-600/80 hover:bg-rose-600 text-white transition-colors"
                title="Admin Delete: Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Author & Download Row */}
        <div className="flex items-end justify-between pointer-events-auto">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <img
              src={image.authorAvatar}
              alt={image.authorName}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-white/40 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate drop-shadow-xs">
                {image.authorName}
              </p>
              <p className="text-[11px] text-white/70 truncate drop-shadow-xs">
                {image.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/90 transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 p-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md transition-colors"
              title="Download Free"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Free</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
