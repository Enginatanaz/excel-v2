/**
 * Sidebar navigation component for desktop and tablet screens
 */

import {
  LayoutDashboard,
  BookOpen,
  Table2,
  Dumbbell,
  TrendingUp,
  Wrench,
  User,
  GraduationCap,
} from 'lucide-react';
import type { AppView } from '../../data/navigation.ts';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  className?: string;
}

export function Sidebar({ currentView, onNavigate, className = '' }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as AppView, label: 'Ana Sayfa', icon: LayoutDashboard },
    { id: 'lessons' as AppView, label: 'Dersler', icon: BookOpen },
    { id: 'simulator' as AppView, label: 'Excel Simülatörü', icon: Table2 },
    { id: 'practice' as AppView, label: 'Pratik', icon: Dumbbell },
    { id: 'progress' as AppView, label: 'İlerleme', icon: TrendingUp },
    { id: 'tools' as AppView, label: 'Araçlar', icon: Wrench },
    { id: 'profile' as AppView, label: 'Profil', icon: User },
  ];

  return (
    <aside
      className={`w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0 ${className}`}
    >
      <div>
        <div className="flex items-center gap-2.5 px-3 py-3 mb-4 rounded-lg bg-emerald-50/70 border border-emerald-100">
          <div className="w-8 h-8 rounded bg-[#107c41] text-white flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-900 leading-tight">Excel Akademi AI</div>
            <div className="text-[11px] text-slate-500">Aşama 1: Temel Mimari</div>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentView === item.id ||
              (item.id === 'lessons' && currentView === 'lesson_detail');

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#107c41]/10 text-[#107c41] font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#107c41]' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick context info at bottom */}
      <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 px-3">
        <div className="font-medium text-slate-700 mb-0.5">Aktif Ders</div>
        <div className="text-slate-600 truncate">TOPLA (SUM) Fonksiyonu</div>
        <div className="text-[11px] text-slate-400 mt-1">3 Adımlı Uygulama</div>
      </div>
    </aside>
  );
}
