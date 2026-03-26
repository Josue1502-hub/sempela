/**
 * SEMPela - Main Feed Page
 * The primary video feed page (similar to TikTok's home screen).
 * Author: Josué Sempela
 */

import React, { useState } from 'react';
import VideoFeed from '../components/VideoFeed';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import SearchModal from '../components/SearchModal';

const FeedPage: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Main video feed */}
      <VideoFeed />

      {/* Top navigation bar */}
      <Navbar onSearchClick={() => setShowSearch(true)} />

      {/* Bottom navigation */}
      <BottomNav />

      {/* Search modal */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </div>
  );
};

export default FeedPage;
