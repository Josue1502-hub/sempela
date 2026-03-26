/**
 * SEMPela - Bottom Navigation Bar
 * Mobile-first bottom navigation (TikTok-style).
 * Author: Josué Sempela
 */

import React from 'react';
import { Home, Search, PlusSquare, User, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useVideoStore } from '../store/useVideoStore';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useVideoStore();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: language === 'fr' ? 'Accueil' : 'Home',
    },
    {
      path: '/explore',
      icon: Search,
      label: language === 'fr' ? 'Explorer' : 'Explore',
    },
    {
      path: '/upload',
      icon: PlusSquare,
      label: language === 'fr' ? 'Publier' : 'Upload',
      isUpload: true,
    },
    {
      path: '/profile',
      icon: User,
      label: language === 'fr' ? 'Profil' : 'Profile',
    },
    {
      path: '/admin',
      icon: Shield,
      label: 'Admin',
    },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 safe-bottom">
      {/* Gradient fade */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative flex items-center justify-around px-2 py-2 pb-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          if (item.isUpload) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 transition-transform active:scale-90"
                aria-label={item.label}
              >
                <div className="relative flex items-center">
                  {/* TikTok-style upload button */}
                  <div className="absolute -left-2 w-10 h-7 bg-[#69c9d0] rounded-lg" />
                  <div className="absolute -right-2 w-10 h-7 bg-[#ee1d52] rounded-lg" />
                  <div className="relative bg-white rounded-lg px-3 py-1.5 z-10">
                    <Icon className="w-5 h-5 text-black" />
                  </div>
                </div>
                <span className="text-[10px] text-white/70 mt-1">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 transition-transform active:scale-90 min-w-[44px]"
              aria-label={item.label}
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  active ? 'text-white' : 'text-white/50'
                }`}
                strokeWidth={active ? 2.5 : 1.5}
              />
              <span
                className={`text-[10px] transition-colors ${
                  active ? 'text-white font-semibold' : 'text-white/50'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
