import React from 'react';

export const RoseCornerOrnament: React.FC<{ className?: string; position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' }> = ({
  className = '',
  position = 'top-right',
}) => {
  const rotation = {
    'top-right': 'rotate-0',
    'bottom-right': 'rotate-90',
    'bottom-left': 'rotate-180',
    'top-left': '-rotate-90',
  }[position];

  return (
    <div className={`pointer-events-none select-none opacity-30 hover:opacity-50 transition-opacity ${rotation} ${className}`}>
      <svg width="84" height="84" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cuteGrad" x1="0%" y1="0%" x2="1" y2="1">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="60%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <path d="M95 5 C 65 15, 30 45, 10 95" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
        <circle cx="82" cy="18" r="6" fill="url(#cuteGrad)" opacity="0.8"/>
        <circle cx="50" cy="46" r="8" fill="url(#cuteGrad)" opacity="0.8"/>
        <circle cx="20" cy="80" r="5" fill="url(#cuteGrad)" opacity="0.7"/>
        {/* Twinkle star */}
        <path d="M70 45 Q 75 45 75 40 Q 75 45 80 45 Q 75 45 75 50 Q 75 45 70 45 Z" fill="#facc15" />
      </svg>
    </div>
  );
};

export const RoseHeroBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative inline-flex items-center justify-center ${className}`}>
    <div className="absolute inset-0 bg-violet-200/50 rounded-full blur-md transform scale-110"></div>
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" className="relative drop-shadow-sm">
      <defs>
        <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {/* Crescent moon & heart cloud motif */}
      <circle cx="50" cy="50" r="32" fill="url(#badgeGrad)" />
      {/* Cute crescent moon */}
      <path d="M52 32 C 42 34 36 44 38 54 C 40 64 50 70 60 66 C 50 66 42 58 44 48 C 46 40 50 34 52 32 Z" fill="#fef08a" />
      {/* Star sparkle */}
      <circle cx="64" cy="38" r="3" fill="#ffffff" />
    </svg>
  </div>
);

export const FloralEmptyState: React.FC<{ title: string; message: string; actionText?: string; onAction?: () => void }> = ({
  title,
  message,
  actionText,
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200 relative overflow-hidden shadow-2xs">
    <RoseCornerOrnament position="top-right" className="absolute top-0 right-0" />
    <RoseCornerOrnament position="bottom-left" className="absolute bottom-0 left-0" />
    
    <div className="w-18 h-18 mb-4 rounded-full bg-violet-50 shadow-inner border border-violet-100 flex items-center justify-center">
      <RoseHeroBadge className="w-10 h-10" />
    </div>

    <h3 className="text-xl font-serif-title font-bold text-slate-900 mb-2">
      {title}
    </h3>
    <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
      {message}
    </p>

    {actionText && onAction && (
      <button
        onClick={onAction}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:from-violet-700 hover:to-indigo-700 transition-all cursor-pointer"
      >
        {actionText}
      </button>
    )}
  </div>
);
