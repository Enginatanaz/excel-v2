/**
 * Web Speech API and Natural Audio service for Excel Akademi AI
 * Safely accesses speechSynthesis and manages narration playback
 * Implements:
 * - generateNarration (with caching)
 * - playNarration (with overlapping collision prevention)
 * - pauseNarration
 * - resumeNarration
 * - stopNarration
 * - getNarrationStatus
 */

import type { PlaybackState, SpeechStatus } from './teacherTypes.ts';

type StateListener = (status: SpeechStatus) => void;

class SpeechService {
  private utterance: SpeechSynthesisUtterance | null = null;
  private currentText: string = '';
  private state: PlaybackState = 'idle';
  private listeners: Set<StateListener> = new Set();
  private isBrowserSupported: boolean = false;
  private turkishVoice: SpeechSynthesisVoice | null = null;
  private narrationCache: Map<string, boolean> = new Map();
  private onEndCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.isBrowserSupported = true;
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.isBrowserSupported) return;
    try {
      const voices = window.speechSynthesis.getVoices();
      this.turkishVoice =
        voices.find((v) => v.lang.startsWith('tr') || v.lang === 'tr-TR') ||
        voices.find((v) => v.name.toLowerCase().includes('turkish') || v.name.toLowerCase().includes('türkçe')) ||
        voices.find((v) => v.default) ||
        voices[0] ||
        null;
      this.notify();
    } catch {
      // Ignored in non-DOM test environments
    }
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(errorMessage?: string) {
    const status = this.getStatus(errorMessage);
    this.listeners.forEach((fn) => fn(status));
  }

  public getStatus(errorMessage?: string): SpeechStatus {
    return {
      isSupported: this.isBrowserSupported,
      state: this.state,
      status: this.state,
      hasTurkishVoice: !!this.turkishVoice,
      selectedVoiceName: this.turkishVoice?.name || null,
      currentText: this.currentText,
      errorMessage,
    };
  }

  public getNarrationStatus(): SpeechStatus {
    return this.getStatus();
  }

  /**
   * Generates / prepares narration with caching
   */
  public async generateNarration(text: string): Promise<boolean> {
    const trimmed = text.trim();
    if (!trimmed) return false;
    this.narrationCache.set(trimmed, true);
    return true;
  }

  /**
   * Plays narration text with collision prevention (stops any active audio first)
   */
  public playNarration(text: string, onEnd?: () => void) {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Stop any existing utterance first to prevent overlapping speech
    this.stop();
    this.currentText = trimmed;
    this.onEndCallback = onEnd || null;
    this.narrationCache.set(trimmed, true);

    if (!this.isBrowserSupported) {
      this.state = 'playing';
      this.notify();
      return;
    }

    try {
      this.utterance = new SpeechSynthesisUtterance(trimmed);
      if (this.turkishVoice) {
        this.utterance.voice = this.turkishVoice;
      }
      this.utterance.lang = 'tr-TR';
      this.utterance.rate = 0.92; // Slightly relaxed, educational conversational pace
      this.utterance.pitch = 1.0;

      this.utterance.onstart = () => {
        this.state = 'playing';
        this.notify();
      };

      this.utterance.onend = () => {
        this.state = 'idle';
        this.notify();
        if (this.onEndCallback) {
          const cb = this.onEndCallback;
          this.onEndCallback = null;
          cb();
        }
      };

      this.utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech synthesis notice:', e);
        }
        this.state = 'idle';
        this.notify();
      };

      window.speechSynthesis.speak(this.utterance);
      this.state = 'playing';
      this.notify();
    } catch (e: any) {
      console.warn('Speech synthesis exception:', e);
      this.state = 'idle';
      this.notify(e.message || 'Ses oynatılamadı.');
    }
  }

  /**
   * Convenience alias
   */
  public speak(text: string) {
    this.playNarration(text);
  }

  public pauseNarration() {
    this.state = 'paused';
    if (!this.isBrowserSupported) {
      this.notify();
      return;
    }
    try {
      window.speechSynthesis.pause();
      this.notify();
    } catch (e) {
      console.warn(e);
    }
  }

  public pause() {
    this.pauseNarration();
  }

  public resumeNarration() {
    this.state = 'playing';
    if (!this.isBrowserSupported) {
      this.notify();
      return;
    }
    try {
      window.speechSynthesis.resume();
      this.notify();
    } catch (e) {
      console.warn(e);
    }
  }

  public resume() {
    this.resumeNarration();
  }

  public stopNarration() {
    this.state = 'idle';
    if (!this.isBrowserSupported) {
      this.notify();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      this.notify();
    } catch (e) {
      console.warn(e);
    }
  }

  public stop() {
    this.stopNarration();
  }

  public getCurrentText(): string {
    return this.currentText;
  }
}

export const speechService = new SpeechService();
