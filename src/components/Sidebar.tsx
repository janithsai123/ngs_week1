import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Calendar,
  BarChart3,
  FileText,
  History,
  User,
  Settings,
  Flame,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RoseCornerOrnament, RoseHeroBadge } from './FloralMotifs';

export type ViewType =
  | 'dashboard'
  | 'tasks'
  | 'focus'
  | 'calendar'
  | 'reports'
  | 'analytics'
  | 'history'
  | 'profile'
  | 'settings';

interface SidebarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenRecommend: () => void;
  onOpenWallpaper?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenRecommend,
  onOpenWallpaper,
}) => {
  const { profile, tasks, activeFocusTask, triggerNewDayReset } = useApp();

  const incompleteCount = tasks.filter(t => t.status === 'active').length;
  const completedCount = tasks.filter(t => t.status === 'completed_today').length;

  const NAV_ITEMS: { id: ViewType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: incompleteCount },
    { id: 'focus', label: 'Focus Mode', icon: Target, badge: activeFocusTask ? 'Active' : undefined },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText, badge: 'New' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History, badge: completedCount > 0 ? `${completedCount} today` : undefined },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white/90 backdrop-blur-xl border-r border-rose-200/70 flex flex-col justify-between shrink-0 min-h-screen relative shadow-[4px_0_24px_rgba(225,29,72,0.04)] hidden md:flex">
      <RoseCornerOrnament position="top-left" className="absolute top-0 left-0 w-28 h-28" />

      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-rose-100/60 flex items-center gap-3">
          <RoseHeroBadge className="w-10 h-10" />
          <div>
            <h2 className="text-xl font-serif-title font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
              JANITH <span className="text-rose-600">TASKS</span>
            </h2>
            <p className="text-[10px] font-bold text-rose-800 tracking-wider uppercase">
              Floral Study Sanctuary
            </p>
          </div>
        </div>

        {/* User Card Mini */}
        <div className="mx-4 my-3 p-3 rounded-2xl bg-gradient-to-r from-rose-50/90 to-pink-50/70 border border-rose-200/80 shadow-2xs flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-rose-300"
            />
            <div>
              <div className="text-xs font-bold text-gray-900">{profile.name}</div>
              <div className="text-[10px] text-rose-700 font-semibold">ML &amp; GATE Focus</div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 shadow-2xs" title="Current Daily Streak">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-amber-800">{profile.streak.current}d</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md font-semibold'
                    : 'text-gray-700 hover:bg-rose-50/80 hover:text-rose-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-rose-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'Active'
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : item.badge === 'New'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 m-3 space-y-2">
        {/* Quick Day Reset Button */}
        <button
          onClick={triggerNewDayReset}
          className="w-full py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-900 border border-rose-200 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
          title="Reset today's tasks for a fresh new day"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
          <span>Start Fresh Day</span>
        </button>

        {/* Promo CTA */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-50/90 via-pink-50/70 to-white/90 border border-rose-200/80 text-center relative overflow-hidden backdrop-blur-md shadow-2xs">
          <Sparkles className="w-4 h-4 text-rose-500 mx-auto mb-1" />
          <h4 className="text-xs font-bold text-rose-950 mb-0.5">Need Direction?</h4>
          <button
            onClick={onOpenRecommend}
            className="w-full py-1.5 px-2.5 mt-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
          >
            What Should I Do Now?
          </button>
        </div>
      </div>
    </aside>
  );
};
