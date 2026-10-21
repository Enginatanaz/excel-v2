/**
 * Profile Page - Learner profile preferences and local data controls
 */

import { useState } from 'react';
import { User, Volume2, ShieldCheck, Database, RotateCcw } from 'lucide-react';
import { Card } from '../../components/common/Card.tsx';
import { Button } from '../../components/common/Button.tsx';
import { progressService } from '../../modules/learning/progressService.ts';

export function ProfilePage() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = () => {
    progressService.resetProgress();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Öğrenci Profili ve Tercihler
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kişiselleştirme ayarları ve öğrenme oturumu kontrolü.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800">
          Tüm yerel oturum ve ders ilerleme verileri başarıyla sıfırlandı.
        </div>
      )}

      {/* User Information Card */}
      <Card className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#107c41] flex items-center justify-center font-bold text-xl shrink-0">
          <User className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">Demo Öğrenci Hesabı</h2>
          <div className="text-xs text-slate-500">
            Aşama 1 Yerel Geliştirici Oturumu
          </div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium pt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Aktif Seviye: Temel Düzey (Aşama 1)</span>
          </div>
        </div>
      </Card>

      {/* Settings Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Öğrenme Tercihleri</h3>

        <Card className="space-y-4">
          {/* Voice Teacher Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800">Sesli Öğretmen Desteği</div>
                <div className="text-[11px] text-slate-500">
                  Ders adımlarında Web Speech API ile Türkçe sesli yönergeleri etkinleştirin.
                </div>
              </div>
            </div>

            <button
              onClick={() => setVoiceEnabled((prev) => !prev)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                voiceEnabled ? 'bg-[#107c41]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  voiceEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Local Storage Data Control */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800">Yerel Veri Saklama</div>
                <div className="text-[11px] text-slate-500">
                  Ders tamamlama durumları tarayıcınızın LocalStorage alanında korunur.
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleResetData}
              icon={<RotateCcw className="w-3 h-3" />}
            >
              Verileri Sıfırla
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
