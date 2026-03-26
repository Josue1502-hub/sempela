/**
 * SEMPela - Search Modal Component
 * Full-screen search with video results.
 * Author: Josué Sempela
 */

import React, { useState, useMemo } from 'react';
import { X, Search, TrendingUp, Hash, Film } from 'lucide-react';
import { useVideoStore } from '../store/useVideoStore';
import { type Video } from '../store/useVideoStore';
import { formatCount } from '../lib/api';
import { useTranslation } from '../lib/i18n';

interface SearchModalProps {
  onClose: () => void;
}

const TRENDING_TAGS = ['dance', 'food', 'travel', 'nature', 'funny', 'music', 'fashion', 'sports', 'art', 'pets'];

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const { videos, language } = useVideoStore();
  const { t } = useTranslation(language);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.description?.toLowerCase().includes(q) ||
        v.username?.toLowerCase().includes(q) ||
        v.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [query, videos]);

  return (
    <div className="fixed inset-0 z-50 bg-black page-enter">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-4 border-b border-white/10">
        <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-full px-4 py-2.5">
          <Search className="w-4 h-4 text-white/50 flex-shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white/50">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button onClick={onClose} className="text-white font-semibold text-sm px-1">
          {t('cancel')}
        </button>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-80px)]">
        {/* No query - show trending */}
        {!query && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#fe2c55]" />
              <h3 className="text-white font-bold text-base">
                {language === 'fr' ? 'Tendances' : 'Trending'}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-full transition-colors"
                >
                  <Hash className="w-3.5 h-3.5 text-[#fe2c55]" />
                  {tag}
                </button>
              ))}
            </div>

            {/* All videos */}
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-5 h-5 text-white/60" />
              <h3 className="text-white font-bold text-base">
                {language === 'fr' ? 'Toutes les vidéos' : 'All Videos'}
              </h3>
            </div>
            <VideoGrid videos={videos} />
          </div>
        )}

        {/* Search results */}
        {query && (
          <div className="p-4">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Search className="w-12 h-12 text-white/20" />
                <p className="text-white/50 text-sm">{t('noResults')}</p>
              </div>
            ) : (
              <>
                <p className="text-white/50 text-xs mb-4">
                  {results.length} {language === 'fr' ? 'résultat(s) pour' : 'result(s) for'} "{query}"
                </p>
                <VideoGrid videos={results} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const VideoGrid: React.FC<{ videos: Video[] }> = ({ videos }) => (
  <div className="grid grid-cols-2 gap-2">
    {videos.map((video) => (
      <div key={video.id} className="relative aspect-[9/16] bg-zinc-900 rounded-xl overflow-hidden group">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-zinc-800">🎬</div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">{video.title}</p>
          <p className="text-white/60 text-xs mt-0.5">{formatCount(video.views)} views</p>
        </div>
      </div>
    ))}
  </div>
);

export default SearchModal;
