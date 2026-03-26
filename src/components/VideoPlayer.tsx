/**
 * SEMPela - VideoPlayer Component
 * Core video player with autoplay, loop, mute controls, and progress tracking.
 * Author: Josué Sempela
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useVideoStore } from '../store/useVideoStore';

interface VideoPlayerProps {
  url: string;
  videoId: string;
  isActive: boolean;
  onDoubleTap?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, videoId, isActive, onDoubleTap }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isMuted, toggleMute, hasViewed, markViewed } = useVideoStore();

  const [_isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [_duration, setDuration] = useState(0);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [doubleTapPos, setDoubleTapPos] = useState<{ x: number; y: number } | null>(null);

  const viewedRef = useRef(false);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tapCountRef = useRef(0);
  const pauseIconTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle active state changes (scroll-based autoplay)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // Reset and play when card becomes active
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked - need user interaction
            setIsPlaying(false);
          });
      }
    } else {
      // Pause and reset when not visible
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
      viewedRef.current = false;
    }
  }, [isActive]);

  // Sync mute state
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = isMuted;
  }, [isMuted]);

  // Track progress and handle view count
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const pct = (video.currentTime / video.duration) * 100;
    setProgress(pct);

    // Count a view after 3 seconds of watching (or 10% of video)
    if (!viewedRef.current && (video.currentTime >= 3 || pct >= 10)) {
      viewedRef.current = true;
      if (!hasViewed(videoId)) {
        markViewed(videoId);
      }
    }
  }, [videoId, hasViewed, markViewed]);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) setDuration(video.duration);
  };

  const handleWaiting = () => setIsBuffering(true);
  const handleCanPlay = () => setIsBuffering(false);

  // Tap to play/pause — double tap to like
  const handleTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      tapCountRef.current += 1;

      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);

      tapTimerRef.current = setTimeout(() => {
        if (tapCountRef.current === 1) {
          // Single tap: toggle play/pause
          const video = videoRef.current;
          if (!video) return;

          if (video.paused) {
            video.play();
            setIsPlaying(true);
            setIsPaused(false);
          } else {
            video.pause();
            setIsPlaying(false);
            setIsPaused(true);
            // Show pause icon briefly
            setShowPlayIcon(true);
            if (pauseIconTimerRef.current) clearTimeout(pauseIconTimerRef.current);
            pauseIconTimerRef.current = setTimeout(() => setShowPlayIcon(false), 1200);
          }
        } else if (tapCountRef.current >= 2) {
          // Double tap: like
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          setDoubleTapPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          onDoubleTap?.();
          setTimeout(() => setDoubleTapPos(null), 900);
        }
        tapCountRef.current = 0;
      }, 250);
    },
    [onDoubleTap]
  );

  // Progress bar seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const seekTime = (parseFloat(e.target.value) / 100) * video.duration;
    video.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* The Video Element */}
      <video
        ref={videoRef}
        src={url}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        playsInline
        muted={isMuted}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onEnded={() => setProgress(0)}
      />

      {/* Tap area (covers whole video) */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={handleTap}
        role="button"
        aria-label="Tap to play/pause, double tap to like"
      />

      {/* Buffering indicator */}
      {isBuffering && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
        </div>
      )}

      {/* Play/Pause overlay icon */}
      {showPlayIcon && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-full p-5 animate-ping-once">
            {isPaused ? (
              <Pause className="w-10 h-10 text-white fill-white" />
            ) : (
              <Play className="w-10 h-10 text-white fill-white" />
            )}
          </div>
        </div>
      )}

      {/* Double tap heart effect */}
      {doubleTapPos && (
        <div
          className="absolute z-30 pointer-events-none"
          style={{ left: doubleTapPos.x - 30, top: doubleTapPos.y - 30 }}
        >
          <div className="float-heart text-5xl">❤️</div>
        </div>
      )}

      {/* Mute button - top right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        className="absolute top-4 right-4 z-30 glass-btn rounded-full p-2.5 transition-all hover:scale-110 active:scale-90"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Progress bar - bottom */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 z-30 px-0">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="video-progress w-full"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
