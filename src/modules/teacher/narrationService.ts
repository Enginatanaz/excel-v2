/**
 * Narration coordinator for lesson steps and teacher voice
 * Features:
 * - Direct delegation to speechService with exact required API:
 *   generateNarration, playNarration, pauseNarration, resumeNarration, stopNarration, getNarrationStatus
 * - State machine contextual speech (step instruction, wrong attempt feedback, hint explanation, congratulation)
 * - Safe interruption: new narrations cleanly cancel prior ones
 */

import { speechService } from './speechService.ts';
import type { TaskStep, LessonEngineState, LessonStepStatus } from '../learning/lessonTypes.ts';
import type { SpeechStatus } from './teacherTypes.ts';

export const narrationService = {
  /**
   * Generates or caches narration for the given text
   */
  async generateNarration(text: string): Promise<boolean> {
    return speechService.generateNarration(text);
  },

  /**
   * Plays the given narration text, stopping any ongoing speech
   */
  playNarration(text: string, onEnd?: () => void) {
    speechService.playNarration(text, onEnd);
  },

  /**
   * Pauses current narration
   */
  pauseNarration() {
    speechService.pauseNarration();
  },

  /**
   * Resumes paused narration
   */
  resumeNarration() {
    speechService.resumeNarration();
  },

  /**
   * Stops current narration cleanly
   */
  stopNarration() {
    speechService.stopNarration();
  },

  /**
   * Returns current narration status
   */
  getNarrationStatus(): SpeechStatus {
    return speechService.getNarrationStatus();
  },

  /**
   * Subscribes to status changes
   */
  subscribe(listener: (status: SpeechStatus) => void): () => void {
    return speechService.subscribe(listener);
  },

  /**
   * Contextual speech generator for task steps and student status
   */
  narrateTask(
    task: TaskStep,
    status: LessonEngineState | LessonStepStatus,
    extraContext?: { hintText?: string; wrongAttemptMessage?: string }
  ) {
    let textToSpeak = task.narrationText;

    if (status === 'correct' || status === 'success') {
      textToSpeak = `Tebrikler! ${task.title} adımını başarıyla tamamladınız. Harika gidiyorsunuz.`;
    } else if (status === 'incorrect' || status === 'retry') {
      if (extraContext?.wrongAttemptMessage) {
        textToSpeak = `${extraContext.wrongAttemptMessage}. Lütfen tekrar deneyin veya ipucu butonunu kullanın.`;
      } else {
        textToSpeak = `Küçük bir hata oluştu. İpucu: ${task.hint || task.instruction}. Tekrar deneyebilirsiniz.`;
      }
    } else if (status === 'hint') {
      textToSpeak = extraContext?.hintText || `İpucu: ${task.hint || task.instruction}`;
    }

    speechService.playNarration(textToSpeak);
  },

  narrateCustom(text: string, onEnd?: () => void) {
    speechService.playNarration(text, onEnd);
  },

  pause() {
    speechService.pauseNarration();
  },

  resume() {
    speechService.resumeNarration();
  },

  stop() {
    speechService.stopNarration();
  },
};
