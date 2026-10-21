/**
 * Step progress tracker for lesson tasks
 */

import { Check } from 'lucide-react';
import type { TaskStep } from '../../modules/learning/lessonTypes.ts';

interface LessonProgressProps {
  tasks: TaskStep[];
  currentTaskIndex: number;
  completedTaskIds: string[];
  onSelectTask: (index: number) => void;
}

export function LessonProgress({
  tasks,
  currentTaskIndex,
  completedTaskIds,
  onSelectTask,
}: LessonProgressProps) {
  return (
    <div className="flex items-center gap-2 select-none overflow-x-auto py-1">
      {tasks.map((task, idx) => {
        const isCompleted = completedTaskIds.includes(task.id);
        const isActive = currentTaskIndex === idx;

        return (
          <button
            key={task.id}
            onClick={() => onSelectTask(idx)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer whitespace-nowrap ${
              isActive
                ? 'bg-[#107c41] text-white font-medium shadow-xs'
                : isCompleted
                ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-medium'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-semibold ${
                isActive
                  ? 'bg-white text-[#107c41]'
                  : isCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-300 text-slate-700'
              }`}
            >
              {isCompleted ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : idx + 1}
            </span>
            <span>Adım {idx + 1}</span>
          </button>
        );
      })}
    </div>
  );
}
