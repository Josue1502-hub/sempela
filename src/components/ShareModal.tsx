/**
 * SEMPela - ShareModal Component
 * Share sheet for sharing videos via various channels.
 * Author: Josué Sempela
 */

import React from 'react';
import { X, Link2, MessageCircle, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { Video } from '../store/useVideoStore';
import { useVideoStore } from '../store/useVideoStore';
import { useTranslation } from '../lib/i18n';

interface ShareModalProps {
  video: Video;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ video, onClose }) => {
  const { language } = useVideoStore();
  const { t } = useTranslation(language);
  const [copied, setCopied] = React.useState(false);

  const shareUrl = `${window.location.origin}?v=${video.id}`;
  const shareText = `Check out "${video.title}" on SEMPela! 🎬`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success(t('linkCopied'), {
        style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: shareText,
          url: shareUrl,
        });
        onClose();
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-zinc-900 rounded-t-3xl p-6 pb-10 animate-slide-up"
        style={{ animation: 'slideUp 0.3s ease' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-bold text-lg">{t('shareVideo')}</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video preview */}
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 mb-6">
          <div className="w-14 h-14 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
            {video.thumbnailUrl ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{video.title}</p>
            <p className="text-white/50 text-xs">{video.username || '@user'}</p>
          </div>
        </div>

        {/* Share options grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <ShareOption
            icon={<MessageCircle className="w-6 h-6" />}
            label="WhatsApp"
            color="bg-green-500"
            onClick={handleWhatsApp}
          />
          <ShareOption
            icon={
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.845L1.254 2.25H8.08l4.254 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
            }
            label="X (Twitter)"
            color="bg-zinc-800"
            onClick={handleTwitter}
          />
          <ShareOption
            icon={
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            }
            label="Facebook"
            color="bg-blue-600"
            onClick={handleFacebook}
          />
          <ShareOption
            icon={<Link2 className="w-6 h-6" />}
            label="More"
            color="bg-zinc-700"
            onClick={handleNativeShare}
          />
        </div>

        {/* Copy link */}
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-4">
          <Link2 className="w-5 h-5 text-white/50 flex-shrink-0" />
          <span className="text-white/60 text-sm truncate flex-1">{shareUrl}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-[#fe2c55] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all active:scale-95 flex-shrink-0"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : t('copyLink')}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

interface ShareOptionProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

const ShareOption: React.FC<ShareOptionProps> = ({ icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 transition-transform active:scale-90"
  >
    <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
      {icon}
    </div>
    <span className="text-white/70 text-xs font-medium">{label}</span>
  </button>
);

export default ShareModal;
