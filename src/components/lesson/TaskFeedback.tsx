/**
 * Task validation feedback card linking to live spreadsheet state
 */

import { CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Check, Sparkles } from 'lucide-react';
import type { TaskValidationResult, LessonEngineState } from '../../modules/learning/lessonTypes.ts';
import { Button } from '../common/Button.tsx';

interface TaskFeedbackProps {
  status?: string;
  engineState?: LessonEngineState;
  validationResult: TaskValidationResult | null;
  onValidate: () => void;
  onNextTask: () => void;
  onRetry: () => void;
  onRequestHint?: () => void;
  isLastTask: boolean;
}

export function TaskFeedback({
  engineState,
  validationResult,
  onValidate,
  onNextTask,
  onRetry,
  onRequestHint,
  isLastTask,
}: TaskFeedbackProps) {
  const isSuccess = engineState === 'correct' || validationResult?.isValid === true;
  const isRetry = engineState === 'incorrect' || (validationResult && !validationResult.isValid);
  const isValidating = engineState === 'validating';

  return (
    <div className="pt-2">
      {/* Success State */}
      {isSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-3 shadow-2xs">
          <div className="flex items-start gap-2.5 text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-[#107c41] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <span>Harika! Görev Başarıyla Tamamlandı</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <div className="text-emerald-900 mt-1 leading-relaxed font-medium">
                {validationResult?.message || 'Tebrikler! İstenen Excel işlemini doğru şekilde uyguladınız.'}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={onNextTask}
              icon={isLastTask ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              {isLastTask ? 'Bağımsız Alıştırmaya Geç' : 'Sonraki Göreve Geç'}
            </Button>
          </div>
        </div>
      )}

      {/* Retry / Error State */}
      {isRetry && (
        <div className="p-3.5 bg-rose-50/90 border border-rose-200 rounded-lg text-xs space-y-3">
          <div className="flex items-start gap-2.5 text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-950">İşlem Henüz Tamamlanmadı</div>
              <div className="text-rose-900 mt-1 leading-relaxed font-medium">
                {validationResult?.message}
              </div>
              {validationResult?.hint && (
                <div className="text-amber-900 bg-amber-100/60 p-2 rounded border border-amber-200/80 mt-2 font-medium">
                  <span className="font-bold">Öğretmen İpucu: </span>
                  {validationResult.hint}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            {onRequestHint && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onRequestHint}
              >
                İpucu Göster
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={onRetry}
              icon={<RotateCcw className="w-3 h-3" />}
            >
              Yeniden Dene
            </Button>
            <Button variant="primary" size="sm" onClick={onValidate} disabled={isValidating}>
              {isValidating ? 'Kontrol Ediliyor...' : 'Şimdi Kontrol Et'}
            </Button>
          </div>
        </div>
      )}

      {/* Default Instruction / Waiting State */}
      {!isSuccess && !isRetry && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-500">
            Tabloda işlemi uyguladıktan sonra:
          </span>
          <Button variant="primary" size="sm" onClick={onValidate} disabled={isValidating}>
            {isValidating ? 'Kontrol Ediliyor...' : 'Görevi Kontrol Et'}
          </Button>
        </div>
      )}
    </div>
  );
}
