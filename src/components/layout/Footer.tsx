import React from 'react';
import { ActiveView } from '../../types';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
  onOpenUpload?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <span className="text-xl font-serif-display font-bold text-white block mb-2">
              FreeImage Pro
            </span>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              Curated high-resolution imagery and visual media licensed for creators, designers, and storytellers worldwide.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs tracking-wider uppercase mb-3">Explore</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveView('landing')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Featured Photography
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('explore')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Search Stock Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('categories')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Curated Categories
                </button>
              </li>
            </ul>
          </div>

          {/* Member Area */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs tracking-wider uppercase mb-3">Community</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveView('explore')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Browse High-Res Photos
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('user-dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Saved Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Curation Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Legal / License */}
          <div>
            <h4 className="text-slate-200 font-semibold text-xs tracking-wider uppercase mb-3">Legal & License</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveView('about')}
                  className="hover:text-white transition-colors"
                >
                  FreeImage Pro Open License
                </button>
              </li>
              <li>
                <span className="text-slate-500">Commercial & Editorial Rights</span>
              </li>
              <li>
                <span className="text-slate-500">Privacy & Terms</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} FreeImage Pro. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Free High-Resolution Visuals</span>
            <span>·</span>
            <span>Zero Paywalls</span>
            <span>·</span>
            <span>Curator Reviewed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
