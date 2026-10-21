/**
 * Lessons catalog page displaying available lessons, completion status, and level badges
 */

import { useState } from 'react';
import { Play, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../../components/common/Card.tsx';
import { Button } from '../../components/common/Button.tsx';
import { excelIntroductionLesson } from '../../data/lessons/excelIntroduction.ts';
import { sumFunctionLesson } from '../../data/lessons/sumFunction.ts';
import { cellFormattingLesson } from '../../data/lessons/cellFormatting.ts';
import { progressService } from '../../modules/learning/progressService.ts';
import type { AppView } from '../../data/navigation.ts';

interface LessonsPageProps {
  onSelectLesson: (lessonId: string) => void;
  onNavigate: (view: AppView) => void;
}

export function LessonsPage({ onSelectLesson }: LessonsPageProps) {
  const [filterLevel, setFilterLevel] = useState<'all' | 'Başlangıç'>('all');
  const progress = progressService.getProgress();

  const lessons = [excelIntroductionLesson, sumFunctionLesson, cellFormattingLesson];

  const filteredLessons =
    filterLevel === 'all'
      ? lessons
      : lessons.filter((l) => l.level === filterLevel);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Excel Eğitim Müfredatı
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Aşama 1 temel modülleri: Giriş ve TOPLA fonksiyonu ile etkileşimli öğrenme.
          </p>
        </div>

        {/* Level Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setFilterLevel('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterLevel === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tüm Dersler
          </button>
          <button
            onClick={() => setFilterLevel('Başlangıç')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              filterLevel === 'Başlangıç'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Başlangıç Seviyesi
          </button>
        </div>
      </div>

      {/* Lesson Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredLessons.map((lesson) => {
          const lessonProg = progress.lessonProgress[lesson.id];
          const isDone = lessonProg?.completed === true;
          const completedTasksCount = lessonProg?.completedTasks?.length || 0;

          return (
            <Card
              key={lesson.id}
              variant="interactive"
              onClick={() => onSelectLesson(lesson.id)}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:border-emerald-600/40"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Ders {lesson.number}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lesson.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lesson.level}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lesson.estimatedMinutes} dakika</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {lesson.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {lesson.description}
                </p>

                <div className="text-xs text-slate-500 pt-1">
                  Öğrenme Hedefi: {lesson.learningObjective}
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {isDone ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tamamlandı</span>
                  </div>
                ) : completedTasksCount > 0 ? (
                  <div className="text-xs text-slate-500 font-mono">
                    {completedTasksCount} / {lesson.tasks.length} Görev Yapıldı
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">Henüz Başlanmadı</div>
                )}

                <Button
                  variant={isDone ? 'outline' : 'primary'}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLesson(lesson.id);
                  }}
                  icon={isDone ? <ArrowRight className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  iconPosition="right"
                >
                  {isDone ? 'Dersi İncele' : 'Dersi Başlat'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
