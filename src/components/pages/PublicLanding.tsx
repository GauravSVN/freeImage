import React from 'react';
import { HeroSection } from '../landing/HeroSection';
import { CategoryBar } from '../landing/CategoryBar';
import { MasonryGrid } from '../gallery/MasonryGrid';
import { ImageItem } from '../../types';
import { useImages } from '../../context/ImageContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Sparkles, Shield, Camera, Download } from 'lucide-react';

interface PublicLandingProps {
  onSelectImage: (image: ImageItem) => void;
  onShareImage: (image: ImageItem) => void;
  onNavigateToExplore: (searchTerm?: string, categoryId?: string) => void;
  onOpenUpload?: () => void;
  onRequireAuth?: (message?: string) => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({
  onSelectImage,
  onShareImage,
  onNavigateToExplore,
  onOpenUpload,
  onRequireAuth,
}) => {
  const { categories, approvedImages, filters, setFilters } = useImages();
  const { isAdmin } = useAuth();

  const handleHeroSearch = (query: string) => {
    onNavigateToExplore(query);
  };

  const handleSelectCategory = (categoryId: string) => {
    setFilters(prev => ({ ...prev, category: categoryId }));
  };

  // Filter approved images for landing view
  const displayImages = filters.category
    ? approvedImages.filter(img => img.categoryId === filters.category)
    : approvedImages;

  const trendingKeywords = ['Mountains', 'Dolomites', 'Architecture', 'Ocean', 'Forest', 'Minimalist'];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* 1. Hero Section */}
      <HeroSection
        onSearch={handleHeroSearch}
        trendingKeywords={trendingKeywords}
      />

      {/* 2. Category Bar */}
      <CategoryBar
        categories={categories}
        selectedCategory={filters.category}
        onSelectCategory={handleSelectCategory}
      />

      {/* 3. Main Discovery Feed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif-display font-bold text-slate-900">
              {filters.category
                ? categories.find(c => c.id === filters.category)?.name
                : 'Curated Photography Stream'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Curated and published exclusively by our editorial administration team
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">
              {displayImages.length} High-Res Assets
            </span>
            <button
              onClick={() => onNavigateToExplore()}
              className="flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Masonry Grid */}
        <MasonryGrid
          images={displayImages}
          onSelectImage={onSelectImage}
          onShareImage={onShareImage}
          onResetFilters={() => setFilters(prev => ({ ...prev, category: '' }))}
          onOpenUpload={isAdmin ? onOpenUpload : undefined}
          onRequireAuth={onRequireAuth}
        />

        {/* 4. Editorial Catalog Section (No user upload callout) */}
        <div className="mt-20 p-8 sm:p-12 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Free Stock Visuals
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif-display font-bold text-slate-900 mt-2">
              High-resolution photography for all your projects
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Every photograph published on FreeImage Pro is carefully selected and verified by our editorial administration team. Download, bookmark, and use freely without watermarks or hidden fees.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateToExplore()}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Browse Stock Catalog
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
