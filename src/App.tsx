/**
 * SEMPela - Root Application Component
 * Sets up routing, global providers, splash screen, and toast notifications.
 * Author: Josué Sempela
 */

import React, { Suspense, lazy, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Film } from 'lucide-react';
import SplashScreen from './components/SplashScreen';

// Lazy-load pages for code splitting & performance
const FeedPage    = lazy(() => import('./pages/FeedPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const UploadPage  = lazy(() => import('./pages/UploadPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage   = lazy(() => import('./pages/AdminPage'));

/* ────────────────────────────────────────────────────────────
   Full-screen loading fallback shown while lazy chunks load
──────────────────────────────────────────────────────────── */
const PageLoader: React.FC = () => (
  <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-4">
    <div className="relative">
      <div className="w-16 h-16 rounded-full border-4 border-[#fe2c55]/30 border-t-[#fe2c55] animate-spin" />
      <Film className="absolute inset-0 m-auto w-7 h-7 text-[#fe2c55]" />
    </div>
    <p className="text-white/40 text-sm font-medium tracking-wide">SEMPela</p>
  </div>
);

/* ────────────────────────────────────────────────────────────
   App
──────────────────────────────────────────────────────────── */
export default function App() {
  // Show splash only once per session
  const [splashDone, setSplashDone] = useState<boolean>(
    () => sessionStorage.getItem('sempela_splash') === 'done'
  );

  const handleSplashDone = useCallback(() => {
    sessionStorage.setItem('sempela_splash', 'done');
    setSplashDone(true);
  }, []);

  return (
    <>
      {/* Splash screen — shown only on first visit per session */}
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}

      <BrowserRouter>
        {/* Global toast notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2000,
            style: {
              background: 'rgba(20,20,20,0.97)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              backdropFilter: 'blur(12px)',
              fontSize: '14px',
              fontWeight: '500',
              padding: '10px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
          }}
        />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main video feed — default route */}
            <Route path="/"        element={<FeedPage />} />

            {/* Explore / discover */}
            <Route path="/explore" element={<ExplorePage />} />

            {/* Upload a video */}
            <Route path="/upload"  element={<UploadPage />} />

            {/* User profile */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin dashboard (password-protected) */}
            <Route path="/admin"   element={<AdminPage />} />

            {/* Catch-all → home */}
            <Route path="*"        element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}
