/**
 * SEMPela - Profile Page
 * User profile with stats and video grid.
 * Author: Josué Sempela
 */

import React from 'react';
import { Settings, Grid3X3, Heart, ArrowLeft, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useVideoStore } from '../store/useVideoStore';
import { formatCount } from '../lib/api';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { videos, likedVideos, language } = useVideoStore();
  const [activeTab, setActiveTab] = React.useState<'videos' | 'liked'>('videos');

  const likedCount = likedVideos instanceof Set ? likedVideos.size : (likedVideos as string[]).length;
  const totalViews = videos.reduce((s, v) => s + v.views, 0);

  return (
    <div className="fixed inset-0 bg-zinc-950 overflow-hidden flex flex-col page-enter">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4 border-b border-white/5 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="text-white/50 hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white font-bold text-lg">Profile</h1>
        <button className="text-white/50 hover:text-white transition-colors">
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto admin-scroll pb-24">
        {/* Profile Header */}
        <div className="flex flex-col items-center py-8 px-4">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#fe2c55] to-[#ff6b35] flex items-center justify-center text-4xl shadow-2xl shadow-[#fe2c55]/30">
              👤
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#fe2c55] rounded-full w-6 h-6 flex items-center justify-center">
              <UserCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <h2 className="text-white font-black text-xl">@sempela_user</h2>
          <p className="text-white/50 text-sm mt-1">SEMPela Creator</p>

          {/* Follow/Edit button */}
          <button className="mt-4 border border-white/20 text-white font-semibold text-sm px-6 py-2 rounded-full hover:bg-white/10 transition-colors">
            {language === 'fr' ? 'Modifier le profil' : 'Edit Profile'}
          </button>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-6">
            <StatItem label={language === 'fr' ? 'Vidéos' : 'Videos'} value={videos.length} />
            <StatItem label={language === 'fr' ? 'Abonnés' : 'Followers'} value={1247} />
            <StatItem label={language === 'fr' ? 'Abonnements' : 'Following'} value={384} />
          </div>

          {/* Extra stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-1.5 text-white/50 text-xs">
              <Heart className="w-3.5 h-3.5 text-[#fe2c55]" />
              {formatCount(totalViews)} {language === 'fr' ? 'vues' : 'views'}
            </div>
            <div className="text-white/20 text-xs">·</div>
            <div className="text-white/50 text-xs">
              {likedCount} {language === 'fr' ? 'aimé(s)' : 'liked'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-1">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'videos'
                ? 'border-white text-white'
                : 'border-transparent text-white/40'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            {language === 'fr' ? 'Vidéos' : 'Videos'}
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'liked'
                ? 'border-white text-white'
                : 'border-transparent text-white/40'
            }`}
          >
            <Heart className="w-4 h-4" />
            {language === 'fr' ? 'Aimés' : 'Liked'}
          </button>
        </div>

        {/* Video Grid */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-3 gap-0.5 px-0.5">
            {videos.map((video) => (
              <div key={video.id} className="relative aspect-[9/16] bg-zinc-900 overflow-hidden">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl bg-zinc-800">🎬</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-1.5">
                  <p className="text-white text-[10px] font-medium line-clamp-1">{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="flex flex-col items-center justify-center py-16 px-8 gap-3">
            <Heart className="w-12 h-12 text-white/20" />
            <p className="text-white/50 text-sm text-center">
              {likedCount > 0
                ? `You've liked ${likedCount} video${likedCount !== 1 ? 's' : ''}`
                : (language === 'fr' ? 'Aucune vidéo aimée' : 'No liked videos yet')}
            </p>
            {likedCount === 0 && (
              <button
                onClick={() => navigate('/')}
                className="text-[#fe2c55] text-sm font-semibold mt-2"
              >
                {language === 'fr' ? 'Découvrir des vidéos' : 'Discover videos'}
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 px-4">
          <p className="text-white/20 text-xs">SEMPela — Developed by Josué Sempela</p>
          <a
            href="https://wa.me/243975111541"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400/40 text-xs hover:text-green-400/70 transition-colors"
          >
            WhatsApp: +243975111541
          </a>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

const StatItem: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-white font-black text-xl">{formatCount(value)}</span>
    <span className="text-white/50 text-xs mt-0.5">{label}</span>
  </div>
);

export default ProfilePage;
