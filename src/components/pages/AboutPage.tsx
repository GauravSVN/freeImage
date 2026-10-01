import React from 'react';
import { Shield, Sparkles, Check, ArrowRight, Camera, FileCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AboutPageProps {
  onOpenUpload?: () => void;
  onExplore: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenUpload, onExplore }) => {
  const { isAdmin } = useAuth();
  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Open Licensing & Quality Manifesto
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif-display font-bold text-slate-900 mt-2">
            Visual freedom for creators, designers, and storytellers
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            FreeImage Pro was founded on the principle that exceptional visual composition should be accessible without artificial friction, watermarks, or deceptive subscription traps.
          </p>
        </div>

        {/* License Grid */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif-display font-bold text-slate-900">
                FreeImage Pro Open Content License
              </h2>
              <p className="text-xs text-slate-500">Simple, transparent, and built for modern creative pipelines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 text-xs text-slate-700">
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>What is permitted</span>
              </h3>
              <ul className="space-y-2 text-slate-600 pl-6 list-disc">
                <li>All photos on FreeImage Pro can be downloaded and used for free</li>
                <li>Commercial and non-commercial project usage permitted</li>
                <li>No permission needed from the creator (attribution appreciated)</li>
                <li>Modification, color grading, cropping, and compositing allowed</li>
                <li>Websites, applications, print publications, and commercial campaigns</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-slate-900" />
                <span>What is prohibited</span>
              </h3>
              <ul className="space-y-2 text-slate-600 pl-6 list-disc">
                <li>Photos cannot be resold as standalone stock files without modification</li>
                <li>Do not compile photos from FreeImage Pro to replicate a competing service</li>
                <li>Do not imply endorsement of your product by persons depicted</li>
                <li>Trademarked logos or protected intellectual property require independent clearance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Curation Standards */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif-display font-bold text-slate-900">
                Editorial Curation Standards
              </h2>
              <p className="text-xs text-slate-500">How our moderation team reviews community submissions</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
            <p>
              To maintain our standard of excellence, every photograph submitted to FreeImage Pro enters our Curator Moderation Queue. Our lead editors inspect each submission for:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-semibold text-slate-900 mb-1">01. Optical Sharpness</h4>
                <p className="text-[11px] text-slate-500">
                  Minimum 2000px resolution with accurate focus, minimal sensor noise, and authentic dynamic range.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-semibold text-slate-900 mb-1">02. Authentic Framing</h4>
                <p className="text-[11px] text-slate-500">
                  Human-crafted compositions with intentional lighting and genuine narrative depth.
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-semibold text-slate-900 mb-1">03. Clean Metadata</h4>
                <p className="text-[11px] text-slate-500">
                  Accurate titles, category categorization, and technical EXIF details where available.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className="text-center pt-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Start Exploring Photography
            </button>
            {isAdmin && onOpenUpload && (
              <button
                onClick={onOpenUpload}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Upload Photo (Admin)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
