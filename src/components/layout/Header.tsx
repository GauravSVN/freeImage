import React, { useState } from 'react';
import {
  Upload,
  User as UserIcon,
  ShieldCheck,
  Bookmark,
  Heart,
  Grid,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  Search,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useImages } from '../../context/ImageContext';
import { ActiveView, UserDashboardTab } from '../../types';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenUpload: () => void;
  onQuickSearchFocus?: () => void;
  onNavigateUserDashboard?: (tab: UserDashboardTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenAuth,
  onOpenUpload,
  onQuickSearchFocus,
  onNavigateUserDashboard,
}) => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { pendingImages } = useImages();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-3 z-40 w-full bg-transparent transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating Light Island Capsule Navbar */}
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-full px-3.5 py-1.5 shadow-lg shadow-slate-200/50 flex items-center justify-between transition-all">
          {/* Zone 1: Logo Wordmark in Dark Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2 bg-slate-950 text-white px-4 py-1.5 rounded-full font-serif-display font-bold text-sm tracking-tight hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FreeImage Pro</span>
            </button>
          </div>

          {/* Zone 2: Navigation Links inside Light Capsule */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-medium text-slate-600">
            <button
              onClick={() => setActiveView('landing')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeView === 'landing'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveView('explore')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeView === 'explore'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              Photos & Explore
            </button>
            <button
              onClick={() => setActiveView('categories')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeView === 'categories'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveView('about')}
              className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                activeView === 'about'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              About & License
            </button>
          </nav>

          {/* Zone 3: Actions in Pill Container */}
          <div className="flex items-center gap-2">
            {/* Admin Dashboard shortcut button if admin */}
            {isAdmin && (
              <button
                onClick={() => setActiveView('admin-dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all border ${
                  activeView === 'admin-dashboard'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Studio</span>
                {pendingImages.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {pendingImages.length}
                  </span>
                )}
              </button>
            )}

            {/* Upload Button */}
            {isAdmin && (
              <button
                onClick={onOpenUpload}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-all cursor-pointer shadow-xs whitespace-nowrap active:scale-95"
              >
                Upload
              </button>
            )}

            {/* User Account / Sign In in Pill Container */}
            {!isAuthenticated ? (
              <div className="flex items-center bg-slate-100 text-slate-950 rounded-full px-1.5 py-1 shadow-xs border border-slate-200">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors whitespace-nowrap"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-1 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-full shadow-xs transition-all whitespace-nowrap cursor-pointer active:scale-95"
                >
                  Join Free
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-slate-300 transition-all cursor-pointer"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {/* Dropdown Menu (Matches Image 2 precisely) */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <button
                      onClick={() => {
                        onNavigateUserDashboard?.('overview');
                        setActiveView('user-dashboard');
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400 stroke-[2]" />
                      <span>Your Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateUserDashboard?.('saved');
                        setActiveView('user-dashboard');
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Bookmark className="w-4 h-4 text-slate-400 stroke-[2]" />
                      <span>Your Collections</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateUserDashboard?.('profile');
                        setActiveView('user-dashboard');
                      }}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-400 stroke-[2]" />
                      <span>Settings</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => setActiveView('admin-dashboard')}
                        className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-xs font-semibold text-amber-900 bg-amber-50/50 hover:bg-amber-100/60 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600 stroke-[2]" />
                        <span>Admin Studio Dashboard</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1.5" />

                    <button
                      onClick={logout}
                      className="w-full px-4 py-2.5 text-left flex items-center gap-3 text-xs font-bold text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
