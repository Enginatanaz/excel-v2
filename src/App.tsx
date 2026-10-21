/**
 * Excel Akademi AI - Main Application Entry
 * Stage 1: Project Architecture, Responsive Interface & Core Interactive Components
 */

import { useState } from 'react';
import { AppShell } from './components/layout/AppShell.tsx';
import type { AppView } from './data/navigation.ts';
import { DashboardPage } from './features/dashboard/DashboardPage.tsx';
import { LessonsPage } from './features/lessons/LessonsPage.tsx';
import { LessonPage } from './features/lessons/LessonPage.tsx';
import { SimulatorPage } from './features/simulator/SimulatorPage.tsx';
import { PracticePage } from './features/practice/PracticePage.tsx';
import { ProgressPage } from './features/progress/ProgressPage.tsx';
import { ToolsPage } from './features/tools/ToolsPage.tsx';
import { ProfilePage } from './features/profile/ProfilePage.tsx';
import { getLessonById, sumFunctionLesson } from './data/lessons/index.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('sum_function');

  const activeLesson = getLessonById(selectedLessonId) || sumFunctionLesson;

  const handleNavigate = (view: AppView, lessonId?: string) => {
    if (lessonId) {
      setSelectedLessonId(lessonId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentView('lesson_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppShell
      currentView={currentView}
      onNavigate={handleNavigate}
      activeLessonTitle={currentView === 'lesson_detail' ? activeLesson.title : undefined}
    >
      {currentView === 'dashboard' && (
        <DashboardPage onNavigate={handleNavigate} />
      )}

      {currentView === 'lessons' && (
        <LessonsPage
          onSelectLesson={handleSelectLesson}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'lesson_detail' && (
        <LessonPage
          lesson={activeLesson}
          onBackToLessons={() => setCurrentView('lessons')}
        />
      )}

      {currentView === 'simulator' && <SimulatorPage />}

      {currentView === 'practice' && (
        <PracticePage onNavigate={handleNavigate} />
      )}

      {currentView === 'progress' && <ProgressPage />}

      {currentView === 'tools' && <ToolsPage />}

      {currentView === 'profile' && <ProfilePage />}
    </AppShell>
  );
}
