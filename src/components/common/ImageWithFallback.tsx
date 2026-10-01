import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Photography',
  fallbackTitle,
  className = '',
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`bg-slate-900 text-slate-400 flex flex-col items-center justify-center p-6 text-center select-none ${className}`}
      >
        <ImageIcon className="w-8 h-8 mb-2 text-slate-500 stroke-[1.5]" />
        <span className="text-xs font-medium text-slate-300 max-w-[200px] truncate">
          {fallbackTitle || alt}
        </span>
        <span className="text-[11px] text-slate-500 mt-1">FreeImage Pro Asset</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200/80 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
