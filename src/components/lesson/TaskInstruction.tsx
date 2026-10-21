/**
 * Task instruction panel displaying active student directive and guidance
 * with 3-level graduated hint progression and speech replay.
 */

import { useState } from 'react';
import { Target, Lightbulb, Volume2, HelpCircle } from 'lucide-react';
import type { TaskStep } from '../../modules/learning/lessonTypes.ts';
import { narrationService } from '../../modules/teacher/narrationService.ts';

interface TaskInstructionProps {
  task: TaskStep;
  totalTasks: number;
  currentHintLevel?: 1 | 2 | 3;
  onRequestHint?: () => void;
  hintsUsedCount?: number;
}

export function TaskInstruction({
  task,
  totalTasks,
  currentHintLevel = 1,
  onRequestHint,
  hintsUsedCount = 0,
}: TaskInstructionProps) {
  const [showHints, setShowHints] = useState<boolean>(false);

  const handlePlayInstruction = () => {
    narrationService.narrateTask(task, 'instruction');
  };

  const handleRequestHint = () => {
    setShowHints(true);
    if (onRequestHint) {
      onRequestHint();
    }
  };

  // Determine current active hint text based on level
  let activeHintText = task.hint;
  if (task.hints) {
    if (currentHintLevel === 1) activeHintText = task.hints.level1;
    else if (currentHintLevel === 2) activeHintText = task.hints.level2;
    else activeHintText = task.hints.level3;
  }

  return (
    <div className="space-y-3.5">
      {/* Header bar: Task count, target cell, narration button */}
      <div className="flex items-center justify-between text-xs text-slate-500 gap-2">
        <span className="font-semibold text-slate-800">
          Görev {task.taskNumber} / {totalTasks}
        </span>

        <div className="flex items-center gap-2">
          {task.targetCell && (
            <span className="flex items-center gap-1 font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <Target className="w-3 h-3 text-emerald-600" />
              Hedef: {task.targetCell}
            </span>
          )}

          <button
            onClick={handlePlayInstruction}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer text-[11px]"
            title="Öğretmeni tekrar dinle"
          >
            <Volume2 className="w-3 h-3 text-emerald-700" />
            <span className="hidden sm:inline">Tekrar Dinle</span>
          </button>
        </div>
      </div>

      {/* Main Instruction */}
      <div className="space-y-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900">{task.title}</h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{task.instruction}</p>
      </div>

      {/* 3-Level Graduated Hint Section */}
      <div className="pt-1 border-t border-slate-100">
        {!showHints && hintsUsedCount === 0 ? (
          <button
            onClick={handleRequestHint}
            className="flex items-center gap-1.5 text-xs text-emerald-800 hover:text-emerald-950 font-medium py-1 px-2 bg-emerald-50/80 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>İpucu İste (Seviye 1: Genel Yönlendirme)</span>
          </button>
        ) : (
          <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200/90 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                İpucu — Seviye {currentHintLevel} / 3:
                <span className="font-normal text-amber-800 text-[11px]">
                  {currentHintLevel === 1 && '(Genel Yönlendirme)'}
                  {currentHintLevel === 2 && '(Sözdizimi Yardımı)'}
                  {currentHintLevel === 3 && '(Tam Çözüm Rehberi)'}
                </span>
              </span>

              {currentHintLevel < 3 && (
                <button
                  onClick={handleRequestHint}
                  className="text-[11px] font-semibold text-amber-900 underline hover:text-amber-950 cursor-pointer"
                >
                  Daha Fazla İpucu ({currentHintLevel + 1}. Seviye) →
                </button>
              )}
            </div>

            <p className="text-amber-900 leading-relaxed font-medium bg-white/70 p-2 rounded border border-amber-100 font-mono text-[11px] sm:text-xs">
              {activeHintText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
