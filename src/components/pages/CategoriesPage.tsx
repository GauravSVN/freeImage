import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Layers,
  Sparkles,
  Plus,
  Image as ImageIcon,
  Edit2,
  Trash2,
  Upload,
  FolderOpen,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useImages } from '../../context/ImageContext';
import { useAuth } from '../../context/AuthContext';
import { Category } from '../../types';

interface CategoriesPageProps {
  onSelectCategory: (categoryId: string) => void;
  onNavigateToAdmin?: () => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  onSelectCategory,
  onNavigateToAdmin,
}) => {
  const { categories, approvedImages, addCategory, updateCategory, deleteCategory } = useImages();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Admin Category Editor Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catCover, setCatCover] = useState('');

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryImages = (catId: string) => {
    return approvedImages.filter(img => img.categoryId === catId);
  };

  const handleOpenAddModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCategory(null);
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setCatCover('');
    setShowEditModal(true);
  };

  const handleOpenEditModal = (e: React.MouseEvent, cat: Category) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description);
    setCatCover(cat.coverUrl || '');
    setShowEditModal(true);
  };

  const handleDeleteCategory = (e: React.MouseEvent, cat: Category) => {
    e.stopPropagation();
    if (confirm(`Admin Action: Are you sure you want to delete category "${cat.name}"?`)) {
      deleteCategory(cat.id);
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (!catName.trim()) return;

    const slug = catSlug.trim() || catName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catName.trim(),
        slug,
        description: catDesc.trim(),
        coverUrl: catCover.trim(),
      });
    } else {
      addCategory({
        name: catName.trim(),
        slug,
        description: catDesc.trim(),
        coverUrl: catCover.trim(),
      });
    }

    setShowEditModal(false);
  };

  // Handle local image file upload for category cover
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        setCatCover(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-2">
              Curated Stock Taxonomies
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-slate-900 tracking-tight">
              Explore by Categories
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Discover authentic high-resolution photography categorized by theme and subject. All categories are curated by the platform administrator.
            </p>
          </div>

          {/* Search & Admin Add Controls */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs transition-all"
              />
            </div>

            {isAdmin && (
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Admin Add Category Quick Card */}
          {isAdmin && (
            <div
              onClick={handleOpenAddModal}
              className="border-2 border-dashed border-slate-300 hover:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-white bg-slate-50/50 min-h-[300px] group shadow-2xs hover:shadow-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 group-hover:bg-slate-900 group-hover:text-white text-slate-700 flex items-center justify-center mb-3 transition-colors shadow-2xs">
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Add New Category</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                Create a custom category with name, slug, description, and custom cover photo.
              </p>
              <span className="mt-4 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold group-hover:bg-slate-800 transition-colors">
                + Create Category
              </span>
            </div>
          )}

          {filteredCategories.map(cat => {
            const catImages = getCategoryImages(cat.id);
            const count = catImages.length;
            // Use admin-defined coverUrl OR the latest uploaded photo in this category
            const displayCover = cat.coverUrl || (count > 0 ? catImages[0].url : null);

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Visual Cover Stage */}
                <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                  {displayCover ? (
                    <>
                      <img
                        src={displayCover}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                    </>
                  ) : (
                    /* Minimal Editorial Stage (No random images) */
                    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 mb-3 group-hover:scale-110 group-hover:text-emerald-400 transition-all">
                        <FolderOpen className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">
                        {count > 0 ? `${count} Photos inside` : 'Awaiting admin photography'}
                      </span>
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    {/* Photo Count Badge */}
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-xs">
                      {count} {count === 1 ? 'Photograph' : 'Photographs'}
                    </span>

                    {/* Admin Direct Edit & Delete Controls */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-xl p-1 border border-white/15">
                        <button
                          onClick={e => handleOpenEditModal(e, cat)}
                          className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                          title="Admin: Edit category details or set cover"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={e => handleDeleteCategory(e, cat)}
                          className="p-1.5 text-rose-300 hover:text-rose-100 hover:bg-rose-600/40 rounded-lg transition-colors cursor-pointer"
                          title="Admin: Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Category Title on image bottom */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <h3 className="text-xl font-serif-display font-bold text-white drop-shadow-sm">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Card Content & CTA */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {cat.description || 'Curated high-resolution photography collection.'}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      /{cat.slug}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search State */}
        {filteredCategories.length === 0 && (
          <div className="py-16 text-center max-w-sm mx-auto">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-900">No categories found</h3>
            <p className="text-xs text-slate-500 mt-1">
              No categories match your search term "{searchTerm}".
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* ADMIN CATEGORY EDIT / CREATE MODAL                        */}
      {/* ========================================================= */}
      {isAdmin && showEditModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingCategory ? 'Admin: Edit Category' : 'Admin: Create New Category'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage category details and set custom cover photograph.
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wildlife & Animals"
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Slug (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. wildlife"
                  value={catSlug}
                  onChange={e => setCatSlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short description for this collection..."
                  value={catDesc}
                  onChange={e => setCatDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {/* Cover Image Uploader / URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Cover Photograph
                </label>
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="Paste image URL (or leave blank to auto-use uploaded photos)"
                    value={catCover}
                    onChange={e => setCatCover(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />

                  {/* Or file upload */}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileUpload}
                        className="hidden"
                      />
                    </label>

                    {catCover && (
                      <button
                        type="button"
                        onClick={() => setCatCover('')}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Remove Cover
                      </button>
                    )}
                  </div>

                  {catCover && (
                    <div className="mt-2 relative h-24 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                      <img
                        src={catCover}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
