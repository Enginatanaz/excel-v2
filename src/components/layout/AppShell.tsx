/**
 * AppShell container coordinating desktop sidebar, responsive header, and mobile bottom navigation
 */

import React from 'react';
import { Header } from './Header.tsx';
import { Sidebar } from './Sidebar.tsx';
import { BottomNavigation } from './BottomNavigation.tsx';
import type { AppView } from '../../data/navigation.ts';

interface AppShellProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  activeLessonTitle?: string;
  children: React.ReactNode;
}

export function AppShell({
  currentView,
  onNavigate,
  activeLessonTitle,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header
        currentView={currentView}
        onNavigate={onNavigate}
        activeLessonTitle={activeLessonTitle}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop & Tablet Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={onNavigate}
          className="hidden md:flex"
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-6">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation currentView={currentView} onNavigate={onNavigate} />
    </div>
  );
}
