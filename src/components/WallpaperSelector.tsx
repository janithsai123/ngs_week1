import React from 'react';
import { Image, Sparkles, Check, Sliders, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WALLPAPER_PRESETS } from '../lib/constants';
import { WallpaperPresetId } from '../types';
import { RoseCornerOrnament } from './FloralMotifs';

interface WallpaperSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WallpaperSelector: React.FC<WallpaperSelectorProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl p-6 sm:p-8 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-rose-200 overflow-hidden text-left max-h-[90vh] overflow-y-auto">
        <RoseCornerOrnament position="top-right" className="absolute -top-2 -right-2 w-28 h-28" />
        <RoseCornerOrnament position="bottom-left" className="absolute -bottom-2 -left-2 w-28 h-28" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-md">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif-title font-bold text-gray-900">
                Floral Backgrounds &amp; Theme
              </h3>
              <p className="text-xs text-rose-800/80">
                Choose your aesthetic wallpaper from the curated reference gallery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Wallpaper Presets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {WALLPAPER_PRESETS.map(preset => {
            const isSelected = settings.wallpaper === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => updateSettings({ wallpaper: preset.id })}
                className={`relative group rounded-2xl overflow-hidden border-2 text-left transition-all p-3 cursor-pointer flex items-center gap-3.5 ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/80 shadow-md ring-2 ring-rose-300'
                    : 'border-rose-100 bg-white hover:border-rose-300 hover:bg-rose-50/40 shadow-2xs'
                }`}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-rose-200 relative">
                  {preset.url ? (
                    <img
                      src={preset.thumbnail}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-rose-200 to-pink-100 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-rose-500" />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute inset-0 bg-rose-600/30 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-bold text-sm text-gray-900 truncate">
                      {preset.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-tight line-clamp-2">
                    {preset.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Customization Sliders */}
        <div className="space-y-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-rose-600" />
              Glass Translucency &amp; Text Clarity: {Math.round(settings.wallpaperOverlay * 100)}%
            </span>
            <span className="text-[11px] text-gray-500">
              {settings.wallpaperOverlay > 0.85 ? 'High Contrast' : 'Vivid Wallpaper'}
            </span>
          </div>

          <input
            type="range"
            min="0.5"
            max="0.95"
            step="0.05"
            value={settings.wallpaperOverlay}
            onChange={e => updateSettings({ wallpaperOverlay: parseFloat(e.target.value) })}
            className="w-full accent-rose-600 cursor-pointer"
          />

          <div className="flex items-center justify-between pt-2 border-t border-rose-100/80">
            <div>
              <div className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                Floating Rose Petals
              </div>
              <div className="text-[11px] text-gray-500">Gently drifting animated petals across the background</div>
            </div>
            <input
              type="checkbox"
              checked={settings.enableFloatingPetals}
              onChange={e => updateSettings({ enableFloatingPetals: e.target.checked })}
              className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-xs sm:text-sm shadow-md hover:from-rose-600 hover:to-pink-700 transition cursor-pointer"
          >
            Apply &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
