/**
 * Teacher Voice Narration Controls
 * Offers Play, Pause, Resume, Stop, and Transcript inspection
 */

import { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  FileText,
} from 'lucide-react';
import { speechService } from '../../modules/teacher/speechService.ts';
import type { SpeechStatus } from '../../modules/teacher/teacherTypes.ts';

interface TeacherControlsProps {
  currentText: string;
  onPlayOverride?: () => void;
}

export function TeacherControls({
  currentText,
  onPlayOverride,
}: TeacherControlsProps) {
  const [status, setStatus] = useState<SpeechStatus>(speechService.getStatus());
  const [showTranscript, setShowTranscript] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = speechService.subscribe((s) => setStatus(s));
    return unsubscribe;
  }, []);

  const handlePlay = () => {
    if (status.state === 'paused') {
      speechService.resume();
    } else {
      if (onPlayOverride) {
        onPlayOverride();
      } else {
        speechService.speak(currentText);
      }
    }
  };

  const handlePause = () => {
    speechService.pause();
  };

  const handleStop = () => {
    speechService.stop();
  };

  const isPlaying = status.state === 'playing';
  const isPaused = status.state === 'paused';

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs text-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-[#107c41] shrink-0" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-400 shrink-0" />
          )}
          <span className="font-medium text-slate-800">Sesli Öğretmen</span>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <span className="text-slate-500">
            {isPlaying
              ? 'Anlatılıyor...'
              : isPaused
              ? 'Duraklatıldı'
              : 'Dinlemeye hazır'}
          </span>
        </div>

        {/* Audio buttons */}
        <div className="flex items-center gap-1">
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium rounded transition-colors cursor-pointer"
              title="Öğretmeni Dinle"
            >
              <Play className="w-3 h-3 fill-current text-[#107c41]" />
              <span>{isPaused ? 'Devam Et' : 'Dinle'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium rounded transition-colors cursor-pointer"
              title="Duraklat"
            >
              <Pause className="w-3 h-3 text-amber-600" />
              <span>Duraklat</span>
            </button>
          )}

          <button
            onClick={handleStop}
            disabled={status.state === 'idle' || status.state === 'stopped'}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            title="Durdur"
          >
            <Square className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowTranscript((prev) => !prev)}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
              showTranscript
                ? 'bg-slate-200 text-slate-900 font-medium'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            title="Metni Göster / Gizle"
          >
            <FileText className="w-3 h-3" />
            <span>{showTranscript ? 'Metni Gizle' : 'Metni Göster'}</span>
          </button>
        </div>
      </div>

      {/* Transcript collapsible */}
      {showTranscript && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-200 text-slate-600 bg-white/60 p-2.5 rounded border border-slate-200/60 leading-relaxed font-sans">
          <span className="font-semibold text-slate-700 block mb-0.5">Öğretmen Metni:</span>
          {currentText}
        </div>
      )}
    </div>
  );
}
