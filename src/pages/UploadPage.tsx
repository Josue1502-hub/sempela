/**
 * SEMPela - Upload Page
 * Allows users to upload videos with title, description, and tags.
 * Integrates with Cloudinary for storage.
 * Author: Josué Sempela
 */

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Film, CheckCircle, ArrowLeft, Hash, Type, AlignLeft, Cloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import BottomNav from '../components/BottomNav';
import { useVideoStore } from '../store/useVideoStore';
import { uploadVideo } from '../lib/api';
import { useTranslation } from '../lib/i18n';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, addVideo, uploadProgress, isUploading, setUploadProgress, setIsUploading } = useVideoStore();
  const { t } = useTranslation(language);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Please select a valid video file (MP4, MOV, AVI)', {
        style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      });
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File too large. Max size is 100MB.`, {
        style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      });
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a video file', {
        style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      });
      return;
    }

    if (!title.trim()) {
      toast.error('Please add a title for your video', {
        style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newVideo = await uploadVideo(
        selectedFile,
        { title: title.trim(), description: description.trim(), tags: tags.trim() },
        (progress) => setUploadProgress(progress)
      );

      addVideo(newVideo);
      setUploadDone(true);

      toast.success(t('uploadSuccess'), {
        style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
        duration: 3000,
      });

      // Reset after 2 seconds
      setTimeout(() => {
        setUploadDone(false);
        setSelectedFile(null);
        setVideoPreview(null);
        setTitle('');
        setDescription('');
        setTags('');
        navigate('/');
      }, 2000);
    } catch {
      toast.error(t('uploadError'), {
        style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Upload success screen
  if (uploadDone) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-6 z-50">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        <div className="text-center">
          <h2 className="text-white font-bold text-2xl mb-2">Video Published!</h2>
          <p className="text-white/60 text-sm">Your video is now live on SEMPela</p>
        </div>
        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full animate-[width_2s_ease]" style={{ width: '100%' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-zinc-950 overflow-y-auto page-enter">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur border-b border-white/5 px-4 py-4 flex items-center gap-3 safe-top">
        <button
          onClick={() => navigate(-1)}
          className="text-white/70 hover:text-white transition-colors p-1"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white font-bold text-lg flex-1">{t('uploadVideo')}</h1>
        <div className="flex items-center gap-1.5 text-white/40">
          <Cloud className="w-4 h-4" />
          <span className="text-xs">Cloudinary</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 pb-32 space-y-5">
        {/* Video Drop Zone */}
        {!selectedFile ? (
          <div
            className={`drop-zone rounded-3xl p-8 flex flex-col items-center gap-4 cursor-pointer transition-all ${
              isDragging ? 'active' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <Upload className="w-9 h-9 text-[#fe2c55]" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg">{t('dragDropVideo')}</p>
              <p className="text-white/40 text-sm mt-1">{t('orBrowse')}</p>
              <p className="text-white/30 text-xs mt-3">{t('maxFileSize')}</p>
              <p className="text-white/30 text-xs">{t('supportedFormats')}</p>
            </div>
            <div className="flex items-center gap-2 bg-[#fe2c55] text-white text-sm font-semibold px-5 py-2.5 rounded-full">
              <Film className="w-4 h-4" />
              {t('selectVideo')}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
              className="hidden"
              onChange={handleInputChange}
            />
          </div>
        ) : (
          /* Video Preview */
          <div className="relative rounded-3xl overflow-hidden bg-zinc-900">
            <video
              src={videoPreview!}
              className="w-full max-h-72 object-cover"
              controls
              playsInline
            />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 p-3">
              <p className="text-white text-xs font-medium truncate">{selectedFile.name}</p>
              <p className="text-white/50 text-xs">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="bg-zinc-900 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm font-medium">{t('uploading')}</span>
              <span className="text-[#fe2c55] text-sm font-bold">{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#fe2c55] to-[#ff6b35] rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-2 h-2 bg-[#fe2c55] rounded-full animate-pulse" />
              <p className="text-white/50 text-xs">
                {language === 'fr' ? 'Téléchargement vers Cloudinary...' : 'Uploading to Cloudinary...'}
              </p>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-white/5" />

        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
            <Type className="w-3.5 h-3.5" />
            {t('videoTitle')} *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={language === 'fr' ? 'Ex: Mon aventure au Congo 🌍' : 'Ex: My Amazing Adventure 🌍'}
            maxLength={100}
            className="w-full bg-zinc-900 text-white placeholder:text-white/30 text-sm px-4 py-3.5 rounded-2xl outline-none border border-white/5 focus:border-[#fe2c55]/50 transition-colors"
            required
          />
          <p className="text-white/30 text-xs mt-1 text-right">{title.length}/100</p>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
            <AlignLeft className="w-3.5 h-3.5" />
            {t('videoDescription')}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={language === 'fr' ? 'Décrivez votre vidéo...' : 'Describe your video...'}
            maxLength={500}
            rows={3}
            className="w-full bg-zinc-900 text-white placeholder:text-white/30 text-sm px-4 py-3.5 rounded-2xl outline-none border border-white/5 focus:border-[#fe2c55]/50 transition-colors resize-none"
          />
          <p className="text-white/30 text-xs mt-1 text-right">{description.length}/500</p>
        </div>

        {/* Tags */}
        <div>
          <label className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
            <Hash className="w-3.5 h-3.5" />
            {t('videoTags')}
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="dance, travel, food, funny"
            className="w-full bg-zinc-900 text-white placeholder:text-white/30 text-sm px-4 py-3.5 rounded-2xl outline-none border border-white/5 focus:border-[#fe2c55]/50 transition-colors"
          />
          {tags && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                <span key={tag} className="text-[#fe2c55] bg-[#fe2c55]/10 text-xs font-medium px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cloudinary info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Cloud className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-400 font-semibold text-sm">Cloudinary Storage</p>
              <p className="text-white/50 text-xs mt-0.5 leading-relaxed">
                {language === 'fr'
                  ? 'Votre vidéo sera optimisée et hébergée sur Cloudinary pour un streaming ultra-rapide.'
                  : 'Your video will be optimized and hosted on Cloudinary for ultra-fast streaming worldwide.'}
              </p>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isUploading || !selectedFile}
          className="w-full bg-[#fe2c55] disabled:bg-white/10 disabled:text-white/30 text-white font-bold text-base py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 hover:bg-[#e0253d]"
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t('uploading')} {uploadProgress}%
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              {t('uploadVideo')}
            </>
          )}
        </button>
      </form>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default UploadPage;
