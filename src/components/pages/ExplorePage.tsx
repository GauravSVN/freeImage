import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown, Compass, Check } from 'lucide-react';
import { useImages } from '../../context/ImageContext';
import { useAuth } from '../../context/AuthContext';
import { ImageItem, ImageOrientation } from '../../types';
import { MasonryGrid } from '../gallery/MasonryGrid';

interface ExplorePageProps {
  onSelectImage: (image: ImageItem) => void;
  onShareImage: (image: ImageItem) => void;
  initialQuery?: string;
  onOpenUpload?: () => void;
  onRequireAuth?: (message?: string) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  onSelectImage,
  onShareImage,
  initialQuery,
  onOpenUpload,
  onRequireAuth,
}) => {
  const { categories, filters, setFilters, filteredImages, resetFilters } = useImages();
  const { isAdmin } = useAuth();
  const [searchInput, setSearchInput] = useState(filters.query || initialQuery || '');
  const [showFiltersBar, setShowFiltersBar] = useState(true);

  // Sync initial query if passed
  useEffect(() => {
    if (initialQuery !== undefined && initialQuery !== filters.query) {
      setSearchInput(initialQuery);
      setFilters(prev => ({ ...prev, query: initialQuery }));
    }
  }, [initialQuery]);

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, query: searchInput.trim() }));
  };

  const handleClearQuery = () => {
    setSearchInput('');
    setFilters(prev => ({ ...prev, query: '' }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Top Search Banner */}
      <div className="bg-white border-b border-slate-200 pt-10 sm:pt-12 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl">
              <div className="relative flex items-center bg-slate-100 rounded-xl border border-slate-200 focus-within:border-slate-400 focus-within:bg-white transition-all">
                <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search stock photography by keyword, color, mood, or location..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearQuery}
                    className="p-1.5 mr-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 mr-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowFiltersBar(!showFiltersBar)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors ${
                  showFiltersBar
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters & Sorting</span>
              </button>

              {(filters.query || filters.category || filters.orientation !== 'all' || filters.sortBy !== 'popular') && (
                <button
                  onClick={() => {
                    resetFilters();
                    setSearchInput('');
                  }}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Filter Options Drawer */}
          {showFiltersBar && (
            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Orientation Filter */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Orientation
                </label>
                <select
                  value={filters.orientation}
                  onChange={e => setFilters(prev => ({ ...prev, orientation: e.target.value as any }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="all">All Orientations</option>
                  <option value="landscape">Landscape (Horizontal)</option>
                  <option value="portrait">Portrait (Vertical)</option>
                  <option value="square">Square (1:1)</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Sort Order
                </label>
                <select
                  value={filters.sortBy}
                  onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="popular">Most Popular (Likes)</option>
                  <option value="downloads">Most Downloaded</option>
                  <option value="newest">Newest Additions</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              {filters.query ? `Results for "${filters.query}"` : 'All Stock Photography'}
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              ({filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'})
            </span>
          </div>

          <div className="text-xs text-slate-400">
            Sorted by <span className="text-slate-700 font-medium capitalize">{filters.sortBy}</span>
          </div>
        </div>

        {/* Masonry Results Grid */}
        <MasonryGrid
          images={filteredImages}
          onSelectImage={onSelectImage}
          onShareImage={onShareImage}
          onOpenUpload={isAdmin ? onOpenUpload : undefined}
          onRequireAuth={onRequireAuth}
          onResetFilters={() => {
            resetFilters();
            setSearchInput('');
          }}
        />
      </div>
    </div>
  );
};
