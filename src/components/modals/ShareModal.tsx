import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Twitter, Facebook, Mail, Share2 } from 'lucide-react';
import { ImageItem } from '../../types';
import { useImages } from '../../context/ImageContext';

interface ShareModalProps {
  image: ImageItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ image, isOpen, onClose }) => {
  const { recordShare } = useImages();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !image) return null;

  // Build direct share URL
  const shareUrl = `${window.location.origin}${window.location.pathname}?image=${image.id}`;
  const shareTitle = `"${image.title}" by ${image.authorName} on FreeImage Pro`;
  const shareText = `Discover high-resolution photography: "${image.title}" on FreeImage Pro.`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      recordShare(image.id, 'copy_link');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy to clipboard', e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onClose();
      } catch (e) {
        console.error('Native share aborted or failed', e);
      }
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Share Photography</h3>
            <p className="text-xs text-slate-500 mt-0.5">Share with clients, team members, or social followers</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview info */}
        <div className="flex items-center gap-3 my-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <img
            src={image.thumbnailUrl || image.url}
            alt={image.title}
            className="w-14 h-14 object-cover rounded-lg shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{image.title}</h4>
            <p className="text-xs text-slate-500 truncate">By {image.authorName} · {image.categoryName}</p>
          </div>
        </div>

        {/* Copy Link input */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">Direct Image Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-700 select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Share Options */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-700">Share to Social Channels</p>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordShare(image.id, 'whatsapp')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-700 text-xs font-medium transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span>WhatsApp</span>
            </a>

            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordShare(image.id, 'twitter')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Twitter className="w-4 h-4" />
              </div>
              <span>X (Twitter)</span>
            </a>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => recordShare(image.id, 'facebook')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-slate-700 text-xs font-medium transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <Facebook className="w-4 h-4" />
              </div>
              <span>Facebook</span>
            </a>

            <a
              href={emailUrl}
              onClick={() => recordShare(image.id, 'email')}
              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-600 text-white flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <span>Email</span>
            </a>
          </div>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full mt-3 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>More sharing options (Device Share)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
