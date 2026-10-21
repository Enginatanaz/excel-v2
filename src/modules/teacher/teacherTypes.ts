/**
 * Teacher and narration types for Excel Akademi AI
 */

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'stopped';

export interface NarrationSegment {
  id: string;
  title: string;
  text: string;
  stepStatus?: string;
}

export interface SpeechStatus {
  isSupported: boolean;
  state: PlaybackState;
  status?: PlaybackState;
  hasTurkishVoice: boolean;
  selectedVoiceName: string | null;
  currentText?: string;
  errorMessage?: string;
}
