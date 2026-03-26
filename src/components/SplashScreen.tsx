/**
 * SEMPela - Splash Screen
 * Animated intro shown on first load. Auto-dismisses after 2.5s.
 * Author: Josué Sempela
 */

import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDone: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    // Phase timings tuned for faster first-paint:
    // in (0-150ms) → hold (150-1400ms) → out (1400-1900ms) → done
    const t1 = setTimeout(() => setPhase('hold'), 150);
    const t2 = setTimeout(() => setPhase('out'), 1400);
    const t3 = setTimeout(() => onDone(), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black transition-opacity duration-500"
      style={{ opacity: phase === 'out' ? 0 : 1, pointerEvents: phase === 'out' ? 'none' : 'all' }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(254,44,85,0.12) 0%, transparent 70%)',
        }}
      />

      {/* Logo container */}
      <div
        className="flex flex-col items-center gap-6 transition-all duration-700"
        style={{
          opacity: phase === 'in' ? 0 : 1,
          transform: phase === 'in' ? 'scale(0.8) translateY(20px)' : 'scale(1) translateY(0)',
          willChange: 'opacity, transform',
        }}
      >
        {/* Animated logo */}
        <div className="relative">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-3xl border-2 border-[#fe2c55]/30"
            style={{ animation: 'splashPulse 1.5s ease-in-out infinite' }}
          />
          {/* Logo box */}
          <div className="w-28 h-28 rounded-3xl bg-linear-to-br from-[#fe2c55] via-[#ff4d6d] to-[#ff6b35] flex items-center justify-center shadow-2xl shadow-[#fe2c55]/40">
            {/* Play icon */}
            <svg viewBox="0 0 60 60" className="w-14 h-14" fill="none">
              {/* S letter + play shape */}
              <text
                x="8"
                y="44"
                fontFamily="'Inter', sans-serif"
                fontWeight="900"
                fontSize="38"
                fill="white"
              >
                S
              </text>
              <polygon
                points="38,18 54,30 38,42"
                fill="white"
                opacity="0.9"
              />
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center">
          <h1
            className="text-5xl font-black text-white tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fe2c55 60%, #ff6b35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SEMPela
          </h1>
          <p className="text-white/40 text-sm font-medium tracking-[0.2em] uppercase mt-2">
            Short Video Platform
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#fe2c55]"
              style={{
                animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Footer brand */}
      <div
        className="absolute bottom-10 text-center transition-opacity duration-700"
        style={{ opacity: phase === 'in' ? 0 : 0.4 }}
      >
        <p className="text-white/40 text-xs">Developed by Josué Sempela</p>
      </div>

      <style>{`
        @keyframes splashPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50%       { transform: scale(1.08); opacity: 0.6; }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
