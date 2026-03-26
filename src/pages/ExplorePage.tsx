/**
 * SEMPela - Explore Page
 * Trending videos, categories, and discovery.
 * Author: Josué Sempela
 */

import React, { useState } from 'react';
import { Search, TrendingUp, Hash, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useVideoStore } from '../store/useVideoStore';
import { formatCount } from '../lib/api';

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🔥', color: 'from-[#fe2c55] to-[#ff6b35]' },
  { id: 'dance', label: 'Dance', emoji: '💃', color: 'from-pink-500 to-rose-600' },
  { id: 'food', label: 'Food', emoji: '🍜', color: 'from-orange-500 to-amber-500' },
  { id: 'travel', label: 'Travel', emoji: '✈️', color: 'from-blue-500 to-cyan-500' },
  { id: 'nature', label: 'Nature', emoji: '🌿', color: 'from-green-500 to-emerald-600' },
  { id: 'funny', label: 'Funny', emoji: '😂', color: 'from-yellow-400 to-orange-400' },
  { id: 'music', label: 'Music', emoji: '🎵', color: 'from-purple-500 to-violet-600' },
  { id: 'art', label: 'Art', emoji: '🎨', color: 'from-red-400 to-pink-500' },
  { id: 'sports', label: 'Sports', emoji: '⚽', color: 'from-sky-500 to-blue-600' },
  { id: 'pets', label: 'Pets', emoji: '🐾', color: 'from-teal-500 to-green-500' },
];

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { videos, language } = useVideoStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = videos.filter((v) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      v.tags?.includes(selectedCategory) ||
      v.title.toLowerCase().includes(selectedCategory);
    const matchesSearch =
      !searchQuery ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const trending = [...videos].sort((a, b) => b.views - a.views).slice(0, 3);

  return (
    <div className="fixed inset-0 bg-zinc-950 overflow-hidden flex flex-col page-enter">
      {/* Header */}
      <div className="px-4 pt-14 pb-4 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="text-white/50">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-white font-bold text-lg">
            {language === 'fr' ? 'Explorer' : 'Explore'}
          </h1>
        </div>
        {/* Search */}
        <div className="flex items-center gap-2 bg-zinc-900 rounded-2xl px-4 py-3">
          <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'fr' ? 'Rechercher...' : 'Search...'}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto admin-scroll pb-24">
        {/* Trending Section */}
        {!searchQuery && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#fe2c55]" />
              <h2 className="text-white font-bold text-base">
                {language === 'fr' ? 'Tendances' : 'Trending Now'}
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-3 mb-6">
              {trending.map((video, i) => (
                <div key={video.id} className="flex gap-3 bg-zinc-900 rounded-2xl p-3">
                  <div className="w-6 text-center">
                    <span className={`font-black text-lg ${
                      i === 0 ? 'text-yellow-400' : i === 1 ? 'text-zinc-400' : 'text-amber-600'
                    }`}>
                      #{i + 1}
                    </span>
                  </div>
                  <div className="w-16 h-16 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                    {video.thumbnailUrl ? (
                      <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm line-clamp-2">{video.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{video.username}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Zap className="w-3 h-3 text-[#fe2c55]" />
                      <span className="text-white/50 text-xs">{formatCount(video.views)} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-white/60" />
              <h2 className="text-white font-bold text-base">
                {language === 'fr' ? 'Catégories' : 'Categories'}
              </h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? `bg-gradient-to-r ${cat.color} text-white`
                      : 'bg-zinc-900 text-white/60 hover:text-white'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Video Grid */}
        <div className="px-4">
          {searchQuery && (
            <p className="text-white/40 text-xs mb-3">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          )}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-3">
              <Search className="w-10 h-10 text-white/20" />
              <p className="text-white/50 text-sm">No videos found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {filtered.map((video) => (
                <div key={video.id} className="relative aspect-[9/16] bg-zinc-900 rounded-2xl overflow-hidden">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-semibold line-clamp-2">{video.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Fire className="w-3 h-3 text-[#fe2c55]" />
                      <span className="text-white/60 text-xs">{formatCount(video.views)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

// Small inline icon for Fire (not in lucide-react older versions)
const Fire: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 23a9.63 9.63 0 01-3.68-1.88c-1.55-1.26-2.32-3.2-2.32-4.95 0-2.5 1.33-4.42 3.37-5.71.5-.31 1.18.1 1.03.7l-.37 1.54c-.13.52.42.96.88.67 1.13-.72 1.75-1.74 1.98-3.03.07-.39.46-.63.82-.48 1.96.84 3.46 3.02 3.46 5.26 0 1.96-.85 3.74-2.32 4.95A9.63 9.63 0 0112 23z"/>
  </svg>
);

export default ExplorePage;
