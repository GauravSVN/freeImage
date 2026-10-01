import React, { useState } from 'react';
import {
  ShieldCheck,
  Image as ImageIcon,
  Users,
  Layers,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Search,
  Filter,
  ArrowUpRight,
  Download,
  Heart,
  Plus,
  Edit2,
  AlertTriangle,
  ArrowLeft,
  Eye,
  Check,
  Upload,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useImages } from '../../context/ImageContext';
import { AdminDashboardTab, ImageItem, Category } from '../../types';

interface AdminDashboardProps {
  onSelectImage: (image: ImageItem) => void;
  onExitAdmin: () => void;
  onOpenUpload: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSelectImage,
  onExitAdmin,
  onOpenUpload,
}) => {
  const { currentUser, isAdmin, usersList, toggleUserStatus } = useAuth();
  const {
    images,
    pendingImages,
    approvedImages,
    rejectedImages,
    categories,
    shares,
    moderationLogs,
    approveImage,
    rejectImage,
    deleteAdminImage,
    addCategory,
    updateCategory,
    deleteCategory,
    clearAllSampleImages,
  } = useImages();

  const [activeTab, setActiveTab] = useState<AdminDashboardTab>('overview');
  const [imageSearch, setImageSearch] = useState('');
  const [imageStatusFilter, setImageStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [userSearch, setUserSearch] = useState('');

  // Category Modal State
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catCover, setCatCover] = useState('');

  // Reject reason dialog state
  const [rejectDialogImageId, setRejectDialogImageId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Low lighting / does not meet minimum sharpness standards.');

  // Access Control verification
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-2">Restricted Access — Admin Credentials Required</h2>
        <p className="text-xs text-slate-400 max-w-md mb-6">
          This administration dashboard is restricted to authorized platform curators and system administrators. Your account does not have permission to access these tools.
        </p>
        <button
          onClick={onExitAdmin}
          className="px-5 py-2.5 bg-white text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors"
        >
          Return to Public Platform
        </button>
      </div>
    );
  }

  // Summary Metrics calculations
  const totalDownloads = images.reduce((acc, img) => acc + img.downloadsCount, 0);
  const totalLikes = images.reduce((acc, img) => acc + img.likesCount, 0);
  const totalShares = images.reduce((acc, img) => acc + (img.sharesCount || 0), 0) + (shares ? shares.length : 0);

  // Filtered Images for Image Management Tab
  const filteredAdminImages = images.filter(img => {
    const matchesStatus = imageStatusFilter === 'all' || img.status === imageStatusFilter;
    const matchesSearch =
      !imageSearch.trim() ||
      img.title.toLowerCase().includes(imageSearch.toLowerCase()) ||
      img.authorName.toLowerCase().includes(imageSearch.toLowerCase()) ||
      img.categoryName.toLowerCase().includes(imageSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered Users
  const filteredUsers = usersList.filter(
    u =>
      !userSearch.trim() ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleOpenCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCatId(cat.id);
      setCatName(cat.name);
      setCatSlug(cat.slug);
      setCatDesc(cat.description);
      setCatCover(cat.coverUrl);
    } else {
      setEditingCatId(null);
      setCatName('');
      setCatSlug('');
      setCatDesc('');
      setCatCover('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80');
    }
    setShowCatModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catSlug.trim()) return;

    if (editingCatId) {
      updateCategory(editingCatId, {
        name: catName.trim(),
        slug: catSlug.trim().toLowerCase(),
        description: catDesc.trim(),
        coverUrl: catCover.trim(),
      });
    } else {
      addCategory({
        name: catName.trim(),
        slug: catSlug.trim().toLowerCase(),
        description: catDesc.trim(),
        coverUrl: catCover.trim(),
      });
    }
    setShowCatModal(false);
  };

  const handleConfirmReject = () => {
    if (rejectDialogImageId) {
      rejectImage(rejectDialogImageId, rejectionReason);
      setRejectDialogImageId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Site</span>
            </button>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white">FreeImage Pro Admin Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-semibold uppercase tracking-wider">
                Curator Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs transition-colors cursor-pointer"
              title="Upload photograph as administrator"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to remove all sample / default images? This will leave the gallery clean for your own uploads.')) {
                  clearAllSampleImages();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800/40 hover:bg-rose-900/60 text-xs text-rose-300 font-medium transition-colors"
              title="Remove sample images"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Sample Images</span>
            </button>

            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-400">Head of Platform Moderation</p>
            </div>
            <img
              src={currentUser?.avatar}
              alt="Admin avatar"
              className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
            />
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1 flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-medium rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab('moderation')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'moderation'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>Moderation Queue</span>
            {pendingImages.length > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'moderation' ? 'bg-slate-950 text-amber-400' : 'bg-rose-600 text-white'
                }`}
              >
                {pendingImages.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('images')}
            className={`px-4 py-2 text-xs font-medium rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'images'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Images Management ({images.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-medium rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Users ({usersList.length})
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 text-xs font-medium rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Categories ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 text-xs font-medium rounded-xl transition-colors whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Audit Logs
          </button>
        </div>

        {/* 1. Dashboard Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metric Scorecards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Users
                </span>
                <span className="text-2xl font-bold text-white tabular-nums mt-1 block">
                  {usersList.length}
                </span>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Total Images
                </span>
                <span className="text-2xl font-bold text-white tabular-nums mt-1 block">
                  {images.length}
                </span>
              </div>

              <div className="p-4 bg-amber-950/30 rounded-2xl border border-amber-900/40">
                <span className="block text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                  Pending Review
                </span>
                <span className="text-2xl font-bold text-amber-300 tabular-nums mt-1 block">
                  {pendingImages.length}
                </span>
              </div>

              <div className="p-4 bg-emerald-950/30 rounded-2xl border border-emerald-900/40">
                <span className="block text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                  Approved
                </span>
                <span className="text-2xl font-bold text-emerald-300 tabular-nums mt-1 block">
                  {approvedImages.length}
                </span>
              </div>

              <div className="p-4 bg-rose-950/30 rounded-2xl border border-rose-900/40">
                <span className="block text-[11px] font-semibold text-rose-400 uppercase tracking-wider">
                  Rejected
                </span>
                <span className="text-2xl font-bold text-rose-300 tabular-nums mt-1 block">
                  {rejectedImages.length}
                </span>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Downloads
                </span>
                <span className="text-2xl font-bold text-white tabular-nums mt-1 block">
                  {totalDownloads.toLocaleString()}
                </span>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Likes Count
                </span>
                <span className="text-2xl font-bold text-white tabular-nums mt-1 block">
                  {totalLikes.toLocaleString()}
                </span>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <span className="block text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                  Total Shares
                </span>
                <span className="text-2xl font-bold text-amber-300 tabular-nums mt-1 block">
                  {totalShares.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Pending Moderation Callout if items exist */}
            {pendingImages.length > 0 && (
              <div className="p-5 bg-amber-950/30 border border-amber-800/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-amber-200">
                      {pendingImages.length} Photographs Awaiting Curator Review
                    </h4>
                    <p className="text-xs text-amber-300/80">
                      User submissions require inspection before syndicating to the public Explore grid.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('moderation')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shrink-0"
                >
                  Open Moderation Queue
                </button>
              </div>
            )}

            {/* Quick Overview Split: Recent Submissions & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Pending/Approved Items */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-sm font-semibold text-white mb-4">Latest Platform Submissions</h3>
                <div className="space-y-3">
                  {images.slice(0, 5).map(img => (
                    <div
                      key={img.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={img.thumbnailUrl || img.url}
                          alt={img.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate max-w-[180px] sm:max-w-xs">
                            {img.title}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            By {img.authorName} · {img.categoryName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider ${
                            img.status === 'approved'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : img.status === 'pending'
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                              : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                          }`}
                        >
                          {img.status}
                        </span>
                        <button
                          onClick={() => onSelectImage(img)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Moderation Activity Feed */}
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                <h3 className="text-sm font-semibold text-white mb-4">Curator Action Audit Log</h3>
                <div className="space-y-3">
                  {moderationLogs.slice(0, 5).map(log => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex items-start gap-3"
                    >
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                          log.action === 'approve'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : log.action === 'reject'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {log.action === 'approve' && <Check className="w-3.5 h-3.5" />}
                        {log.action === 'reject' && <XCircle className="w-3.5 h-3.5" />}
                        {log.action === 'delete' && <Trash2 className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white capitalize">
                            {log.action}d "{log.imageTitle}"
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Moderator: {log.adminName}
                        </p>
                        {log.reason && (
                          <p className="text-[11px] text-rose-400/90 mt-1 italic">
                            Reason: "{log.reason}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Moderation Queue Tab */}
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white">Pending Photo Moderation Queue</h3>
                <p className="text-xs text-slate-400">
                  Review submitted imagery for authentic quality, technical sharpness, and copyright compliance.
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-amber-400">
                {pendingImages.length} awaiting approval
              </span>
            </div>

            {pendingImages.length === 0 ? (
              <div className="p-16 text-center bg-slate-900 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-white">Moderation Queue Clear</h4>
                <p className="text-xs text-slate-400 mt-1">
                  All user submissions have been reviewed. New creator uploads will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingImages.map(img => (
                  <div
                    key={img.id}
                    className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-lg"
                  >
                    {/* Image Preview Area */}
                    <div
                      onClick={() => onSelectImage(img)}
                      className="relative h-64 bg-black flex items-center justify-center cursor-pointer group"
                    >
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-md rounded-md text-[11px] font-mono text-white">
                        {img.width} × {img.height} px
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-white/90 text-slate-900 text-xs font-semibold rounded-lg flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Full Details</span>
                        </span>
                      </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-semibold text-white">{img.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">{img.description}</p>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold uppercase tracking-wider shrink-0">
                            Pending
                          </span>
                        </div>

                        {/* Author & Technical details */}
                        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="block text-[11px] text-slate-500">Creator</span>
                            <span className="font-medium text-slate-300">{img.authorName}</span>
                          </div>
                          <div>
                            <span className="block text-[11px] text-slate-500">Category</span>
                            <span className="font-medium text-slate-300">{img.categoryName}</span>
                          </div>
                          <div>
                            <span className="block text-[11px] text-slate-500">Format & Size</span>
                            <span className="font-mono text-slate-300">{img.fileType} · {img.fileSize}</span>
                          </div>
                          <div>
                            <span className="block text-[11px] text-slate-500">Submitted</span>
                            <span className="text-slate-300">{new Date(img.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {img.tags.map(t => (
                            <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded-md">
                              #{t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Moderation Actions Bar */}
                      <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => setRejectDialogImageId(img.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject Photo</span>
                        </button>
                        <button
                          onClick={() => approveImage(img.id)}
                          className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-md cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Publish</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Images Management Tab */}
        {activeTab === 'images' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter images by title, author, or category..."
                  value={imageSearch}
                  onChange={e => setImageSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setImageStatusFilter(st)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                      imageStatusFilter === st
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Images Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5 pl-6">Photograph</th>
                      <th className="p-3.5">Author</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-center">Likes</th>
                      <th className="p-3.5 text-center">Downloads</th>
                      <th className="p-3.5 pr-6 text-right">Moderator Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredAdminImages.map(img => (
                      <tr key={img.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 pl-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={img.thumbnailUrl || img.url}
                              alt={img.title}
                              className="w-12 h-12 rounded-lg object-cover shrink-0 cursor-pointer"
                              onClick={() => onSelectImage(img)}
                            />
                            <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                              <span
                                onClick={() => onSelectImage(img)}
                                className="font-semibold text-white truncate block hover:text-amber-400 cursor-pointer"
                              >
                                {img.title}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {img.width} × {img.height}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 text-slate-300">{img.authorName}</td>

                        <td className="p-3.5 text-slate-300">{img.categoryName}</td>

                        <td className="p-3.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider ${
                              img.status === 'approved'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                                : img.status === 'pending'
                                ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                                : 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                            }`}
                          >
                            {img.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-center font-mono tabular-nums text-slate-300">
                          {img.likesCount}
                        </td>

                        <td className="p-3.5 text-center font-mono tabular-nums text-slate-300">
                          {img.downloadsCount}
                        </td>

                        <td className="p-3.5 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {img.status !== 'approved' && (
                              <button
                                onClick={() => approveImage(img.id)}
                                className="px-2.5 py-1 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-medium transition-colors"
                              >
                                Approve
                              </button>
                            )}

                            {img.status !== 'rejected' && (
                              <button
                                onClick={() => rejectImage(img.id, 'Moderator manual override.')}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-medium transition-colors"
                              >
                                Reject
                              </button>
                            )}

                            <button
                              onClick={() => {
                                if (confirm(`Permanently remove image "${img.title}"?`)) {
                                  deleteAdminImage(img.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. Users Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search users by name, username, or email..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <span className="text-xs text-slate-400">
                {filteredUsers.length} registered accounts
              </span>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5 pl-6">User / Photographer</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Joined Date</th>
                      <th className="p-3.5 pr-6 text-right">Account Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5 pl-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <span className="font-semibold text-white block">{u.name}</span>
                              <span className="text-[11px] text-slate-400">@{u.username}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 text-slate-300 font-mono text-[11px]">{u.email}</td>

                        <td className="p-3.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-md font-semibold uppercase tracking-wider ${
                              u.status === 'active'
                                ? 'bg-emerald-950/60 text-emerald-400'
                                : 'bg-rose-950/60 text-rose-400'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-slate-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-3.5 pr-6 text-right">
                          <button
                            onClick={() => toggleUserStatus(u.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              u.status === 'active'
                                ? 'bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-slate-300'
                                : 'bg-emerald-600/80 hover:bg-emerald-600 text-white'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend User' : 'Activate User'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. Categories Management Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-white">Platform Curated Categories</h3>
                <p className="text-xs text-slate-400">Manage tags and taxonomies used across explore search</p>
              </div>
              <button
                onClick={() => handleOpenCategoryModal()}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(cat => {
                const count = images.filter(img => img.categoryId === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-32 bg-slate-950">
                      <img
                        src={cat.coverUrl}
                        alt={cat.name}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-mono text-white">
                        {count} {count === 1 ? 'photo' : 'photos'}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{cat.name}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                        <span className="text-[10px] text-amber-400 font-mono mt-2 block">
                          slug: /{cat.slug}
                        </span>
                      </div>

                      <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenCategoryModal(cat)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete category "${cat.name}"?`)) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. Audit Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="text-base font-semibold text-white">System Moderation & Audit Trail</h3>
              <p className="text-xs text-slate-400">Verifiable chronological record of all curator decisions</p>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="divide-y divide-slate-800/80">
                {moderationLogs.map(log => (
                  <div key={log.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          log.action === 'approve'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : log.action === 'reject'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {log.action === 'approve' && <Check className="w-4 h-4" />}
                        {log.action === 'reject' && <XCircle className="w-4 h-4" />}
                        {log.action === 'delete' && <Trash2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">
                          <span className="capitalize">{log.action}</span> action applied to photograph "{log.imageTitle}"
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Executed by Curator {log.adminName}
                        </p>
                        {log.reason && (
                          <p className="text-[11px] text-rose-400 mt-0.5">Reason: {log.reason}</p>
                        )}
                      </div>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Add/Edit Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-semibold text-white mb-1">
              {editingCatId ? 'Edit Category' : 'Add New Category'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">Organize photographs into discovery taxonomy</p>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Street & Urban"
                  value={catName}
                  onChange={e => {
                    setCatName(e.target.value);
                    if (!editingCatId && !catSlug) {
                      setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Slug Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. street-urban"
                  value={catSlug}
                  onChange={e => setCatSlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief description for category banner..."
                  value={catDesc}
                  onChange={e => setCatDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={catCover}
                  onChange={e => setCatCover(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-colors"
                >
                  {editingCatId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Reason Confirmation Dialog */}
      {rejectDialogImageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-semibold text-white mb-1">Reject Photograph Submission</h3>
            <p className="text-xs text-slate-400 mb-4">
              Select or customize the feedback provided to the submitting creator:
            </p>

            <div className="space-y-3 mb-5">
              {[
                'Low lighting / does not meet minimum sharpness standards.',
                'Copyright or brand trademark violation detected.',
                'Duplicate submission or corrupt file resolution.',
                'Image orientation or composition requires re-framing.',
              ].map(reason => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setRejectionReason(reason)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-colors ${
                    rejectionReason === reason
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {reason}
                </button>
              ))}

              <textarea
                rows={2}
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 mt-2"
                placeholder="Or type a custom rejection explanation..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRejectDialogImageId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
