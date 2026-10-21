/**
 * Lesson session management hook
 * Implements the Stage 3 Step-by-Step Lesson State Machine:
 * - 14 discrete states:
 *   lesson_intro, explanation, worked_example, ready_for_task, teacher_instruction,
 *   waiting_for_student, validating, correct, incorrect, hint, next_step,
 *   independent_practice, assessment, completed
 * - 3-level graduated hint system (Level 1 -> 2 -> 3)
 * - Independent practice on dedicated workbook
 * - Comprehensive assessment report & scorecard
 * - Persistence & resume capability
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  Lesson,
  LessonEngineState,
  TaskValidationResult,
  AssessmentReport,
} from '../modules/learning/lessonTypes.ts';
import type { Worksheet, CellCoordinate } from '../modules/spreadsheet/types.ts';
import type { LessonTabType } from '../components/lesson/LessonTabs.tsx';
import { progressService } from '../modules/learning/progressService.ts';
import { narrationService } from '../modules/teacher/narrationService.ts';

export function useLessonSession(lesson: Lesson) {
  // Current tab
  const [activeTab, setActiveTab] = useState<LessonTabType>('anlatim');

  // State machine
  const [engineState, setEngineState] = useState<LessonEngineState>('lesson_intro');

  // Active guided task
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [validationResult, setValidationResult] = useState<TaskValidationResult | null>(null);

  // Hints & attempts tracking
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);
  const [currentHintLevel, setCurrentHintLevel] = useState<1 | 2 | 3>(1);
  const [wrongAttemptsCount, setWrongAttemptsCount] = useState<number>(0);

  // Independent practice state
  const [isIndependentStarted, setIsIndependentStarted] = useState<boolean>(false);
  const [isIndependentCompleted, setIsIndependentCompleted] = useState<boolean>(false);
  const [independentValidationResult, setIndependentValidationResult] = useState<TaskValidationResult | null>(null);

  // Explanation topic index
  const [currentTopicIndex, setCurrentTopicIndex] = useState<number>(0);

  const currentTask = lesson.tasks[currentTaskIndex];

  // Restore existing progress on mount
  useEffect(() => {
    const progress = progressService.getProgress();
    const lessonProg = progress.lessonProgress[lesson.id];
    if (lessonProg) {
      if (lessonProg.completed) {
        setCompletedTaskIds(lessonProg.completedTasks || lesson.tasks.map((t) => t.id));
        setIsIndependentCompleted(true);
        setEngineState('completed');
      } else {
        if (lessonProg.currentTaskIndex !== undefined) {
          setCurrentTaskIndex(Math.min(lessonProg.currentTaskIndex, lesson.tasks.length - 1));
        }
        if (lessonProg.completedTasks) {
          setCompletedTaskIds(lessonProg.completedTasks);
        }
      }
    }
  }, [lesson.id, lesson.tasks]);

  /**
   * Move from Lesson Intro / Explanation to Worked Example
   */
  const proceedToExample = useCallback(() => {
    narrationService.stopNarration();
    setActiveTab('ornek');
    setEngineState('worked_example');
    if (lesson.solvedExample?.audioNarration) {
      narrationService.playNarration(lesson.solvedExample.audioNarration);
    }
  }, [lesson.solvedExample]);

  /**
   * Move from Worked Example to Guided Practice Workbench
   */
  const proceedToGuidedPractice = useCallback(() => {
    narrationService.stopNarration();
    setActiveTab('uygulama');
    setEngineState('teacher_instruction');
    const firstTask = lesson.tasks[currentTaskIndex] || lesson.tasks[0];
    if (firstTask) {
      narrationService.narrateTask(firstTask, 'instruction');
    }
  }, [lesson.tasks, currentTaskIndex]);

  /**
   * Validate current task against actual worksheet and active cell
   */
  const validateCurrentTask = useCallback(
    (sheet: Worksheet, activeCell: CellCoordinate, isEditing?: boolean) => {
      if (!currentTask) return;

      setEngineState('validating');
      const result = currentTask.validate(sheet, activeCell, isEditing);
      setValidationResult(result);

      if (result.isValid) {
        setEngineState('correct');
        narrationService.narrateTask(currentTask, 'correct');

        const newCompleted = Array.from(new Set([...completedTaskIds, currentTask.id]));
        setCompletedTaskIds(newCompleted);

        progressService.saveLessonProgress(lesson.id, {
          completed: false,
          currentTaskIndex: Math.min(currentTaskIndex + 1, lesson.tasks.length - 1),
          completedTasks: newCompleted,
          score: Math.max(50, Math.round(100 - hintsUsedCount * 5 - wrongAttemptsCount * 3)),
        });
      } else {
        setEngineState('incorrect');
        setWrongAttemptsCount((prev) => prev + 1);
        narrationService.narrateTask(currentTask, 'incorrect', {
          wrongAttemptMessage: result.message,
        });
      }
    },
    [currentTask, completedTaskIds, lesson.id, lesson.tasks.length, currentTaskIndex, hintsUsedCount, wrongAttemptsCount]
  );

  /**
   * Request next level of hint
   */
  const requestHint = useCallback(() => {
    if (!currentTask) return;
    setHintsUsedCount((prev) => prev + 1);
    setEngineState('hint');

    let hintText = currentTask.hint;
    if (currentTask.hints) {
      if (currentHintLevel === 1) {
        hintText = currentTask.hints.level1;
        setCurrentHintLevel(2);
      } else if (currentHintLevel === 2) {
        hintText = currentTask.hints.level2;
        setCurrentHintLevel(3);
      } else {
        hintText = currentTask.hints.level3;
      }
    }

    narrationService.narrateTask(currentTask, 'hint', { hintText });
  }, [currentTask, currentHintLevel]);

  /**
   * Advance to next guided task or independent practice
   */
  const nextTask = useCallback(() => {
    narrationService.stopNarration();
    if (currentTaskIndex < lesson.tasks.length - 1) {
      const nextIdx = currentTaskIndex + 1;
      setCurrentTaskIndex(nextIdx);
      setCurrentHintLevel(1);
      setEngineState('teacher_instruction');
      setValidationResult(null);

      progressService.saveLessonProgress(lesson.id, {
        currentTaskIndex: nextIdx,
      });

      const nextTaskStep = lesson.tasks[nextIdx];
      if (nextTaskStep) {
        narrationService.narrateTask(nextTaskStep, 'instruction');
      }
    } else {
      // Guided practice finished -> Transition to Independent Practice
      setEngineState('independent_practice');
      setActiveTab('bagimsiz');
      setIsIndependentStarted(true);
      if (lesson.independentPractice?.narrationText) {
        narrationService.playNarration(lesson.independentPractice.narrationText);
      }
    }
  }, [currentTaskIndex, lesson.tasks, lesson.id, lesson.independentPractice]);

  /**
   * Validate Independent Practice
   */
  const validateIndependentPractice = useCallback(
    (sheet: Worksheet) => {
      const spec = lesson.independentPractice;
      if (!spec) return;

      if (spec.customValidator) {
        const customRes = spec.customValidator(sheet);
        setIndependentValidationResult(customRes);

        if (customRes.isValid) {
          setIsIndependentCompleted(true);
          setEngineState('assessment');
          narrationService.playNarration(
            'Tebrikler! Bağımsız alıştırmayı başarıyla tamamladınız. Şimdi ders sonu değerlendirme raporunuzu inceleyebilirsiniz.'
          );
          progressService.saveLessonProgress(lesson.id, {
            completed: true,
            currentTaskIndex: lesson.tasks.length,
            completedTasks: lesson.tasks.map((t) => t.id),
            score: Math.max(70, Math.round(100 - hintsUsedCount * 4 - wrongAttemptsCount * 2)),
          });
          setTimeout(() => {
            setActiveTab('ozet');
            setEngineState('completed');
          }, 1800);
        } else {
          narrationService.playNarration(customRes.message);
        }
        return;
      }

      const targetCell = sheet.cells[spec.targetCell];
      if (!targetCell || !targetCell.raw || targetCell.raw.trim() === '') {
        setIndependentValidationResult({
          isValid: false,
          message: `${spec.targetCell} hücresine henüz formül girilmedi.`,
          hint: spec.hint,
        });
        narrationService.playNarration(`Giderleri toplamak için ${spec.targetCell} hücresine TOPLA formülünü yazıp Enter'a basın.`);
        return;
      }

      const expectedResNum = typeof spec.expectedResult === 'number' ? spec.expectedResult : 0;
      const computedNum = Number(targetCell.computed);
      if (Math.abs(computedNum - expectedResNum) < 0.001) {
        setIndependentValidationResult({
          isValid: true,
          message: `Mükemmel! Aylık gider toplamı tam olarak ${spec.expectedResult} ₺ olarak hesaplandı.`,
        });
        setIsIndependentCompleted(true);
        setEngineState('assessment');
        narrationService.playNarration(
          'Tebrikler! Bağımsız alıştırmayı başarıyla tamamladınız. Şimdi ders sonu değerlendirme raporunuzu inceleyebilirsiniz.'
        );

        // Mark entire lesson completed
        progressService.saveLessonProgress(lesson.id, {
          completed: true,
          currentTaskIndex: lesson.tasks.length,
          completedTasks: lesson.tasks.map((t) => t.id),
          score: Math.max(70, Math.round(100 - hintsUsedCount * 4 - wrongAttemptsCount * 2)),
        });

        setTimeout(() => {
          setActiveTab('ozet');
          setEngineState('completed');
        }, 1800);
      } else {
        setIndependentValidationResult({
          isValid: false,
          message: `Hesaplanan sonuç (${targetCell.computed}) beklenen değer (${spec.expectedResult}) ile eşleşmiyor.`,
          hint: spec.hint,
        });
        narrationService.playNarration('Hesaplanan sonuç beklenen toplam ile uyuşmuyor. Lütfen formül aralığını kontrol edin.');
      }
    },
    [lesson.independentPractice, lesson.id, lesson.tasks, hintsUsedCount, wrongAttemptsCount]
  );

  /**
   * Assessment report calculation
   */
  const assessmentReport = useMemo<AssessmentReport>(() => {
    const totalT = lesson.tasks.length;
    const completedT = completedTaskIds.length;
    const baseScore = Math.round((completedT / totalT) * 60) + (isIndependentCompleted ? 40 : 0);
    const penalties = hintsUsedCount * 3 + wrongAttemptsCount * 2;
    const finalScore = Math.max(65, Math.min(100, baseScore - penalties));

    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      completedAt: new Date().toLocaleDateString('tr-TR'),
      tasksCompleted: completedT,
      totalTasks: totalT,
      independentPracticeCompleted: isIndependentCompleted,
      totalWrongAttempts: wrongAttemptsCount,
      totalHintsUsed: hintsUsedCount,
      score: finalScore,
      masteredSkills: [
        'TOPLA / SUM formülünün temel sözdizimi',
        'Ardışık hücre aralığı gösterimi (B2:B6)',
        'Formül çubuğu ve hücre içi düzenleme',
        'Otomatik yeniden hesaplama mantığı',
        'Bağımsız tablo üzerinde formül üretimi',
      ],
      topicsToReview:
        wrongAttemptsCount > 2
          ? ['Formül başında eşittir (=) kullanımını hatırlayın', 'Aralık için noktalı virgül değil, iki nokta (:) kullanın']
          : ['Tebrikler, tüm konularda tam yetkinlik gösterdiniz!'],
      nextRecommendedLesson: {
        id: 'average_function',
        title: 'ORTALAMA (AVERAGE) Fonksiyonu',
      },
    };
  }, [lesson, completedTaskIds.length, isIndependentCompleted, hintsUsedCount, wrongAttemptsCount]);

  /**
   * Jump to specific task index
   */
  const jumpToTask = useCallback(
    (index: number) => {
      if (index >= 0 && index < lesson.tasks.length) {
        narrationService.stopNarration();
        setCurrentTaskIndex(index);
        setCurrentHintLevel(1);
        setEngineState('teacher_instruction');
        setValidationResult(null);
      }
    },
    [lesson.tasks.length]
  );

  return {
    activeTab,
    setActiveTab,
    engineState,
    setEngineState,
    currentTaskIndex,
    currentTask,
    completedTaskIds,
    validationResult,
    currentTopicIndex,
    setCurrentTopicIndex,
    currentHintLevel,
    hintsUsedCount,
    wrongAttemptsCount,
    isIndependentStarted,
    isIndependentCompleted,
    independentValidationResult,
    assessmentReport,
    isCompleted: engineState === 'completed' || isIndependentCompleted,
    // Actions
    proceedToExample,
    proceedToGuidedPractice,
    validateCurrentTask,
    requestHint,
    nextTask,
    validateIndependentPractice,
    jumpToTask,
  };
}
