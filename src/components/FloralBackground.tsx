import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { WALLPAPER_PRESETS } from '../lib/constants';

export const FloralBackground: React.FC = () => {
  const { settings } = useApp();

  const currentPreset = useMemo(() => {
    return WALLPAPER_PRESETS.find(p => p.id === settings.wallpaper) || WALLPAPER_PRESETS[0];
  }, [settings.wallpaper]);

  // Generate deterministic floating petals
  const petals = useMemo(() => {
    if (!settings.enableFloatingPetals) return [];
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      left: `${(i * 6.5 + 3) % 96}%`,
      animationDuration: `${14 + (i % 6) * 3}s`,
      animationDelay: `${(i % 5) * 2.5}s`,
      size: 14 + (i % 4) * 6,
      opacity: 0.28 + (i % 3) * 0.15,
      rotationStart: (i * 45) % 360,
    }));
  }, [settings.enableFloatingPetals]);

  // Generate twinkle stars for cute nature twilight aesthetic
  const stars = useMemo(() => {
    if (!settings.enableCuteStars) return [];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${(i * 17 + 5) % 94}%`,
      top: `${(i * 13 + 8) % 65}%`,
      size: 2 + (i % 3) * 1.5,
      delay: `${(i % 4) * 1.2}s`,
      duration: `${3 + (i % 3) * 1.5}s`,
    }));
  }, [settings.enableCuteStars]);

  const isTwilight = settings.wallpaper === 'twilight-heart-moon';

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* 1. Base Wallpaper Image */}
      {currentPreset.url ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed transition-all duration-1000 transform scale-105"
          style={{
            backgroundImage: `url('${currentPreset.url}')`,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/90 via-pink-100/80 to-amber-50/70" />
      )}

      {/* 2. Frosted Glass Mask / Overlay */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          backgroundColor:
            settings.theme === 'dark'
              ? `rgba(18, 12, 22, ${settings.wallpaperOverlay || 0.88})`
              : isTwilight
              ? `rgba(250, 245, 255, ${settings.wallpaperOverlay || 0.80})`
              : `rgba(253, 248, 249, ${settings.wallpaperOverlay || 0.82})`,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      />

      {/* 3. Soft Ambient Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-purple-900/5 to-rose-950/15" />

      {/* 4. Cute Twinkle Stars */}
      {settings.enableCuteStars && (
        <div className="absolute inset-0">
          {stars.map(s => (
            <div
              key={s.id}
              className="absolute rounded-full bg-amber-200 shadow-[0_0_8px_rgba(253,224,71,0.8)] animate-pulse"
              style={{
                left: s.left,
                top: s.top,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: s.delay,
                animationDuration: s.duration,
              }}
            />
          ))}
        </div>
      )}

      {/* 5. Floating Animated Rose Petals */}
      {settings.enableFloatingPetals && (
        <div className="absolute inset-0 overflow-hidden">
          {petals.map(p => (
            <div
              key={p.id}
              className="absolute animate-float-petal"
              style={{
                left: p.left,
                top: '-40px',
                animationDuration: p.animationDuration,
                animationDelay: p.animationDelay,
                opacity: p.opacity,
              }}
            >
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 100 100"
                fill="none"
                style={{ transform: `rotate(${p.rotationStart}deg)` }}
              >
                <path
                  d="M50 10 C 25 20, 15 50, 30 80 C 45 95, 65 95, 75 75 C 90 50, 75 20, 50 10 Z"
                  fill="url(#petalGradRose)"
                />
                <defs>
                  <linearGradient id="petalGradRose" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="50%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#881337" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
