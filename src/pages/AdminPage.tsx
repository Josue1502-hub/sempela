/**
 * SEMPela - Admin Dashboard Page
 * Protected admin area for managing videos, viewing stats.
 * Author: Josué Sempela
 */

import React, { useState, useEffect } from 'react';
import {
  Shield, ArrowLeft, Trash2, Eye, Heart, Film,
  TrendingUp, Clock, AlertTriangle, LogOut, Plus,
  BarChart2, Upload as UploadIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import BottomNav from '../components/BottomNav';
import { useVideoStore } from '../store/useVideoStore';
import { fetchAllVideos, deleteVideo, formatCount, formatRelativeTime } from '../lib/api';
import { useTranslation } from '../lib/i18n';
import { ADMIN_PASSWORD } from '../lib/mockData';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { videos, removeVideo, language } = useVideoStore();
  const { t } = useTranslation(language);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [allVideos, setAllVideos] = useState(videos);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'videos'>('overview');

  // Load all videos when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllVideos();
    }
  }, [isAuthenticated]);

  const loadAllVideos = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllVideos();
      setAllVideos(data);
    } catch {
      toast.error('Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
      toast.success('Welcome, Admin! 👋', {
        style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      });
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const handleDelete = async (videoId: string) => {
    try {
      await deleteVideo(videoId);
      removeVideo(videoId);
      setAllVideos((prev) => prev.filter((v) => v.id !== videoId));
      setDeleteConfirm(null);
      toast.success(t('deleteSuccess'), {
        style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      });
    } catch {
      toast.error('Failed to delete video');
    }
  };

  // Stats
  const totalViews = allVideos.reduce((sum, v) => sum + v.views, 0);
  const totalLikes = allVideos.reduce((sum, v) => sum + v.likes, 0);
  const topVideo = [...allVideos].sort((a, b) => b.views - a.views)[0];

  /* ─── Login Screen ─── */
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center p-6 page-enter">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-14 left-4 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#fe2c55] to-[#ff6b35] flex items-center justify-center mb-4 shadow-2xl shadow-[#fe2c55]/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white font-black text-2xl">Admin Access</h1>
          <p className="text-white/40 text-sm mt-1">SEMPela Dashboard</p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div>
            <label className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 block">
              {t('enterPassword')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className={`w-full bg-zinc-900 text-white placeholder:text-white/20 text-base px-4 py-4 rounded-2xl outline-none border transition-all ${
                passwordError
                  ? 'border-red-500 animate-shake'
                  : 'border-white/5 focus:border-[#fe2c55]/50'
              }`}
              autoComplete="current-password"
            />
            {passwordError && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {t('wrongPassword')}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#fe2c55] text-white font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-[#e0253d]"
          >
            <Shield className="w-5 h-5" />
            {t('login')}
          </button>
        </form>

        <p className="text-white/20 text-xs mt-8 text-center">
          Hint: sempela2024
        </p>
      </div>
    );
  }

  /* ─── Dashboard ─── */
  return (
    <div className="fixed inset-0 bg-zinc-950 overflow-hidden flex flex-col page-enter">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 pt-14 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white font-bold text-lg">{t('adminDashboard')}</h1>
            <p className="text-white/40 text-xs">SEMPela Admin Panel</p>
          </div>
        </div>
        <button
          onClick={() => setIsAuthenticated(false)}
          className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t('logout')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 flex-shrink-0">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart2 },
          { id: 'videos', label: t('videoManager'), icon: Film },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'videos')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#fe2c55] text-white'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto admin-scroll pb-24">
        {activeTab === 'overview' && (
          <div className="p-4 space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<Film className="w-6 h-6" />}
                label={t('totalVideos')}
                value={allVideos.length.toString()}
                color="from-[#fe2c55] to-[#ff6b35]"
              />
              <StatCard
                icon={<Eye className="w-6 h-6" />}
                label={t('totalViews')}
                value={formatCount(totalViews)}
                color="from-blue-500 to-cyan-500"
              />
              <StatCard
                icon={<Heart className="w-6 h-6" />}
                label={t('totalLikes')}
                value={formatCount(totalLikes)}
                color="from-pink-500 to-rose-500"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6" />}
                label="Engagement"
                value={totalViews > 0 ? `${((totalLikes / totalViews) * 100).toFixed(1)}%` : '0%'}
                color="from-violet-500 to-purple-500"
              />
            </div>

            {/* Top Video */}
            {topVideo && (
              <div className="bg-zinc-900 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-[#fe2c55]" />
                  <h3 className="text-white font-semibold text-sm">Top Performing Video</h3>
                </div>
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                    {topVideo.thumbnailUrl ? (
                      <img src={topVideo.thumbnailUrl} alt={topVideo.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{topVideo.title}</p>
                    <p className="text-white/50 text-xs mt-0.5">{topVideo.username}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-white/60 text-xs flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {formatCount(topVideo.views)}
                      </span>
                      <span className="text-white/60 text-xs flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {formatCount(topVideo.likes)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-zinc-900 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-white/40" />
                <h3 className="text-white font-semibold text-sm">Recent Videos</h3>
              </div>
              <div className="space-y-2">
                {allVideos.slice(0, 5).map((video) => (
                  <div key={video.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#fe2c55] rounded-full flex-shrink-0" />
                    <p className="text-white/70 text-xs truncate flex-1">{video.title}</p>
                    <span className="text-white/30 text-xs flex-shrink-0">
                      {formatRelativeTime(video.createdAt, language)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action */}
            <button
              onClick={() => navigate('/upload')}
              className="w-full bg-[#fe2c55] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <UploadIcon className="w-5 h-5" />
              {t('addNewVideo')}
            </button>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="p-4 space-y-3">
            {/* Add button */}
            <button
              onClick={() => navigate('/upload')}
              className="w-full bg-zinc-900 border border-[#fe2c55]/30 text-[#fe2c55] font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-[#fe2c55]/10"
            >
              <Plus className="w-5 h-5" />
              {t('addNewVideo')}
            </button>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-[#fe2c55]/30 border-t-[#fe2c55] rounded-full animate-spin" />
              </div>
            ) : (
              allVideos.map((video) => (
                <div key={video.id} className="bg-zinc-900 rounded-2xl overflow-hidden">
                  <div className="flex gap-3 p-3">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                      {video.thumbnailUrl ? (
                        <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm line-clamp-2 leading-tight">{video.title}</p>
                      {video.description && (
                        <p className="text-white/40 text-xs mt-0.5 line-clamp-1">{video.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-white/50 text-xs flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {formatCount(video.views)}
                        </span>
                        <span className="text-white/50 text-xs flex items-center gap-1">
                          <Heart className="w-3 h-3" /> {formatCount(video.likes)}
                        </span>
                        <span className="text-white/30 text-xs">
                          {formatRelativeTime(video.createdAt, language)}
                        </span>
                      </div>
                      {video.tags && video.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {video.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[#fe2c55] text-xs">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delete action */}
                  {deleteConfirm === video.id ? (
                    <div className="border-t border-white/5 p-3 flex items-center gap-2">
                      <p className="text-white/60 text-xs flex-1">{t('deleteConfirm')}</p>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="text-white/40 text-xs px-3 py-1.5 rounded-lg bg-white/5"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="text-white text-xs px-3 py-1.5 rounded-lg bg-red-500 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div className="border-t border-white/5 px-3 py-2 flex justify-end">
                      <button
                        onClick={() => setDeleteConfirm(video.id)}
                        className="flex items-center gap-1.5 text-red-400/70 hover:text-red-400 text-xs transition-colors py-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {t('deleteVideo')}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="bg-zinc-900 rounded-2xl p-4">
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-3`}>
      {icon}
    </div>
    <p className="text-white font-bold text-xl">{value}</p>
    <p className="text-white/50 text-xs mt-0.5">{label}</p>
  </div>
);

export default AdminPage;
