/**
 * SEMPela - VideoCard Component
 * Full-screen video card with TikTok-style overlay UI.
 * Author: Josué Sempela
 */

import React, { useState, useCallback, useRef } from 'react';
import { Heart, Eye, Share2, MessageCircle, Bookmark, Music2, ChevronUp } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import toast from 'react-hot-toast';
import VideoPlayer from './VideoPlayer';
import ShareModal from './ShareModal';
import { Video } from '../store/useVideoStore';
import { useVideoStore } from '../store/useVideoStore';
import { formatCount, formatRelativeTime } from '../lib/api';
import { useTranslation } from '../lib/i18n';

interface VideoCardProps {
  video: Video;
  index: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, index }) => {
  const { toggleLike, hasLiked, language } = useVideoStore();
  const { t } = useTranslation(language);

  const [showShare, setShowShare] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const liked = hasLiked(video.id);

  // Track if card is visible in viewport
  const { ref, inView } = useInView({
    threshold: 0.7,
    triggerOnce: false,
  });

  const likeAnimRef = useRef<HTMLSpanElement>(null);

  const handleLike = useCallback(() => {
    // Trigger animation
    if (likeAnimRef.current) {
      likeAnimRef.current.classList.remove('like-animate');
      void likeAnimRef.current.offsetWidth; // reflow
      likeAnimRef.current.classList.add('like-animate');
    }
    toggleLike(video.id);
    if (!liked) {
      toast(`❤️ Liked!`, {
        style: {
          background: 'rgba(30,30,30,0.95)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '14px',
        },
        duration: 1000,
        position: 'top-center',
      });
    }
  }, [liked, toggleLike, video.id]);

  const handleDoubleTap = useCallback(() => {
    if (!liked) {
      toggleLike(video.id);
      if (likeAnimRef.current) {
        likeAnimRef.current.classList.remove('like-animate');
        void likeAnimRef.current.offsetWidth;
        likeAnimRef.current.classList.add('like-animate');
      }
    }
  }, [liked, toggleLike, video.id]);

  const tags = video.tags || [];
  const description = video.description || '';
  const isLongDesc = description.length > 80;
  const displayDesc = isDescExpanded || !isLongDesc ? description : description.slice(0, 80) + '...';

  return (
    <>
      <div ref={ref} className="video-card relative">
        {/* Video Player */}
        <VideoPlayer
          url={video.url}
          videoId={video.id}
          isActive={inView}
          onDoubleTap={handleDoubleTap}
        />

        {/* Full gradient overlay */}
        <div className="absolute inset-0 video-overlay pointer-events-none z-10" />

        {/* Left side - Video Info */}
        <div className="absolute bottom-16 left-4 right-20 z-20 pointer-events-none">
          {/* Username */}
          <div className="flex items-center gap-2 mb-2 pointer-events-auto">
            <img
              src={video.userAvatar || `https://i.pravatar.cc/150?u=${video.id}`}
              alt={video.username || 'User'}
              className="w-9 h-9 rounded-full border-2 border-white object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(video.username || 'U')}&background=fe2c55&color=fff`;
              }}
            />
            <span className="text-white font-semibold text-sm drop-shadow">
              {video.username || '@user'}
            </span>
            <span className="text-xs text-white/60">
              · {formatRelativeTime(video.createdAt, language)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-white font-bold text-base leading-tight drop-shadow mb-1">
            {video.title}
          </h3>

          {/* Description with expand */}
          {description && (
            <div className="pointer-events-auto">
              <p className="text-white/80 text-sm leading-relaxed drop-shadow">
                {displayDesc}
                {isLongDesc && (
                  <button
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="text-white/60 ml-1 font-medium"
                  >
                    {isDescExpanded ? ' less' : ' more'}
                  </button>
                )}
              </p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 pointer-events-auto">
              {tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-white font-semibold text-xs drop-shadow">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Music row */}
          <div className="flex items-center gap-2 mt-2 pointer-events-auto">
            <Music2 className="w-3.5 h-3.5 text-white/70 animate-spin-slow" />
            <span className="text-white/70 text-xs truncate max-w-[200px]">
              Original Audio · {video.username || 'SEMPela'}
            </span>
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-5">
          {/* User Avatar with follow */}
          <div className="relative mb-1">
            <img
              src={video.userAvatar || `https://i.pravatar.cc/150?u=${video.id}`}
              alt="avatar"
              className="w-11 h-11 rounded-full border-2 border-white object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(video.username || 'U')}&background=fe2c55&color=fff`;
              }}
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#fe2c55] rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              +
            </div>
          </div>

          {/* Like */}
          <button className="fab-btn" onClick={handleLike} aria-label="Like video">
            <span ref={likeAnimRef} className="inline-block">
              <Heart
                className={`w-8 h-8 drop-shadow-lg transition-colors duration-200 ${
                  liked ? 'fill-[#fe2c55] text-[#fe2c55]' : 'fill-white text-white'
                }`}
              />
            </span>
            <span className="text-white text-xs font-semibold drop-shadow">
              {formatCount(video.likes)}
            </span>
          </button>

          {/* Comments */}
          <button
            className="fab-btn"
            aria-label="Comments"
            onClick={() => toast('💬 Comments coming in V2!', {
              style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
              duration: 2000,
            })}
          >
            <MessageCircle className="w-8 h-8 text-white fill-white drop-shadow-lg" />
            <span className="text-white text-xs font-semibold drop-shadow">
              {formatCount(Math.floor(video.views * 0.03))}
            </span>
          </button>

          {/* Bookmark */}
          <button
            className="fab-btn"
            aria-label="Save"
            onClick={() => toast('🔖 Saved to favorites!', {
              style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
              duration: 1500,
            })}
          >
            <Bookmark className="w-7 h-7 text-white fill-white drop-shadow-lg" />
            <span className="text-white text-xs font-semibold drop-shadow">Save</span>
          </button>

          {/* Views */}
          <div className="fab-btn cursor-default" aria-label="Views">
            <Eye className="w-7 h-7 text-white drop-shadow-lg" />
            <span className="text-white text-xs font-semibold drop-shadow">
              {formatCount(video.views)}
            </span>
          </div>

          {/* Share */}
          <button
            className="fab-btn"
            onClick={() => setShowShare(true)}
            aria-label="Share video"
          >
            <Share2 className="w-7 h-7 text-white drop-shadow-lg" />
            <span className="text-white text-xs font-semibold drop-shadow">{t('share')}</span>
          </button>
        </div>

        {/* Scroll hint (only first card) */}
        {index === 0 && (
          <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-1 opacity-60 pointer-events-none animate-bounce-hint">
            <ChevronUp className="w-5 h-5 text-white" />
            <span className="text-white text-xs">Swipe up</span>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShare && (
        <ShareModal video={video} onClose={() => setShowShare(false)} />
      )}
    </>
  );
};

export default VideoCard;
