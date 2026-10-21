/**
 * Dashboard Page - Central learning hub for Excel Akademi AI
 */

import { Play, BookOpen, Table2, Dumbbell, Award, ArrowRight, Clock } from 'lucide-react';
import { Card } from '../../components/common/Card.tsx';
import { Button } from '../../components/common/Button.tsx';
import { ProgressBar } from '../../components/common/ProgressBar.tsx';
import type { AppView } from '../../data/navigation.ts';
import { progressService } from '../../modules/learning/progressService.ts';

interface DashboardPageProps {
  onNavigate: (view: AppView, lessonId?: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const progress = progressService.getProgress();

  return (
    <div className="space-y-6">
      {/* Welcome Hero Card */}
      <div className="bg-gradient-to-r from-[#107c41] to-[#0b5a2f] text-white rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold tracking-wide text-emerald-200 uppercase mb-2">
            Excel Akademi AI · Aşama 1
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Excel’i Gerçek Çalışma Alanında Öğrenin
          </h1>
          <p className="text-sm text-emerald-100 leading-relaxed mb-6">
            Teoriyi okuyun, sesli öğretmen yönergelerini dinleyin ve gerçek Excel simülatöründe hücreleri düzenleyerek pratik yapın.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigate('lesson_detail', 'sum_function')}
              icon={<Play className="w-4 h-4 fill-current text-[#107c41]" />}
            >
              Öğrenmeye Devam Et: TOPLA Dersi
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('simulator')}
              className="bg-transparent border-emerald-300/40 text-white hover:bg-white/10"
              icon={<Table2 className="w-4 h-4" />}
            >
              Excel Simülatörünü Aç
            </Button>
          </div>
        </div>
      </div>

      {/* Progress & Daily Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Goal */}
        <Card>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">Günlük Çalışma Hedefi</span>
            <span className="flex items-center gap-1 font-mono text-emerald-700">
              <Clock className="w-3.5 h-3.5" />
              {progress.dailyMinutesCompleted} / {progress.dailyGoalMinutes} dk
            </span>
          </div>
          <ProgressBar
            value={(progress.dailyMinutesCompleted / progress.dailyGoalMinutes) * 100}
            showPercent={false}
          />
          <div className="text-xs text-slate-500 mt-2">
            Günün hedefini tamamlamak için 5 dakika daha çalışın.
          </div>
        </Card>

        {/* Completed Lessons */}
        <Card>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700">Müfredat İlerlemesi</span>
            <span className="font-mono text-slate-600">
              {progress.totalCompletedLessons} / 2 Ders
            </span>
          </div>
          <ProgressBar
            value={(progress.totalCompletedLessons / 2) * 100}
            showPercent={true}
          />
          <div className="text-xs text-slate-500 mt-2">
            Temel düzey 1. Aşama müfredatı aktif.
          </div>
        </Card>

        {/* Quick Achievement */}
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">Başlangıç Rozeti</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Excel formül yolculuğunuz başarıyla başladı.
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Continue Learning & Next Recommended */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue card */}
        <Card variant="interactive" onClick={() => onNavigate('lesson_detail', 'sum_function')}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Son Çalışılan Ders</div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                TOPLA (SUM) Fonksiyonu
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Hücre aralığı tanımlama, sözdizimi ve satış tablosu üzerinde gerçek toplam hesaplama.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#107c41]">
                <span>Dersi Başlat ve Tabloda Uygula</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100/60 text-[#107c41] flex items-center justify-center shrink-0">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
          </div>
        </Card>

        {/* Foundation Card */}
        <Card variant="interactive" onClick={() => onNavigate('lesson_detail', 'excel_intro')}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500 font-medium mb-1">Temel Başvuru Dersi</div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Excel'e Giriş & Hücre Mantığı
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Sütun harfleri, satır numaraları, ad kutusu ve aktif hücre seçimi mekaniği.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#107c41]">
                <span>Tekrar Gözden Geçir</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Access to Tools & Practice */}
      <div className="pt-2">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Hızlı Erişim Araçları</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('simulator')}
            className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50/50 transition-colors text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Table2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900">Serbest Simülatör</div>
              <div className="text-[11px] text-slate-500">Sınırsız tablo denemeleri</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('practice')}
            className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50/50 transition-colors text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900">Pratik Alıştırmalar</div>
              <div className="text-[11px] text-slate-500">Hızlı senaryo testleri</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('tools')}
            className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50/50 transition-colors text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900">Formül & Kısayol Rehberi</div>
              <div className="text-[11px] text-slate-500">Hızlı başvuru tablosu</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
