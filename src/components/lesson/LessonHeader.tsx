/**
 * Lesson Header with title, category, and navigation back to list
 */

import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import type { Lesson } from '../../modules/learning/lessonTypes.ts';

interface LessonHeaderProps {
  lesson: Lesson;
  isCompleted: boolean;
  onBackToLessons: () => void;
}

export function LessonHeader({
  lesson,
  isCompleted,
  onBackToLessons,
}: LessonHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToLessons}
          className="p-1.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          title="Tüm Derslere Dön"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Ders {lesson.number}</span>
            <span aria-hidden="true">·</span>
            <span>{lesson.category}</span>
            <span aria-hidden="true">·</span>
            <span>{lesson.estimatedMinutes} dk</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
            {lesson.title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {isCompleted ? (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ders Tamamlandı</span>
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-medium px-2.5 py-1 bg-slate-100 rounded-md">
            Öğrenme Modunda
          </div>
        )}
      </div>
    </div>
  );
}
