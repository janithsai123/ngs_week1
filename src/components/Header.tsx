import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Image, Plus, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOTIVATIONAL_QUOTES } from '../lib/constants';
import { RoseHeroBadge } from './FloralMotifs';

interface HeaderProps {
  onOpenRecommend: () => void;
  onOpenAddTask: () => void;
  onOpenWallpaper: () => void;
  onNavigateFocus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRecommend,
  onOpenAddTask,
  onOpenWallpaper,
  onNavigateFocus,
}) => {
  const { profile, activeFocusTask, focusTimer, triggerNewDayReset } = useApp();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all shadow-[0_4px_20px_rgba(99,102,241,0.04)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Greeting & Date */}
        <div>
          <div className="flex items-center gap-2">
            <RoseHeroBadge className="w-8 h-8" />
            <h1 className="text-xl sm:text-2xl font-serif-title font-bold text-slate-900 tracking-tight">
              {getGreeting()}, {profile.name.split(' ')[0]} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
            <span className="font-bold text-slate-900">{todayFormatted}</span>
            <span>•</span>
            <span className="italic truncate max-w-xs sm:max-w-md hidden sm:inline text-slate-700">
              &ldquo;{MOTIVATIONAL_QUOTES[quoteIndex]}&rdquo;
            </span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {activeFocusTask && (
            <button
              onClick={onNavigateFocus}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-600 text-white text-xs font-bold shadow-md animate-cute-glow hover:bg-violet-700 transition cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 animate-spin text-white" />
              <span>
                Focusing: <strong>{activeFocusTask.title}</strong> ({formatTimer(focusTimer.remainingSeconds)})
              </span>
            </button>
          )}

          <button
            onClick={triggerNewDayReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition cursor-pointer shadow-2xs"
            title="Reset daily tasks for a fresh day"
          >
            <RotateCcw className="w-3.5 h-3.5 text-violet-600" />
            <span className="hidden sm:inline">Fresh Day</span>
          </button>

          <button
            onClick={onOpenWallpaper}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 hover:bg-violet-50 text-slate-800 border border-slate-200 text-xs font-bold transition cursor-pointer shadow-2xs"
            title="Choose Background Theme"
          >
            <Image className="w-3.5 h-3.5 text-violet-600" />
            <span className="hidden sm:inline">Theme Wallpaper</span>
          </button>

          <button
            onClick={onOpenRecommend}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200" />
            WHAT SHOULD I DO NOW?
          </button>

          <button
            onClick={onOpenAddTask}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 font-bold text-xs sm:text-sm transition cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4 text-violet-600" />
            Add Task
          </button>
        </div>
      </div>
    </header>
  );
};
