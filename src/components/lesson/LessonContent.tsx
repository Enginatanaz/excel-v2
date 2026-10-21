/**
 * Rich Lesson Content display for:
 * 1. Detailed Explanation Topics (with individual & continuous narration buttons)
 * 2. Stage 4 Universal Modules: Glossary, Real-world Scenarios, UI Locations & Shortcuts, Common Mistakes
 * 3. Worked Example (with audio walkthrough and steps)
 * 4. Assessment & Learning Report (scorecard, hints used, review topics, next lesson)
 */

import { useState } from 'react';
import {
  Check,
  Code2,
  AlertTriangle,
  Lightbulb,
  Play,
  Pause,
  Award,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { Lesson, AssessmentReport } from '../../modules/learning/lessonTypes.ts';
import { narrationService } from '../../modules/teacher/narrationService.ts';

interface LessonContentProps {
  lesson: Lesson;
  activeTab: 'anlatim' | 'ornek' | 'ozet';
  onProceedToExample?: () => void;
  onProceedToPractice?: () => void;
  assessmentReport?: AssessmentReport;
}

export function LessonContent({
  lesson,
  activeTab,
  onProceedToExample,
  onProceedToPractice,
  assessmentReport,
}: LessonContentProps) {
  const [playingTopicId, setPlayingTopicId] = useState<string | null>(null);

  const handlePlayTopic = (topicId: string, narrationText: string) => {
    if (playingTopicId === topicId) {
      narrationService.pauseNarration();
      setPlayingTopicId(null);
    } else {
      setPlayingTopicId(topicId);
      narrationService.playNarration(narrationText, () => {
        setPlayingTopicId(null);
      });
    }
  };

  // Tab 1: Konu Anlatımı
  if (activeTab === 'anlatim') {
    return (
      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* Lesson Intro Banner */}
        <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-lg p-3.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm sm:text-base font-bold text-emerald-950 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              {lesson.title} — Kapsamlı Konu Rehberi
            </h3>
            <button
              onClick={() => handlePlayTopic('intro', lesson.introNarration)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-medium rounded-md text-xs transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              {playingTopicId === 'intro' ? (
                <>
                  <Pause className="w-3 h-3 text-amber-600" />
                  <span>Duraklat</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-emerald-700 fill-current" />
                  <span>Girişi Dinle</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            {lesson.introNarration}
          </p>

          {/* Learning outcomes pills */}
          {lesson.learningOutcomes && lesson.learningOutcomes.length > 0 && (
            <div className="pt-2 border-t border-emerald-200/60 mt-2">
              <span className="text-[11px] font-bold text-emerald-950 block mb-1.5 uppercase tracking-wide">
                Bu Derste Kazanacağınız Beceriler:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {lesson.learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-emerald-900">
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Detailed Topics */}
        {lesson.topics && lesson.topics.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase flex items-center justify-between border-b border-slate-200 pb-2">
              <span>Temel Konu Başlıkları</span>
              <span className="text-slate-400 font-normal lowercase">{lesson.topics.length} Başlık</span>
            </h4>

            <div className="space-y-3">
              {lesson.topics.map((topic) => {
                const isPlaying = playingTopicId === topic.id;
                return (
                  <div
                    key={topic.id}
                    className="p-3 bg-white border border-slate-200/90 rounded-lg hover:border-slate-300 transition-all space-y-2 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                          {topic.number}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {topic.title}
                        </h5>
                      </div>

                      <button
                        onClick={() => handlePlayTopic(topic.id, topic.audioNarration)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer shrink-0 ${
                          isPlaying
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-3 h-3 text-amber-600" />
                            <span>Duraklat</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 text-emerald-700 fill-current" />
                            <span>Dinle</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed pl-7">
                      {topic.content}
                    </p>

                    <div className="ml-7 bg-slate-50 border-l-2 border-[#107c41] px-2 py-1 text-[11px] text-slate-700 font-medium rounded-r">
                      <span className="text-emerald-800 font-semibold">Özet Kural: </span>
                      {topic.keyTakeaway}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Universal Section: Glossary (Terimler ve Tanımlar) */}
        {lesson.glossary && lesson.glossary.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Ders Sözlüğü & Temel Terimler</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lesson.glossary.map((item) => (
                <div key={item.id} className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{item.term}</span>
                    {item.englishEquivalent && (
                      <span className="text-[10px] text-slate-400 font-mono">({item.englishEquivalent})</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.definition}</p>
                  {item.example && (
                    <div className="text-[10px] text-emerald-800 font-mono bg-emerald-50 px-1.5 py-0.5 rounded inline-block">
                      Örnek: {item.example}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Universal Section: UI Locations & Shortcuts (Arayüz & Kısayollar) */}
        {lesson.uiLocations && lesson.uiLocations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <span>Arayüz Menü Konumları & Kısayollar</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lesson.uiLocations.map((loc, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-xs">{loc.elementName}</span>
                    {loc.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-300 rounded shadow-2xs text-slate-700 font-bold">
                        {loc.shortcut}
                      </kbd>
                    )}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-medium">
                    {loc.ribbonTab} &gt; {loc.group}
                  </div>
                  <p className="text-[11px] text-slate-500">{loc.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Universal Section: Real World Scenarios */}
        {lesson.realWorldScenarios && lesson.realWorldScenarios.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <Briefcase className="w-3.5 h-3.5 text-emerald-700" />
              <span>Gerçek İş Hayatı Senaryosu</span>
            </h4>

            <div className="space-y-2.5">
              {lesson.realWorldScenarios.map((sc) => (
                <div key={sc.id} className="p-3 bg-emerald-50/40 border border-emerald-200/80 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{sc.industry}</span>
                    <span className="text-[11px] text-emerald-800 font-semibold">{sc.role}</span>
                  </div>
                  <div className="text-xs text-slate-700 space-y-1">
                    <p><strong className="text-slate-900">İş Problemi:</strong> {sc.challenge}</p>
                    <p><strong className="text-emerald-900">Excel Çözümü:</strong> {sc.solution}</p>
                    <p className="text-[11px] text-slate-500 font-medium">✨ <strong>İş Kazanımı:</strong> {sc.appliedBenefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Syntax block or procedure steps */}
        {lesson.explanationContent.syntax && (
          <div className="p-3.5 bg-slate-900 text-white rounded-lg space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
              <Code2 className="w-4 h-4" />
              <span>Formül Sözdizimi (Syntax Kuralı)</span>
            </div>
            <div className="font-mono text-emerald-300 bg-slate-950 p-2.5 rounded border border-slate-800 text-xs sm:text-sm overflow-x-auto">
              {lesson.explanationContent.syntax}
            </div>
            <p className="text-xs text-slate-400">
              {lesson.explanationContent.overview}
            </p>
          </div>
        )}

        {/* Detailed Common Mistakes (Stage 4) */}
        {lesson.commonMistakes && lesson.commonMistakes.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Sık Yapılan Hatalar ve Çözüm Yöntemleri</span>
            </h4>

            <div className="space-y-2.5">
              {lesson.commonMistakes.map((m) => (
                <div key={m.id} className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg space-y-1.5 text-xs">
                  <div className="font-bold text-amber-950 text-xs">{m.title}</div>
                  <div className="text-slate-700"><strong className="text-amber-900">Hata:</strong> {m.mistake}</div>
                  <div className="text-slate-700"><strong className="text-slate-900">Sebep:</strong> {m.cause}</div>
                  <div className="text-emerald-900"><strong className="text-emerald-800">Çözüm:</strong> {m.solution}</div>
                  {(m.badExample || m.goodExample) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                      {m.badExample && (
                        <div className="p-1.5 bg-rose-50 border border-rose-200 text-rose-900 rounded">
                          ✗ {m.badExample}
                        </div>
                      )}
                      {m.goodExample && (
                        <div className="p-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded">
                          ✓ {m.goodExample}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Fallback simple mistakes */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-lg space-y-1.5 text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-700" />
                En İyi Uygulamalar
              </span>
              <ul className="space-y-1 text-slate-600 pl-1">
                {lesson.explanationContent.bestPractices.map((tip, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg space-y-1.5 text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                Sık Yapılan Hatalar
              </span>
              <ul className="space-y-1 text-slate-600 pl-1">
                {lesson.explanationContent.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-700 font-bold">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action button to proceed to example */}
        {onProceedToExample && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={onProceedToExample}
              className="flex items-center gap-2 px-4 py-2 bg-[#107c41] hover:bg-[#0b5a2f] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <span>Çözümlü Örneğe Geç</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Tab 2: Çözümlü Örnek
  if (activeTab === 'ornek') {
    const { solvedExample } = lesson;
    const isPlayingExample = playingTopicId === 'example';

    return (
      <div className="space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">{solvedExample.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{solvedExample.scenario}</p>
          </div>

          <button
            onClick={() => handlePlayTopic('example', solvedExample.audioNarration || solvedExample.explanation)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-semibold rounded-md text-xs transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
          >
            {isPlayingExample ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>Öğretmeni Duraklat</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-700 fill-current" />
                <span>Örneği Sesli Dinle</span>
              </>
            )}
          </button>
        </div>

        {/* Data table */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
          <span className="text-xs font-semibold text-slate-800 block">Örnek Tablo Görünümü:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {solvedExample.dataSnippet.map((item, i) => (
              <div key={i} className="flex justify-between p-2 bg-white rounded border border-slate-200 text-xs">
                <span className="text-slate-600">{item.label}</span>
                <span className="font-mono font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Adım Adım Çözüm Aşamaları
          </h4>
          <div className="space-y-2">
            {solvedExample.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 bg-white border border-slate-200 rounded-md">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-xs text-slate-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation callout */}
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1">
          <span className="text-xs font-bold text-emerald-950 block">Öğretmenin Analizi:</span>
          <p className="text-xs text-emerald-900">{solvedExample.explanation}</p>
        </div>

        {/* Action button to proceed to practice */}
        {onProceedToPractice && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={onProceedToPractice}
              className="flex items-center gap-2 px-4 py-2 bg-[#107c41] hover:bg-[#0b5a2f] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <span>Rehberli Uygulamaya Başla</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Tab 3: Rapor & Karne
  if (activeTab === 'ozet') {
    return (
      <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        {/* Assessment Scorecard */}
        {assessmentReport ? (
          <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Ders Başarı Raporu ve Karne
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tamamlanma Tarihi: {new Date(assessmentReport.completedAt).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>

              {/* Score circle */}
              <div className="flex flex-col items-end">
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  %{assessmentReport.score}
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Başarı Puanı</span>
              </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                <div className="text-base font-bold text-slate-800">
                  {assessmentReport.tasksCompleted} / {assessmentReport.totalTasks}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Rehberli Görevler</div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                <div className="text-base font-bold text-emerald-700">
                  {assessmentReport.independentPracticeCompleted ? 'Tamamlandı' : 'Bekliyor'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Bağımsız Tablo</div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                <div className="text-base font-bold text-amber-700">
                  {assessmentReport.totalHintsUsed}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Kullanılan İpucu</div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md">
                <div className="text-base font-bold text-slate-700">
                  {assessmentReport.totalWrongAttempts}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Hatalı Deneme</div>
              </div>
            </div>

            {/* Mastered skills */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                Kazanılan Beceriler:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {assessmentReport.masteredSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Next recommended lesson */}
            {assessmentReport.nextRecommendedLesson && (
              <div className="p-3 bg-slate-900 text-white rounded-lg flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    Sıradaki Tavsiye Ders:
                  </span>
                  <div className="font-semibold text-xs sm:text-sm mt-0.5">
                    {assessmentReport.nextRecommendedLesson.title}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-xs text-center">
            Ders henüz tamamlanmadı. Rehberli görevleri ve bağımsız alıştırmayı bitirdiğinizde karneniz burada görüntülenecektir.
          </div>
        )}

        {/* Lesson Key Takeaways Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Ders Özeti ve Akılda Kalması Gerekenler
          </h4>
          <ul className="space-y-2">
            {lesson.summary.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2 p-2.5 bg-white border border-slate-200 rounded-md text-xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#107c41] shrink-0 mt-1.5" />
                <span className="text-slate-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return null;
}
