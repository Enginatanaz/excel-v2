/**
 * Interactive Quiz & Assessment Component for Universal Lessons
 * Evaluates student understanding with immediate feedback and pedagogical explanations
 */

import { useState } from 'react';
import type { QuizQuestion } from '../../modules/learning/lessonTypes.ts';
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, Award } from 'lucide-react';

interface LessonQuizProps {
  questions: QuizQuestion[];
  lessonTitle: string;
  onQuizCompleted?: (score: number, total: number) => void;
}

export function LessonQuiz({
  questions,
  lessonTitle,
  onQuizCompleted,
}: LessonQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleCheckAnswers = () => {
    setIsSubmitted(true);
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    if (onQuizCompleted) {
      onQuizCompleted(correctCount, questions.length);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = answeredCount === questions.length;

  let correctScore = 0;
  if (isSubmitted) {
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctScore++;
      }
    });
  }

  const scorePercentage = Math.round((correctScore / questions.length) * 100);

  return (
    <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
      {/* Quiz Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-md">
              <HelpCircle className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {lessonTitle} — Değerlendirme Testi
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Öğrendiğiniz kavramları pekiştirmek için aşağıdaki {questions.length} soruyu yanıtlayın.
          </p>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg shrink-0">
            <Award className={`w-6 h-6 ${scorePercentage >= 70 ? 'text-emerald-600' : 'text-amber-500'}`} />
            <div>
              <div className="text-xs font-semibold text-slate-900">
                Puan: {correctScore} / {questions.length} (%{scorePercentage})
              </div>
              <div className="text-[11px] text-slate-500">
                {scorePercentage >= 70 ? 'Tebrikler, başarılı!' : 'Konuları tekrar gözden geçirin.'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, qIndex) => {
          const selectedOption = selectedAnswers[qIndex];
          const isAnswered = selectedOption !== undefined;
          const isCorrect = isSubmitted && selectedOption === q.correctIndex;
          const isWrong = isSubmitted && selectedOption !== undefined && selectedOption !== q.correctIndex;

          return (
            <div
              key={q.id || qIndex}
              className={`p-4 bg-white border rounded-lg transition-all space-y-3 ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">
                    {q.question}
                  </h4>
                </div>

                {isSubmitted && (
                  <span className="shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Doğru
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-700 text-xs font-bold">
                        <XCircle className="w-4 h-4" /> Yanlış
                      </span>
                    )}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2 pl-7">
                {q.options.map((option, optIndex) => {
                  const isSelected = selectedOption === optIndex;
                  const isThisCorrect = isSubmitted && optIndex === q.correctIndex;
                  const isThisWrongSelected = isSubmitted && isSelected && !isThisCorrect;

                  let optionStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';

                  if (isSubmitted) {
                    if (isThisCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-100/70 text-emerald-950 font-semibold';
                    } else if (isThisWrongSelected) {
                      optionStyle = 'border-rose-400 bg-rose-100/70 text-rose-950 line-through';
                    } else {
                      optionStyle = 'border-slate-200 opacity-60 text-slate-500';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-xs';
                  }

                  const optionLabels = ['A', 'B', 'C', 'D', 'E'];

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(qIndex, optIndex)}
                      className={`w-full text-left p-2.5 border rounded-md flex items-center gap-2.5 transition-colors cursor-pointer text-xs sm:text-sm ${optionStyle}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-600 border-slate-300'
                        }`}
                      >
                        {optionLabels[optIndex] || optIndex + 1}
                      </span>
                      <span className="flex-1">{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown upon submission) */}
              {isSubmitted && (
                <div className="ml-7 p-3 bg-slate-50 border-l-3 border-emerald-600 rounded-r text-xs text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-900">Açıklama:</div>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-500">
          {answeredCount} / {questions.length} soru yanıtlandı
        </span>

        <div className="flex items-center gap-2">
          {isSubmitted ? (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded-lg text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Testi Yeniden Çöz</span>
            </button>
          ) : (
            <button
              onClick={handleCheckAnswers}
              disabled={!isAllAnswered}
              className={`flex items-center gap-1.5 px-5 py-2 font-semibold rounded-lg text-xs transition-all cursor-pointer ${
                isAllAnswered
                  ? 'bg-[#107c41] hover:bg-[#0b5c30] text-white shadow-xs'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Cevapları Kontrol Et</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
