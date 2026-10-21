/**
 * Progress Page - Detailed analytics and local learning records
 */

import { useState } from 'react';
import { Award, Clock, BookOpen, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/common/Card.tsx';
import { Button } from '../../components/common/Button.tsx';
import { ProgressBar } from '../../components/common/ProgressBar.tsx';
import { progressService } from '../../modules/learning/progressService.ts';

export function ProgressPage() {
  const [progress, setProgress] = useState(progressService.getProgress());
  const [showResetNotice, setShowResetNotice] = useState(false);

  const handleReset = () => {
    const fresh = progressService.resetProgress();
    setProgress(fresh);
    setShowResetNotice(true);
    setTimeout(() => setShowResetNotice(false), 3000);
  };

  const completedCount = Object.values(progress.lessonProgress).filter(
    (l) => l.completed
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Öğrenme İlerlemesi ve Başarılar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Yerel tarayıcı hafızasında saklanan kişisel çalışma istatistikleriniz.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Demo İlerlemesini Sıfırla
        </Button>
      </div>

      {showResetNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 animate-in fade-in">
          Öğrenme verileri başarıyla sıfırlandı.
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Tamamlanan Ders</div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {completedCount} / 2
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Toplam Süre</div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {progress.totalTimeSpentMinutes} dakika
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Genel Başarı Puanı</div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              %100
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Lesson Breakdown Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Ders Bazında Durum</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="py-2.5 px-4">Ders Adı</th>
                <th className="py-2.5 px-4">Durum</th>
                <th className="py-2.5 px-4">Tamamlanan Görev</th>
                <th className="py-2.5 px-4">Son Çalışma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900">
                  Excel'e Giriş & Hücre Mantığı
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tamamlandı
                  </span>
                </td>
                <td className="py-3 px-4 font-mono">2 / 2</td>
                <td className="py-3 px-4 text-slate-500">Bugün</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900">
                  TOPLA (SUM) Fonksiyonu
                </td>
                <td className="py-3 px-4">
                  {progress.lessonProgress['sum_function']?.completed ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tamamlandı
                    </span>
                  ) : (
                    <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Devam Ediyor
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 font-mono">
                  {progress.lessonProgress['sum_function']?.completedTasks?.length || 0} / 3
                </td>
                <td className="py-3 px-4 text-slate-500">Bugün</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Persistence Note */}
      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-lg text-xs text-slate-500 leading-relaxed">
        <span className="font-semibold text-slate-700 block mb-0.5">Veri Saklama Bilgisi:</span>
        Bu aşamada ilerleme kayıtları tarayıcınızın yerel depolama alanında (LocalStorage) tutulmaktadır. Herhangi bir bulut hesabı senkronizasyonu gerekmeksizin tarayıcınızı kapatsanız bile kaldığınız yerden devam edebilirsiniz.
      </div>
    </div>
  );
}
