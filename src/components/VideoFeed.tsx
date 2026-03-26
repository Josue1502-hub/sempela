/**
 * SEMPela - VideoFeed Component
 * TikTok-style vertical scrolling feed with infinite scroll.
 * Author: Josué Sempela
 */

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Loader2, RefreshCw, AlertCircle, Film } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import VideoCard from './VideoCard';
import { useVideoStore } from '../store/useVideoStore';
import { fetchVideos } from '../lib/api';
import { useTranslation } from '../lib/i18n';

const VideoFeed: React.FC = () => {
  const {
    videos,
    isLoading,
    hasMore,
    page,
    language,
    setVideos,
    appendVideos,
    setIsLoading,
    setHasMore,
    setPage,
  } = useVideoStore();

  const { t } = useTranslation(language);
  const [error, setError] = useState<string | null>(null);
  const initialLoadDone = useRef(false);

  // Infinite scroll sentinel
  const { ref: sentinelRef, inView: sentinelInView } = useInView({
    threshold: 0.1,
    rootMargin: '200px',
  });

  // Load videos
  const loadVideos = useCallback(
    async (pageNum: number, reset = false) => {
      if (isLoading) return;
      setIsLoading(true);
      setError(null);

      try {
        const { videos: newVideos, hasMore: more } = await fetchVideos(pageNum);

        if (reset) {
          setVideos(newVideos);
        } else {
          appendVideos(newVideos);
        }

        setHasMore(more);
        setPage(pageNum);
      } catch (err) {
        setError(t('errorLoading'));
        console.error('Failed to load videos:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, setIsLoading, setVideos, appendVideos, setHasMore, setPage, t]
  );

  // Initial load
  useEffect(() => {
    if (!initialLoadDone.current && videos.length === 0) {
      initialLoadDone.current = true;
      loadVideos(1, true);
    }
  }, [loadVideos, videos.length]);

  // Load more when sentinel is visible
  useEffect(() => {
    if (sentinelInView && hasMore && !isLoading && videos.length > 0) {
      loadVideos(page + 1);
    }
  }, [sentinelInView, hasMore, isLoading, page, videos.length, loadVideos]);

  const handleRefresh = () => {
    initialLoadDone.current = false;
    loadVideos(1, true);
  };

  // Initial loading state
  if (videos.length === 0 && isLoading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[#fe2c55]/30 border-t-[#fe2c55] animate-spin" />
          <Film className="absolute inset-0 m-auto w-7 h-7 text-[#fe2c55]" />
        </div>
        <p className="text-white/60 text-sm">{t('loading')}</p>
      </div>
    );
  }

  // Error state
  if (error && videos.length === 0) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-4 p-6">
        <AlertCircle className="w-12 h-12 text-[#fe2c55]" />
        <p className="text-white font-semibold text-lg text-center">{error}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-[#fe2c55] text-white font-semibold px-6 py-3 rounded-full transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          {t('tryAgain')}
        </button>
      </div>
    );
  }

  // Empty state
  if (videos.length === 0 && !isLoading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-4 p-6">
        <div className="text-6xl mb-2">🎬</div>
        <h3 className="text-white font-bold text-xl">{t('noVideos')}</h3>
        <p className="text-white/50 text-sm text-center">{t('noVideosDesc')}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-[#fe2c55] text-white font-semibold px-6 py-3 rounded-full mt-2 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="video-feed">
      {videos.map((video, index) => (
        <VideoCard key={video.id} video={video} index={index} />
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {/* Loading more indicator */}
      {isLoading && videos.length > 0 && (
        <div className="video-card bg-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#fe2c55] animate-spin" />
            <p className="text-white/60 text-sm">{t('loading')}</p>
          </div>
        </div>
      )}

      {/* End of feed */}
      {!hasMore && !isLoading && videos.length > 0 && (
        <div className="video-card bg-black flex flex-col items-center justify-center gap-6">
          <div className="text-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-white font-bold text-xl mb-2">You're all caught up!</h3>
            <p className="text-white/50 text-sm">You've seen all available videos</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-[#fe2c55] text-white font-semibold px-6 py-3 rounded-full transition-all active:scale-95 hover:bg-[#e0253d]"
          >
            <RefreshCw className="w-4 h-4" />
            Watch again from start
          </button>

          {/* Footer */}
          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-white/30 text-xs">SEMPela — Developed by Josué Sempela</p>
            <p className="text-white/20 text-xs">WhatsApp: +243975111541</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
