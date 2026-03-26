/**
 * SEMPela - Global Video Store
 * Uses Zustand for lightweight, fast state management
 * Author: Josué Sempela
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  likes: number;
  views: number;
  duration?: number;
  tags?: string[];
  username?: string;
  userAvatar?: string;
  createdAt: string;
}

interface VideoStore {
  // Video feed
  videos: Video[];
  currentIndex: number;
  isLoading: boolean;
  hasMore: boolean;
  page: number;

  // Playback
  isMuted: boolean;
  isGlobalPlaying: boolean;

  // Liked videos (local persistence)
  likedVideos: Set<string>;
  viewedVideos: Set<string>;

  // Language
  language: 'en' | 'fr';

  // Upload state
  uploadProgress: number;
  isUploading: boolean;

  // Actions
  setVideos: (videos: Video[]) => void;
  appendVideos: (videos: Video[]) => void;
  setCurrentIndex: (index: number) => void;
  setIsLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setPage: (page: number) => void;
  toggleMute: () => void;
  toggleGlobalPlaying: () => void;
  toggleLike: (videoId: string) => void;
  incrementLikes: (videoId: string) => void;
  decrementLikes: (videoId: string) => void;
  markViewed: (videoId: string) => void;
  hasLiked: (videoId: string) => boolean;
  hasViewed: (videoId: string) => boolean;
  setLanguage: (lang: 'en' | 'fr') => void;
  setUploadProgress: (progress: number) => void;
  setIsUploading: (uploading: boolean) => void;
  addVideo: (video: Video) => void;
  removeVideo: (videoId: string) => void;
  updateVideoStats: (videoId: string, updates: Partial<Pick<Video, 'likes' | 'views'>>) => void;
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      videos: [],
      currentIndex: 0,
      isLoading: false,
      hasMore: true,
      page: 1,

      isMuted: true, // Muted by default for autoplay compliance
      isGlobalPlaying: true,

      likedVideos: new Set(),
      viewedVideos: new Set(),

      language: 'en',

      uploadProgress: 0,
      isUploading: false,

      setVideos: (videos) => set({ videos }),
      appendVideos: (newVideos) =>
        set((state) => ({ videos: [...state.videos, ...newVideos] })),
      setCurrentIndex: (index) => set({ currentIndex: index }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setHasMore: (hasMore) => set({ hasMore }),
      setPage: (page) => set({ page }),

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      toggleGlobalPlaying: () =>
        set((state) => ({ isGlobalPlaying: !state.isGlobalPlaying })),

      toggleLike: (videoId) => {
        const { likedVideos } = get();
        const newLiked = new Set(likedVideos);
        if (newLiked.has(videoId)) {
          newLiked.delete(videoId);
          get().decrementLikes(videoId);
        } else {
          newLiked.add(videoId);
          get().incrementLikes(videoId);
        }
        set({ likedVideos: newLiked });
      },

      incrementLikes: (videoId) =>
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId ? { ...v, likes: v.likes + 1 } : v
          ),
        })),

      decrementLikes: (videoId) =>
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId ? { ...v, likes: Math.max(0, v.likes - 1) } : v
          ),
        })),

      markViewed: (videoId) => {
        const { viewedVideos } = get();
        const newViewed = new Set(viewedVideos);
        newViewed.add(videoId);
        set({ viewedVideos: newViewed });
        // Increment view count in videos array
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId ? { ...v, views: v.views + 1 } : v
          ),
        }));
      },

      hasLiked: (videoId) => get().likedVideos.has(videoId),
      hasViewed: (videoId) => get().viewedVideos.has(videoId),

      setLanguage: (language) => set({ language }),
      setUploadProgress: (uploadProgress) => set({ uploadProgress }),
      setIsUploading: (isUploading) => set({ isUploading }),

      addVideo: (video) =>
        set((state) => ({ videos: [video, ...state.videos] })),

      removeVideo: (videoId) =>
        set((state) => ({
          videos: state.videos.filter((v) => v.id !== videoId),
        })),

      updateVideoStats: (videoId, updates) =>
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId ? { ...v, ...updates } : v
          ),
        })),
    }),
    {
      name: 'sempela-storage',
      // Only persist user preferences and interaction state
      partialize: (state) => ({
        isMuted: state.isMuted,
        language: state.language,
        likedVideos: Array.from(state.likedVideos),
        viewedVideos: Array.from(state.viewedVideos),
      }),
      // Convert arrays back to Sets on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.likedVideos = new Set(state.likedVideos as unknown as string[]);
          state.viewedVideos = new Set(state.viewedVideos as unknown as string[]);
        }
      },
    }
  )
);
