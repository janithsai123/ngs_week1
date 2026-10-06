import React from 'react';
import { LayoutDashboard, CheckSquare, Target, Calendar, FileText, User } from 'lucide-react';
import { ViewType } from './Sidebar';
import { useApp } from '../context/AppContext';

interface MobileNavProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onSelectView }) => {
  const { activeFocusTask } = useApp();

  const NAV_ITEMS: { id: ViewType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'focus', label: 'Focus', icon: Target },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-rose-200/80 px-2 py-2 flex items-center justify-around shadow-lg">
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        const isFocusItem = item.id === 'focus' && activeFocusTask;

        return (
          <button
            key={item.id}
            onClick={() => onSelectView(item.id)}
            className={`flex flex-col items-center justify-center p-1 rounded-xl transition cursor-pointer relative ${
              isActive ? 'text-rose-600 font-bold' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {isFocusItem && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping"></span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
