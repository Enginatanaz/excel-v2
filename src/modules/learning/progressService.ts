/**
 * Local progress persistence service for Excel Akademi AI
 */

import type { OverallLearningProgress, UserLessonProgress } from './lessonTypes.ts';

const STORAGE_KEY = 'excel_akademi_progress_v1';

const INITIAL_PROGRESS: OverallLearningProgress = {
  totalCompletedLessons: 0,
  totalTimeSpentMinutes: 15,
  dailyGoalMinutes: 20,
  dailyMinutesCompleted: 15,
  lastLessonId: 'sum_function',
  recommendedLessonId: 'sum_function',
  lessonProgress: {
    excel_intro: {
      lessonId: 'excel_intro',
      completed: true,
      currentTaskIndex: 2,
      completedTasks: ['task_intro_1', 'task_intro_2'],
      lastStudiedAt: new Date().toISOString(),
      score: 100,
    },
    sum_function: {
      lessonId: 'sum_function',
      completed: false,
      currentTaskIndex: 0,
      completedTasks: [],
      lastStudiedAt: new Date().toISOString(),
      score: 0,
    },
  },
};

let memoryStore: Record<string, string> = {};

export const progressService = {
  getProgress(): OverallLearningProgress {
    try {
      let raw: string | null = null;
      if (typeof localStorage !== 'undefined') {
        raw = localStorage.getItem(STORAGE_KEY);
      } else {
        raw = memoryStore[STORAGE_KEY] || null;
      }
      if (!raw) return INITIAL_PROGRESS;
      return JSON.parse(raw) as OverallLearningProgress;
    } catch {
      return INITIAL_PROGRESS;
    }
  },

  saveProgress(progress: OverallLearningProgress): void {
    try {
      const serialized = JSON.stringify(progress);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, serialized);
      } else {
        memoryStore[STORAGE_KEY] = serialized;
      }
    } catch (e) {
      console.warn('Could not persist progress:', e);
    }
  },

  saveLessonProgress(lessonId: string, update: Partial<UserLessonProgress>): OverallLearningProgress {
    const current = this.getProgress();
    const existing = current.lessonProgress[lessonId] || {
      lessonId,
      completed: false,
      currentTaskIndex: 0,
      completedTasks: [],
      lastStudiedAt: new Date().toISOString(),
    };

    const updatedLesson = {
      ...existing,
      ...update,
      lastStudiedAt: new Date().toISOString(),
    };

    const newLessonProgress = {
      ...current.lessonProgress,
      [lessonId]: updatedLesson,
    };

    const completedCount = Object.values(newLessonProgress).filter((l) => l.completed).length;

    const updatedOverall: OverallLearningProgress = {
      ...current,
      totalCompletedLessons: completedCount,
      lastLessonId: lessonId,
      lessonProgress: newLessonProgress,
    };

    this.saveProgress(updatedOverall);
    return updatedOverall;
  },

  resetProgress(): OverallLearningProgress {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    return INITIAL_PROGRESS;
  },
};
