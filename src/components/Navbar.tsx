/**
 * SEMPela - Navbar Component
 * Top navigation bar with brand, tabs, and language toggle.
 * Author: Josué Sempela
 */

import React, { useState } from 'react';
import { Globe, Search } from 'lucide-react';
import { useVideoStore } from '../store/useVideoStore';

interface NavbarProps {
  onSearchClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  const { language, setLanguage } = useVideoStore();
  const [activeTab, setActiveTab] = useState<'forYou' | 'following' | 'trending'>('forYou');

  const tabs = [
    { id: 'following' as const, label: language === 'fr' ? 'Abonnements' : 'Following' },
    { id: 'forYou' as const, label: language === 'fr' ? 'Pour toi' : 'For You' },
    { id: 'trending' as const, label: language === 'fr' ? 'Tendances' : 'Trending' },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 z-40 safe-top">
      {/* Gradient fade */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative flex items-center justify-between px-4 py-3">
        {/* Search button */}
        <button
          onClick={onSearchClick}
          className="text-white/80 hover:text-white transition-colors p-1"
          aria-label="Search"
        >
          <Search className="w-6 h-6" />
        </button>

        {/* Center Tabs */}
        <div className="flex items-center gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm font-semibold transition-all pb-1 ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
          className="flex items-center gap-1 text-white/80 hover:text-white transition-colors p-1"
          aria-label="Toggle language"
        >
          <Globe className="w-5 h-5" />
          <span className="text-xs font-bold uppercase">{language}</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
