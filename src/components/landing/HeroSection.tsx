import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  trendingKeywords: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, trendingKeywords }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="relative -mt-20 pt-36 sm:pt-44 md:pt-48 pb-16 sm:pb-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle atmospheric backdrop lighting */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif-display font-bold tracking-tight text-white leading-tight max-w-3xl mx-auto [text-wrap:balance]">
          Discover beautiful images for your next project
        </h1>

        {/* Subheading */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Search, save, share and download high-quality photography curated for creators and teams worldwide.
        </p>

        {/* Hero Search Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-8 sm:mt-10 max-w-2xl mx-auto"
        >
          <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-1.5 sm:p-2 border border-slate-200">
            <Search className="w-5 h-5 text-slate-400 ml-3 sm:ml-4 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search high-resolution photos, nature, architecture, travel..."
              className="w-full px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium rounded-xl transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4 hidden sm:inline" />
            </button>
          </div>
        </form>

        {/* Trending Searches Suggestions */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Popular:</span>
          {trendingKeywords.map(kw => (
            <button
              key={kw}
              type="button"
              onClick={() => {
                setSearchTerm(kw);
                onSearch(kw);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition-colors cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
