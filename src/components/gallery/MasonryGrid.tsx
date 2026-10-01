import React from 'react';
import { ImageItem } from '../../types';
import { ImageCard } from './ImageCard';
import { ImageOff, Upload } from 'lucide-react';

interface MasonryGridProps {
  images: ImageItem[];
  onSelectImage: (image: ImageItem) => void;
  onShareImage: (image: ImageItem) => void;
  onResetFilters?: () => void;
  onOpenUpload?: () => void;
  onRequireAuth?: (message?: string) => void;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  images,
  onSelectImage,
  onShareImage,
  onResetFilters,
  onOpenUpload,
  onRequireAuth,
}) => {
  if (images.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center max-w-md mx-auto px-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
          <ImageOff className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-semibold text-slate-900 mb-1">No photographs currently</h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          All dummy images have been cleared. Be the first to upload and showcase your high-resolution photography on FreeImage Pro!
        </p>
        <div className="flex items-center gap-3">
          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Your First Photo</span>
            </button>
          )}
          {onResetFilters && (
            <button
              onClick={onResetFilters}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 [column-fill:_balance]">
      {images.map(image => (
        <ImageCard
          key={image.id}
          image={image}
          onClick={onSelectImage}
          onShare={onShareImage}
          onRequireAuth={onRequireAuth}
        />
      ))}
    </div>
  );
};
