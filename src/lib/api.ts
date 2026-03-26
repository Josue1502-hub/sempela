/**
 * SEMPela - API Service Layer
 * Handles all data operations. In production, these would call
 * real Next.js API routes connected to PostgreSQL via Prisma.
 * Author: Josué Sempela
 */

import { Video } from '../store/useVideoStore';
import { MOCK_VIDEOS } from './mockData';

// Simulate network delay for realistic UX
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage (simulates DB)
let videoDatabase: Video[] = [...MOCK_VIDEOS];

// Pagination settings
const PAGE_SIZE = 5;

/**
 * GET /api/videos — Fetch paginated videos
 */
export async function fetchVideos(page = 1): Promise<{ videos: Video[]; hasMore: boolean }> {
  await delay(600); // Simulate network latency

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const videos = videoDatabase.slice(start, end);
  const hasMore = end < videoDatabase.length;

  return { videos, hasMore };
}

/**
 * GET /api/videos/all — Fetch all videos (admin)
 */
export async function fetchAllVideos(): Promise<Video[]> {
  await delay(400);
  return [...videoDatabase].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * POST /api/like — Toggle like on a video
 */
export async function likeVideo(
  videoId: string,
  action: 'like' | 'unlike'
): Promise<{ success: boolean; likes: number }> {
  await delay(200);

  const video = videoDatabase.find((v) => v.id === videoId);
  if (!video) throw new Error('Video not found');

  if (action === 'like') {
    video.likes += 1;
  } else {
    video.likes = Math.max(0, video.likes - 1);
  }

  return { success: true, likes: video.likes };
}

/**
 * POST /api/view — Increment view count
 */
export async function viewVideo(videoId: string): Promise<{ success: boolean; views: number }> {
  await delay(100);

  const video = videoDatabase.find((v) => v.id === videoId);
  if (!video) throw new Error('Video not found');

  video.views += 1;
  return { success: true, views: video.views };
}

/**
 * POST /api/upload — Upload video via Cloudinary
 * This simulates Cloudinary upload. In production:
 * 1. Client sends file to /api/upload
 * 2. Server uploads to Cloudinary
 * 3. Server saves URL to PostgreSQL via Prisma
 * 4. Server returns the new video record
 */
export async function uploadVideo(
  file: File,
  metadata: { title: string; description: string; tags: string },
  onProgress?: (progress: number) => void
): Promise<Video> {
  // Simulate upload progress
  const progressSteps = [10, 25, 40, 60, 75, 90, 100];
  for (const step of progressSteps) {
    await delay(300);
    onProgress?.(step);
  }

  // In production: upload to Cloudinary and get back the URL
  // const formData = new FormData();
  // formData.append('file', file);
  // formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  // const response = await axios.post(
  //   `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
  //   formData,
  //   { onUploadProgress: (e) => onProgress(e.loaded / e.total * 100) }
  // );

  // Create object URL for local preview (production would use Cloudinary URL)
  const localUrl = URL.createObjectURL(file);

  const newVideo: Video = {
    id: `video_${Date.now()}`,
    title: metadata.title,
    description: metadata.description,
    url: localUrl,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
    likes: 0,
    views: 0,
    duration: 30,
    tags: metadata.tags.split(',').map((t) => t.trim()).filter(Boolean),
    username: '@admin',
    userAvatar: 'https://i.pravatar.cc/150?img=50',
    createdAt: new Date().toISOString(),
  };

  // Add to beginning of database
  videoDatabase = [newVideo, ...videoDatabase];

  return newVideo;
}

/**
 * DELETE /api/videos/:id — Delete a video
 */
export async function deleteVideo(videoId: string): Promise<{ success: boolean }> {
  await delay(300);

  const index = videoDatabase.findIndex((v) => v.id === videoId);
  if (index === -1) throw new Error('Video not found');

  videoDatabase.splice(index, 1);
  return { success: true };
}

/**
 * Format number for display (e.g., 1234567 → 1.2M)
 */
export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

/**
 * Format duration in seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string, lang: 'en' | 'fr' = 'en'): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (lang === 'fr') {
    if (minutes < 1) return "à l'instant";
    if (minutes < 60) return `il y a ${minutes}min`;
    if (hours < 24) return `il y a ${hours}h`;
    if (days < 7) return `il y a ${days}j`;
    return `il y a ${Math.floor(days / 7)}sem`;
  }

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}
