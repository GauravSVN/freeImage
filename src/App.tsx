import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ImageProvider, useImages } from './context/ImageContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { PublicLanding } from './components/pages/PublicLanding';
import { ExplorePage } from './components/pages/ExplorePage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import { AboutPage } from './components/pages/AboutPage';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ImagePreviewModal } from './components/modals/ImagePreviewModal';
import { ShareModal } from './components/modals/ShareModal';
import { AuthModal } from './components/modals/AuthModal';
import { ImageUploadModal } from './components/upload/ImageUploadModal';
import { ActiveView, ImageItem, UserDashboardTab } from './types';

function MainApp() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { getImageById, setFilters } = useImages();

  // Navigation State
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [userDashboardTab, setUserDashboardTab] = useState<UserDashboardTab>('overview');

  // Modals State
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<ImageItem | null>(null);
  const [selectedShareImage, setSelectedShareImage] = useState<ImageItem | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // URL state synchronization on mount & changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const imageIdParam = params.get('image');
    const viewParam = params.get('view') as ActiveView | null;
    const queryParam = params.get('q');
    const categoryParam = params.get('category');

    if (imageIdParam) {
      const found = getImageById(imageIdParam);
      if (found) {
        setSelectedPreviewImage(found);
      }
    }

    if (viewParam && ['landing', 'explore', 'categories', 'about', 'user-dashboard', 'admin-dashboard'].includes(viewParam)) {
      if (viewParam === 'admin-dashboard' && !isAdmin) {
        setActiveView('landing');
      } else {
        setActiveView(viewParam);
      }
    }

    if (queryParam) {
      setFilters(prev => ({ ...prev, query: queryParam }));
      setActiveView('explore');
    }

    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
  }, []);

  // Update URL search parameters cleanly
  const syncUrl = (view: ActiveView, imageId?: string) => {
    const url = new URL(window.location.href);
    if (view !== 'landing') {
      url.searchParams.set('view', view);
    } else {
      url.searchParams.delete('view');
    }

    if (imageId) {
      url.searchParams.set('image', imageId);
    } else {
      url.searchParams.delete('image');
    }

    window.history.replaceState({}, '', url.toString());
  };

  const handleNavigateView = (view: ActiveView) => {
    if (view === 'user-dashboard' && !isAuthenticated) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    if (view === 'admin-dashboard' && !isAdmin) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }

    setActiveView(view);
    syncUrl(view, selectedPreviewImage?.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPreview = (image: ImageItem) => {
    setSelectedPreviewImage(image);
    syncUrl(activeView, image.id);
  };

  const handleClosePreview = () => {
    setSelectedPreviewImage(null);
    syncUrl(activeView);
  };

  const handleOpenShare = (image: ImageItem) => {
    setSelectedShareImage(image);
  };

  const handleCloseShare = () => {
    setSelectedShareImage(null);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthNotice(null);
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleRequireAuth = (message?: string) => {
    setAuthNotice(message || 'Please sign in to continue.');
    setAuthModalMode('login');
    setAuthModalOpen(true);
  };

  const handleOpenUpload = () => {
    if (!isAuthenticated) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
    } else {
      setUploadModalOpen(true);
    }
  };

  const handleNavigateToExploreWithSearch = (searchTerm?: string, categoryId?: string) => {
    setFilters(prev => ({
      ...prev,
      query: searchTerm !== undefined ? searchTerm : prev.query,
      category: categoryId !== undefined ? categoryId : prev.category,
    }));
    handleNavigateView('explore');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-800 antialiased selection:bg-slate-900 selection:text-white">
      {/* If in Admin Studio, render dedicated separated Admin Dashboard interface */}
      {activeView === 'admin-dashboard' ? (
        <AdminDashboard
          onSelectImage={handleOpenPreview}
          onExitAdmin={() => handleNavigateView('landing')}
          onOpenUpload={handleOpenUpload}
        />
      ) : (
        <>
          {/* Public / User Header */}
          <Header
            activeView={activeView}
            setActiveView={handleNavigateView}
            onOpenAuth={handleOpenAuth}
            onOpenUpload={handleOpenUpload}
            onNavigateUserDashboard={tab => setUserDashboardTab(tab)}
          />

          {/* View Routing */}
          <main className="flex-1">
            {activeView === 'landing' && (
              <PublicLanding
                onSelectImage={handleOpenPreview}
                onShareImage={handleOpenShare}
                onNavigateToExplore={handleNavigateToExploreWithSearch}
                onOpenUpload={handleOpenUpload}
                onRequireAuth={handleRequireAuth}
              />
            )}

            {activeView === 'explore' && (
              <ExplorePage
                onSelectImage={handleOpenPreview}
                onShareImage={handleOpenShare}
                onOpenUpload={handleOpenUpload}
                onRequireAuth={handleRequireAuth}
              />
            )}

            {activeView === 'categories' && (
              <CategoriesPage
                onSelectCategory={(categoryId) => {
                  setFilters(prev => ({ ...prev, category: categoryId }));
                  handleNavigateView('explore');
                }}
                onNavigateToAdmin={() => handleNavigateView('admin-dashboard')}
              />
            )}

            {activeView === 'user-dashboard' && (
              <UserDashboard
                initialTab={userDashboardTab}
                onSelectImage={handleOpenPreview}
                onShareImage={handleOpenShare}
                onOpenUpload={handleOpenUpload}
              />
            )}

            {activeView === 'about' && (
              <AboutPage
                onOpenUpload={handleOpenUpload}
                onExplore={() => handleNavigateView('explore')}
              />
            )}
          </main>

          {/* Footer on public surfaces */}
          <Footer
            setActiveView={handleNavigateView}
            onOpenUpload={handleOpenUpload}
          />
        </>
      )}

      {/* Global Modals */}
      <ImagePreviewModal
        image={selectedPreviewImage}
        isOpen={!!selectedPreviewImage}
        onClose={handleClosePreview}
        onShare={handleOpenShare}
        onSelectImage={handleOpenPreview}
        onSelectTag={(tag) => handleNavigateToExploreWithSearch(tag)}
        onRequireAuth={handleRequireAuth}
      />

      <ShareModal
        image={selectedShareImage}
        isOpen={!!selectedShareImage}
        onClose={handleCloseShare}
      />

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        notice={authNotice}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          // Cleared notice upon successful login
          setAuthNotice(null);
        }}
      />

      <ImageUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={() => {
          // Upload submitted to moderation
          if (activeView === 'user-dashboard') {
            // refreshed automatically by ImageContext
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ImageProvider>
        <MainApp />
      </ImageProvider>
    </AuthProvider>
  );
}
