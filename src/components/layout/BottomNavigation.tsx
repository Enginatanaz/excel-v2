/**
 * Bottom navigation bar for mobile devices (320px - 767px)
 * Adheres to 15% viewport height cap and thumb accessibility
 */

import { LayoutDashboard, BookOpen, Table2, Dumbbell, User } from 'lucide-react';
import type { AppView } from '../../data/navigation.ts';

interface BottomNavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export function BottomNavigation({ currentView, onNavigate }: BottomNavigationProps) {
  const items = [
    { id: 'dashboard' as AppView, label: 'Ana Sayfa', icon: LayoutDashboard },
    { id: 'lessons' as AppView, label: 'Dersler', icon: BookOpen },
    { id: 'simulator' as AppView, label: 'Simülatör', icon: Table2 },
    { id: 'practice' as AppView, label: 'Pratik', icon: Dumbbell },
    { id: 'profile' as AppView, label: 'Profil', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-sm safe-area-pb">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          currentView === item.id ||
          (item.id === 'lessons' && currentView === 'lesson_detail');

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-md min-w-[56px] text-[11px] font-medium transition-colors ${
              isActive ? 'text-[#107c41]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#107c41]' : 'text-slate-400'}`} />
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
