import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Bookmark,
  Heart,
  Download,
  User as UserIcon,
  Settings,
  CheckCircle2,
  Info,
  Plus,
  Minus,
  Upload,
  Lock,
  X,
  ExternalLink,
  Share2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useImages } from '../../context/ImageContext';
import { UserDashboardTab, ImageItem } from '../../types';
import { MasonryGrid } from '../gallery/MasonryGrid';

interface UserDashboardProps {
  initialTab?: UserDashboardTab;
  onSelectImage: (image: ImageItem) => void;
  onShareImage: (image: ImageItem) => void;
  onOpenUpload?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  initialTab = 'overview',
  onSelectImage,
  onShareImage,
  onOpenUpload,
}) => {
  const { currentUser, updateProfile, logout } = useAuth();
  const {
    getUserSavedImages,
    getUserLikedImages,
    getUserDownloads,
    getUserShares,
    getImageById,
  } = useImages();

  const [activeTab, setActiveTab] = useState<UserDashboardTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states based on Images 3, 4, 5, 6, 7
  const [firstName, setFirstName] = useState(currentUser?.firstName || currentUser?.name?.split(' ')[0] || 'Marcus');
  const [lastName, setLastName] = useState(currentUser?.lastName || currentUser?.name?.split(' ').slice(1).join(' ') || 'Sterling');
  const [email, setEmail] = useState(currentUser?.email || 'user@freeimagepro.com');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '');

  // Donation Link
  const [donationPlatform, setDonationPlatform] = useState(currentUser?.donationPlatform || 'PayPal');
  const [donationLink, setDonationLink] = useState(currentUser?.donationLink || 'paypal.com, paypal.me');
  const [hasDonationLink, setHasDonationLink] = useState(true);

  // Password Change
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangedSuccess, setPasswordChangedSuccess] = useState(false);

  // About You (Image 5)
  const [bio, setBio] = useState(currentUser?.bio || 'Landscape photographer and outdoor enthusiast capturing alpine peaks and remote wilderness.');
  const [location, setLocation] = useState(currentUser?.location || 'San Francisco, CA');
  const [website, setWebsite] = useState(currentUser?.website || 'https://marcussterling.photography');
  const [socialX, setSocialX] = useState(currentUser?.socialX || '');
  const [socialInstagram, setSocialInstagram] = useState(currentUser?.socialInstagram || '');
  const [socialYoutube, setSocialYoutube] = useState(currentUser?.socialYoutube || '');
  const [socialTiktok, setSocialTiktok] = useState(currentUser?.socialTiktok || '');

  // Additional Settings (Images 6 & 7)
  const [optOutAiTraining, setOptOutAiTraining] = useState(currentUser?.optOutAiTraining || false);
  const [displayMessageButton, setDisplayMessageButton] = useState(currentUser?.displayMessageButton || false);
  const [openToUsageEmail, setOpenToUsageEmail] = useState(currentUser?.openToUsageEmail !== false);

  // Preferences modal mock
  const [showEmailPrefsNotice, setShowEmailPrefsNotice] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) return null;

  const savedImages = getUserSavedImages(currentUser.id);
  const likedImages = getUserLikedImages(currentUser.id);
  const downloadsHistory = getUserDownloads(currentUser.id);
  const sharesHistory = getUserShares(currentUser.id);

  // Handle local avatar file upload
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        const newAvatar = ev.target.result as string;
        setAvatarUrl(newAvatar);
        updateProfile({ avatar: newAvatar });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || currentUser.name;

    updateProfile({
      name: fullName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      avatar: avatarUrl || currentUser.avatar,
      bio: bio.trim(),
      location: location.trim(),
      website: website.trim(),
      socialX: socialX.trim(),
      socialInstagram: socialInstagram.trim(),
      socialYoutube: socialYoutube.trim(),
      socialTiktok: socialTiktok.trim(),
      donationPlatform,
      donationLink: hasDonationLink ? donationLink.trim() : '',
      optOutAiTraining,
      displayMessageButton,
      openToUsageEmail,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setPasswordChangedSuccess(true);
    setTimeout(() => {
      setPasswordChangedSuccess(false);
      setShowPasswordChange(false);
      setCurrentPassword('');
      setNewPassword('');
    }, 1500);
  };

  const handleRemoveAccount = () => {
    if (confirm('Are you sure you want to permanently delete your account and all associated data? This action cannot be undone.')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ======================================================== */}
        {/* TOP PROFILE HEADER BANNER (Matches Image 3)              */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <img
                src={avatarUrl || currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-xs shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-serif-display font-bold text-slate-900">
                    {currentUser.name}
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                    @{currentUser.username}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-xl">
                  {bio || 'Landscape photographer and outdoor enthusiast capturing alpine peaks and remote wilderness.'}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-slate-400">
                  <span>Joined Feb 2025</span>
                  <span>·</span>
                  <span className="capitalize">{currentUser.role === 'admin' ? 'Curator Admin' : 'User Account'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                {currentUser.role === 'admin' ? 'Curator Admin' : 'Standard Member'}
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar (Image 3) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Saved Photos
              </span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {savedImages.length}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Liked Photos
              </span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {likedImages.length}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Downloads Made
              </span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {downloadsHistory.length || 1}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Shares Made
              </span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {sharesHistory.length}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Account Status
              </span>
              <span className="text-base font-bold text-emerald-600 mt-1 block capitalize">
                {currentUser.status}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* DASHBOARD BODY: Left Sidebar + Right Content Area        */}
        {/* ======================================================== */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left Sidebar (Image 3) */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xs space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Grid className="w-4 h-4" />
                  <span>Overview</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('saved')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'saved'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bookmark className="w-4 h-4" />
                  <span>Saved Photos</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  activeTab === 'saved' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {savedImages.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('liked')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'liked'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4" />
                  <span>Liked Photos</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  activeTab === 'liked' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {likedImages.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('downloads')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'downloads'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Download className="w-4 h-4" />
                  <span>Downloads History</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  activeTab === 'downloads' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {downloadsHistory.length || 1}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('shares')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'shares'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4" />
                  <span>Shares History</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  activeTab === 'shares' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {sharesHistory.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserIcon className="w-4 h-4" />
                  <span>Profile Settings</span>
                </div>
              </button>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="flex-1 w-full min-w-0">
            {/* 1. Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-2">Welcome Back, {currentUser.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                    Here is your personal creative dashboard. Explore high-resolution photography, manage your curated saved collections, and view your downloaded stock assets.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-slate-900">Your Recently Saved Photos</h4>
                    <button
                      onClick={() => setActiveTab('saved')}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      View all ({savedImages.length})
                    </button>
                  </div>
                  {savedImages.length === 0 ? (
                    <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center">
                      <Bookmark className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">No saved photos yet.</p>
                    </div>
                  ) : (
                    <MasonryGrid
                      images={savedImages.slice(0, 6)}
                      onSelectImage={onSelectImage}
                      onShareImage={onShareImage}
                    />
                  )}
                </div>
              </div>
            )}

            {/* 2. Saved Photos Tab */}
            {activeTab === 'saved' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-serif-display font-bold text-slate-900">Your Saved Collections</h2>
                  <p className="text-xs text-slate-500 mt-1">High-resolution stock photography bookmarked for your projects</p>
                </div>
                {savedImages.length === 0 ? (
                  <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center">
                    <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-slate-900">No saved photos yet</h3>
                    <p className="text-xs text-slate-500 mt-1">Click the bookmark icon on any photograph to save it to your collection.</p>
                  </div>
                ) : (
                  <MasonryGrid
                    images={savedImages}
                    onSelectImage={onSelectImage}
                    onShareImage={onShareImage}
                  />
                )}
              </div>
            )}

            {/* 3. Liked Photos Tab */}
            {activeTab === 'liked' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-serif-display font-bold text-slate-900">Liked Photographs</h2>
                  <p className="text-xs text-slate-500 mt-1">Photographs you have supported with likes</p>
                </div>
                {likedImages.length === 0 ? (
                  <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-slate-900">No liked photos yet</h3>
                    <p className="text-xs text-slate-500 mt-1">Click the heart icon on any photo to add it to your favorites.</p>
                  </div>
                ) : (
                  <MasonryGrid
                    images={likedImages}
                    onSelectImage={onSelectImage}
                    onShareImage={onShareImage}
                  />
                )}
              </div>
            )}

            {/* 4. Downloads History Tab */}
            {activeTab === 'downloads' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-serif-display font-bold text-slate-900">Downloads History</h2>
                  <p className="text-xs text-slate-500 mt-1">Record of high-resolution image files downloaded to your devices</p>
                </div>
                {downloadsHistory.length === 0 ? (
                  <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center">
                    <Download className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-slate-900">No downloads history</h3>
                    <p className="text-xs text-slate-500 mt-1">When you download photographs, they will appear here for easy re-access.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                    {downloadsHistory.map(record => {
                      const img = getImageById(record.imageId);
                      return (
                        <div key={record.id} className="p-4 flex items-center justify-between gap-4">
                          <div>
                            <h4 className="text-xs font-semibold text-slate-900">{img?.title || 'Stock Photograph'}</h4>
                            <span className="text-[11px] text-slate-400 capitalize">Quality: {record.quality}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">{new Date(record.createdAt).toLocaleDateString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 5. Shares History Tab */}
            {activeTab === 'shares' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-serif-display font-bold text-slate-900">Shares History</h2>
                  <p className="text-xs text-slate-500 mt-1">Record of image links and social shares generated by your account</p>
                </div>
                {sharesHistory.length === 0 ? (
                  <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center">
                    <Share2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-semibold text-slate-900">No shares history yet</h3>
                    <p className="text-xs text-slate-500 mt-1">When you share image links or post to social channels, your activity will be tracked here.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                    {sharesHistory.map(record => {
                      const img = getImageById(record.imageId);
                      return (
                        <div key={record.id} className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {img && (
                              <img
                                src={img.thumbnailUrl || img.url}
                                alt={img.title}
                                className="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-200"
                              />
                            )}
                            <div>
                              <h4 className="text-xs font-semibold text-slate-900">{img?.title || 'Stock Photograph'}</h4>
                              <span className="text-[11px] text-slate-500 capitalize">
                                Shared via <span className="font-semibold text-slate-700">{record.platform?.replace('_', ' ') || 'direct link'}</span>
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-400">{new Date(record.createdAt).toLocaleDateString()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* 5. PROFILE SETTINGS TAB (Matches Images 3, 4, 5, 6, 7)    */}
            {/* ======================================================== */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-3xl">
                {/* Title (Image 3) */}
                <h2 className="text-3xl font-serif-display font-bold text-slate-900 mb-8">
                  Profile settings
                </h2>

                {/* Save Confirmation Toast */}
                {savedSuccess && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-2xl flex items-center gap-2 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your profile settings have been successfully saved!</span>
                  </div>
                )}

                <form onSubmit={handleProfileSave} className="space-y-8">
                  {/* Avatar Section (Image 3) */}
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                    <img
                      src={avatarUrl || currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                    />
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2.5 bg-[#2ec486] hover:bg-[#28b078] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Change image
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* Names Section (Image 4) */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                          First name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                          Last name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      We'd like people to use real names in a community, so people would know who's who.
                    </p>
                  </div>

                  {/* Email Section (Image 4) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                    />
                  </div>

                  {/* Donation Link Section (Image 4) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Donation link
                    </label>

                    {hasDonationLink ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={donationPlatform}
                          onChange={e => setDonationPlatform(e.target.value)}
                          className="w-36 px-3 py-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                        >
                          <option value="PayPal">PayPal</option>
                          <option value="Buy Me a Coffee">Buy Me a Coffee</option>
                          <option value="Ko-fi">Ko-fi</option>
                          <option value="Stripe">Stripe</option>
                          <option value="Patreon">Patreon</option>
                        </select>

                        <input
                          type="text"
                          placeholder="paypal.com, paypal.me"
                          value={donationLink}
                          onChange={e => setDonationLink(e.target.value)}
                          className="flex-1 px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />

                        <button
                          type="button"
                          onClick={() => setHasDonationLink(false)}
                          className="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                          title="Remove donation link"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : null}

                    {!hasDonationLink && (
                      <button
                        type="button"
                        onClick={() => {
                          setHasDonationLink(true);
                          setDonationLink('paypal.com, paypal.me');
                        }}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add another</span>
                      </button>
                    )}
                  </div>

                  {/* Password Section (Image 4) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-800 mb-1">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Change password
                    </button>

                    {showPasswordChange && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 mt-2 animate-in fade-in">
                        {passwordChangedSuccess && (
                          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Password successfully updated!</span>
                          </div>
                        )}
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">Current Password</label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">New Password</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handlePasswordSubmit}
                            className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg"
                          >
                            Update Password
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowPasswordChange(false)}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ======================================================== */}
                  {/* ABOUT YOU SECTION (Matches Image 5)                      */}
                  {/* ======================================================== */}
                  <div className="pt-6 border-t border-slate-100 space-y-5">
                    <h3 className="text-2xl font-serif-display font-bold text-slate-900">
                      About you
                    </h3>

                    {/* Short bio */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-slate-800">
                          Short bio
                        </label>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {bio.length} of 130
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        maxLength={130}
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        placeholder="Tell the community about yourself..."
                        className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 leading-relaxed"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Brief description for your profile.
                      </p>
                    </div>

                    {/* Location & Website Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                          Location
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. San Francisco, CA"
                          value={location}
                          onChange={e => setLocation(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          By sharing your location you help us to make your profile more discoverable.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                          Website
                        </label>
                        <input
                          type="url"
                          placeholder="https://yourwebsite.com"
                          value={website}
                          onChange={e => setWebsite(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">
                          Your portfolio or blog.
                        </p>
                      </div>
                    </div>

                    {/* Social Channels (X, Instagram, Youtube, TikTok) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                          X
                        </label>
                        <input
                          type="text"
                          placeholder="@username or URL"
                          value={socialX}
                          onChange={e => setSocialX(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                          Instagram
                        </label>
                        <input
                          type="text"
                          placeholder="@username or URL"
                          value={socialInstagram}
                          onChange={e => setSocialInstagram(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                          Youtube
                        </label>
                        <input
                          type="text"
                          placeholder="Channel name or URL"
                          value={socialYoutube}
                          onChange={e => setSocialYoutube(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                          TikTok
                        </label>
                        <input
                          type="text"
                          placeholder="@username or URL"
                          value={socialTiktok}
                          onChange={e => setSocialTiktok(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* MANAGE EMAIL NOTIFICATIONS (Matches Image 6)             */}
                  {/* ======================================================== */}
                  <div className="pt-6 border-t border-slate-100 space-y-3">
                    <h3 className="text-2xl font-serif-display font-bold text-slate-900">
                      Manage Email Notifications
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      We don't email often, but when we do, we try our best to deliver something packed with value for you.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowEmailPrefsNotice(true)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Manage your preferences
                    </button>

                    {showEmailPrefsNotice && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-center justify-between">
                        <span>Email digests and community updates are active.</span>
                        <button
                          type="button"
                          onClick={() => setShowEmailPrefsNotice(false)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ======================================================== */}
                  {/* ADDITIONAL SETTINGS (Matches Images 6 & 7)               */}
                  {/* ======================================================== */}
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h3 className="text-2xl font-serif-display font-bold text-slate-900">
                      Additional settings
                    </h3>

                    <div className="space-y-3">
                      {/* Checkbox 1 */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={optOutAiTraining}
                          onChange={e => setOptOutAiTraining(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                        />
                        <div className="flex items-center gap-1.5 text-xs text-slate-800 select-none">
                          <span>To opt out of your Content being used for future AI training, tick this box</span>
                          <span title="Your photographs will not be included in dataset downloads.">
                            <Info className="w-3.5 h-3.5 text-slate-400 inline" />
                          </span>
                        </div>
                      </label>

                      {/* Checkbox 2 */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={displayMessageButton}
                          onChange={e => setDisplayMessageButton(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                        />
                        <div className="flex items-center gap-1.5 text-xs text-slate-800 select-none">
                          <span>Display "Message" button on my profile</span>
                          <span title="Allow members to contact you for collaborations.">
                            <Info className="w-3.5 h-3.5 text-slate-400 inline" />
                          </span>
                        </div>
                      </label>

                      {/* Checkbox 3 */}
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={openToUsageEmail}
                          onChange={e => setOpenToUsageEmail(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                        />
                        <span className="text-xs text-slate-800 select-none">
                          I'm open to receiving an email when someone shares how they used my photo or video
                        </span>
                      </label>
                    </div>

                    {/* Remove account section (Image 6 & 7) */}
                    <div className="pt-6">
                      <h4 className="text-xs font-bold text-slate-900 mb-1">
                        Remove account and all the data
                      </h4>
                      <button
                        type="button"
                        onClick={handleRemoveAccount}
                        className="text-xs text-slate-500 underline hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        Remove account
                      </button>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* BOTTOM SAVE CHANGES BUTTON WITH SAVED NOTIFICATION        */}
                  {/* ======================================================== */}
                  <div className="pt-4 flex items-center gap-4">
                    <button
                      type="submit"
                      className={`px-8 py-3 font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2 ${
                        savedSuccess
                          ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                          : 'bg-[#2ec486] hover:bg-[#28b078] text-white'
                      }`}
                    >
                      {savedSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                          <span>Changes Saved!</span>
                        </>
                      ) : (
                        <span>Save changes</span>
                      )}
                    </button>

                    {savedSuccess && (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-150">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Profile updated successfully!</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
