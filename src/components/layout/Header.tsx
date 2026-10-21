/**
 * Top Navigation Header adhering to the one-row 3-zone contract
 */

import { Play, Sparkles } from 'lucide-react';
import type { AppView } from '../../data/navigation.ts';

export interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  activeLessonTitle?: string;
}

export function Header({ currentView, onNavigate, activeLessonTitle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3 bg-white border-b border-slate-200">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-lg font-bold tracking-tight text-[#107c41] hover:text-[#0b5a2f] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
        >
          <div className="w-7 h-7 rounded bg-[#107c41] text-white flex items-center justify-center font-bold text-sm">
            X
          </div>
          <span className="hidden sm:inline">Excel Akademi AI</span>
          <span className="sm:hidden">Excel Akademi</span>
        </button>

        {activeLessonTitle && currentView === 'lesson_detail' && (
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 border-l border-slate-200 pl-3">
            <span>Ders</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-slate-800 truncate max-w-xs">{activeLessonTitle}</span>
          </div>
        )}
      </div>

      {/* Zone 2: Single-line top nav links for desktop */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'dashboard' ? 'text-[#107c41] font-semibold' : ''
          }`}
        >
          Ana Sayfa
        </button>
        <button
          onClick={() => onNavigate('lessons')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'lessons' || currentView === 'lesson_detail' ? 'text-[#107c41] font-semibold' : ''
          }`}
        >
          Dersler
        </button>
        <button
          onClick={() => onNavigate('simulator')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'simulator' ? 'text-[#107c41] font-semibold' : ''
          }`}
        >
          Excel Simülatörü
        </button>
        <button
          onClick={() => onNavigate('practice')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'practice' ? 'text-[#107c41] font-semibold' : ''
          }`}
        >
          Pratik
        </button>
        <button
          onClick={() => onNavigate('tools')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
            currentView === 'tools' ? 'text-[#107c41] font-semibold' : ''
          }`}
        >
          Araçlar
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-2.5 shrink-0">
        {currentView !== 'lesson_detail' ? (
          <button
            onClick={() => onNavigate('lesson_detail')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#107c41] rounded-md hover:bg-[#0b5a2f] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Derse Devam Et</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('simulator')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Serbest Simülatör</span>
            <span className="sm:hidden">Simülatör</span>
          </button>
        )}
      </div>
    </header>
  );
}
