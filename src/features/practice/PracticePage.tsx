/**
 * Practice Page - Practical scenario challenges for learners
 */

import { Dumbbell, Play, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card.tsx';
import { Button } from '../../components/common/Button.tsx';
import type { AppView } from '../../data/navigation.ts';

interface PracticePageProps {
  onNavigate: (view: AppView, lessonId?: string) => void;
}

export function PracticePage({ onNavigate }: PracticePageProps) {
  const challenges = [
    {
      id: 'pr_1',
      title: 'Haftalık Elektronik Satış Raporu',
      category: 'Formül Doğrulama',
      difficulty: 'Kolay',
      description: '5 kalem donanım ürününün toplam satış cirosunu =TOPLA fonksiyonu ile hesaplayın.',
      targetLessonId: 'sum_function',
      isCompleted: true,
    },
    {
      id: 'pr_2',
      title: 'Hücre Gezinme ve Seçim Hızı',
      category: 'Temel Arayüz',
      difficulty: 'Başlangıç',
      description: 'Tablo üzerinde klavye kısayollarını (Oklar, Tab, Enter) kullanarak hücre adreslerini bulun.',
      targetLessonId: 'excel_intro',
      isCompleted: true,
    },
    {
      id: 'pr_3',
      title: 'Serbest Formül Denemeleri',
      category: 'Simülatör',
      difficulty: 'Serbest',
      description: 'Simülatörde istediğiniz sayıları girip =TOPLA, =ORTALAMA ve =MAK fonksiyonlarını deneyin.',
      targetLessonId: undefined,
      isCompleted: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Pratik ve Senaryo Alıştırmaları
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Öğrendiğiniz fonksiyonları gerçek iş senaryoları üzerinde test edin ve pekiştirin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((c) => (
          <Card key={c.id} className="flex flex-col justify-between h-full">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{c.category}</span>
                <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {c.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              {c.isCompleted ? (
                <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tamamlandı</span>
                </div>
              ) : (
                <div className="text-xs text-slate-400">Bekliyor</div>
              )}

              <Button
                variant={c.isCompleted ? 'outline' : 'primary'}
                size="sm"
                onClick={() => {
                  if (c.targetLessonId) {
                    onNavigate('lesson_detail', c.targetLessonId);
                  } else {
                    onNavigate('simulator');
                  }
                }}
                icon={c.targetLessonId ? <Play className="w-3.5 h-3.5 fill-current" /> : <Dumbbell className="w-3.5 h-3.5" />}
              >
                {c.targetLessonId ? 'Alıştırmayı Aç' : 'Simülatörde Dene'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
