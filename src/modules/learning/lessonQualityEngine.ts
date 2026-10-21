/**
 * Lesson Quality Control & Pedagogical Verification Engine
 * Stage 4: Automated verification of curriculum lessons against 10 strict standards
 */

import type { Lesson, LessonType } from './lessonTypes.ts';

export interface LessonQualityCheckResult {
  checkId: string;
  name: string;
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface LessonQualityReport {
  lessonId: string;
  lessonTitle: string;
  lessonType: LessonType | string;
  isValid: boolean;
  score: number; // 0 to 100
  passedChecks: string[];
  warnings: string[];
  errors: string[];
  details: LessonQualityCheckResult[];
}

const VALID_LESSON_TYPES: LessonType[] = [
  'concept',
  'interface_action',
  'formula_function',
  'data_management',
  'visualization',
  'advanced_analysis',
  'automation',
  'project',
];

/**
 * Validates any lesson object against Stage 4 universal curriculum quality standards
 */
export function validateLessonQuality(lesson: Lesson): LessonQualityReport {
  const details: LessonQualityCheckResult[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  const passedChecks: string[] = [];

  // Helper to record result
  const recordCheck = (
    checkId: string,
    name: string,
    passed: boolean,
    failureMessage: string,
    severity: 'error' | 'warning' = 'error'
  ) => {
    if (passed) {
      passedChecks.push(name);
      details.push({
        checkId,
        name,
        passed: true,
        message: `${name} kriteri başarıyla doğrulandı.`,
        severity: 'info',
      });
    } else {
      if (severity === 'error') {
        errors.push(failureMessage);
      } else {
        warnings.push(failureMessage);
      }
      details.push({
        checkId,
        name,
        passed: false,
        message: failureMessage,
        severity,
      });
    }
  };

  // 1. Identity & Structure
  const hasValidId = typeof lesson.id === 'string' && lesson.id.trim().length >= 3;
  recordCheck(
    'chk_identity_id',
    'Ders Kimliği (ID)',
    hasValidId,
    `Geçersiz veya eksik ders kimliği: '${lesson.id}'`
  );

  const hasValidTitle = typeof lesson.title === 'string' && lesson.title.trim().length >= 5;
  recordCheck(
    'chk_identity_title',
    'Ders Başlığı',
    hasValidTitle,
    `Ders başlığı en az 5 karakter olmalıdır. Mevcut: '${lesson.title}'`
  );

  // 2. Universal Lesson Type
  const isValidType = VALID_LESSON_TYPES.includes(lesson.lessonType);
  recordCheck(
    'chk_lesson_type',
    'Evrensel Ders Türü Uyumluluğu',
    isValidType,
    `Ders türü '${lesson.lessonType}' 8 desteklenen kategori arasında değil: ${VALID_LESSON_TYPES.join(', ')}`
  );

  // 3. Learning Objectives & Outcomes
  const hasObjective = typeof lesson.learningObjective === 'string' && lesson.learningObjective.trim().length >= 15;
  recordCheck(
    'chk_learning_objective',
    'Öğrenme Amacı Tanımı',
    hasObjective,
    'Dersin öğrenme amacı (learningObjective) en az 15 karakter ve açıklayıcı olmalıdır.'
  );

  const hasOutcomes = Array.isArray(lesson.learningOutcomes) && lesson.learningOutcomes.length >= 2;
  recordCheck(
    'chk_learning_outcomes',
    'Öğrenme Kazanımları (En az 2 madde)',
    hasOutcomes,
    'Ders en az 2 belirgin öğrenme kazanımı (learningOutcomes) içermelidir.',
    'warning'
  );

  // 4. Topic Completeness & Audio Narrations
  const hasMinTopics = Array.isArray(lesson.topics) && lesson.topics.length >= 3;
  recordCheck(
    'chk_topics_count',
    'Kapsamlı Konu Başlıkları (En az 3 konu)',
    hasMinTopics,
    `Ders anlatımında en az 3 detaylı konu başlığı bulunmalıdır. Mevcut: ${lesson.topics?.length || 0}`
  );

  const topicsValid = (lesson.topics || []).every(
    (t) =>
      t.title &&
      t.title.trim().length > 3 &&
      t.content &&
      t.content.trim().length >= 30 &&
      t.keyTakeaway &&
      t.audioNarration
  );
  recordCheck(
    'chk_topics_content',
    'Konu Anlatımı ve Ses Metinleri Bütünlüğü',
    topicsValid,
    'Her konu başlığı başlık, en az 30 karakter içerik, ana fikir (keyTakeaway) ve sesli anlatım metni içermelidir.'
  );

  // 5. Solved Example
  const hasSolvedExample =
    lesson.solvedExample &&
    typeof lesson.solvedExample.title === 'string' &&
    typeof lesson.solvedExample.scenario === 'string' &&
    Array.isArray(lesson.solvedExample.steps) &&
    lesson.solvedExample.steps.length >= 2;
  recordCheck(
    'chk_solved_example',
    'Çözümlü Örnek ve Adımları',
    !!hasSolvedExample,
    'Ders, adım adım açıklanmış en az 2 adımlı bir çözümlü örnek (solvedExample) içermelidir.'
  );

  // 6. Real-World Business Scenarios
  const hasBusinessScenarios =
    Array.isArray(lesson.realWorldScenarios) &&
    lesson.realWorldScenarios.length >= 1 &&
    lesson.realWorldScenarios.every(
      (s) => s.industry && s.role && s.challenge && s.solution && s.appliedBenefit
    );
  recordCheck(
    'chk_business_scenarios',
    'Gerçek İş Hayatı Senaryosu',
    hasBusinessScenarios,
    'Ders en az 1 gerçek iş senaryosu (sektör, rol, iş problemi ve sağlanan fayda) içermelidir.',
    'warning'
  );

  // 7. Common Mistakes & Solutions
  const hasCommonMistakes =
    Array.isArray(lesson.commonMistakes) &&
    lesson.commonMistakes.length >= 2 &&
    lesson.commonMistakes.every((m) => m.mistake && m.cause && m.solution);
  recordCheck(
    'chk_common_mistakes',
    'Sık Yapılan Hatalar ve Çözümleri (En az 2 hata)',
    hasCommonMistakes,
    'Ders en az 2 sık yapılan hata ve çözüm yöntemi içermelidir.',
    'warning'
  );

  // 8. Guided Tasks & 3-Level Hints
  const hasTasks = Array.isArray(lesson.tasks) && lesson.tasks.length >= 2;
  recordCheck(
    'chk_tasks_count',
    'Rehberli Uygulama Görevleri (En az 2 görev)',
    hasTasks,
    `Ders en az 2 rehberli uygulama görevi içermelidir. Mevcut: ${lesson.tasks?.length || 0}`
  );

  const hasThreeLevelHints = (lesson.tasks || []).every(
    (task) =>
      task.hints &&
      task.hints.level1 &&
      task.hints.level1.trim().length >= 10 &&
      task.hints.level2 &&
      task.hints.level2.trim().length >= 10 &&
      task.hints.level3 &&
      task.hints.level3.trim().length >= 10
  );
  recordCheck(
    'chk_three_level_hints',
    '3 Seviyeli Kademeli İpuçları (Tüm görevlerde)',
    hasThreeLevelHints,
    'Her görevde Seviye 1 (hafif), Seviye 2 (yönlendirici) ve Seviye 3 (tam çözüm) ipuçları eksiksiz olmalıdır.'
  );

  const tasksHaveValidators = (lesson.tasks || []).every((t) => typeof t.validate === 'function');
  recordCheck(
    'chk_task_validators',
    'Görev Doğrulama Fonksiyonları',
    tasksHaveValidators,
    'Tüm rehberli görevler geçerli bir doğrulama fonksiyonuna (validate) sahip olmalıdır.'
  );

  // 9. Independent Practice
  const hasIndependentPractice =
    lesson.independentPractice &&
    typeof lesson.independentPractice.goal === 'string' &&
    lesson.independentPractice.goal.trim().length > 10 &&
    typeof lesson.independentPractice.workbookFactory === 'function';
  recordCheck(
    'chk_independent_practice',
    'Bağımsız Uygulama Modülü',
    !!hasIndependentPractice,
    'Bağımsız uygulama (independentPractice) geçerli bir hedef ve bağımsız çalışma kitabı üreticisi içermelidir.'
  );

  // 10. Quiz Questions & Answer Key
  const hasValidQuiz =
    Array.isArray(lesson.quizQuestions) &&
    lesson.quizQuestions.length >= 2 &&
    lesson.quizQuestions.every(
      (q) =>
        q.question &&
        Array.isArray(q.options) &&
        q.options.length >= 3 &&
        typeof q.correctIndex === 'number' &&
        q.correctIndex >= 0 &&
        q.correctIndex < q.options.length &&
        q.explanation
    );
  recordCheck(
    'chk_quiz_evaluation',
    'Değerlendirme Testi & Cevap Anahtarı (En az 2 soru)',
    hasValidQuiz,
    'Ders değerlendirme testi en az 2 soru içermeli, her soru en az 3 seçenek, geçerli doğru şık indeksi ve açıklama bulundurmalıdır.',
    'warning'
  );

  // 11. Initial Workbook Factory
  let canInstantiateWorkbook = false;
  try {
    const wb = lesson.initialWorkbookFactory();
    canInstantiateWorkbook = !!(wb && wb.sheets && wb.sheets.length > 0 && wb.activeSheetId);
  } catch {
    canInstantiateWorkbook = false;
  }
  recordCheck(
    'chk_initial_workbook',
    'Simülatör Başlangıç Çalışma Kitabı',
    canInstantiateWorkbook,
    'initialWorkbookFactory fonksiyonu geçerli ve sayfaları olan bir çalışma kitabı (Workbook) üretmelidir.'
  );

  // Score calculation: 100 max, errors subtract 15, warnings subtract 5
  const totalChecks = details.length;
  const passedCount = details.filter((d) => d.passed).length;
  const rawScore = Math.round((passedCount / totalChecks) * 100);
  const isValid = errors.length === 0;

  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    lessonType: lesson.lessonType,
    isValid,
    score: isValid ? Math.max(70, rawScore) : Math.min(65, rawScore),
    passedChecks,
    warnings,
    errors,
    details,
  };
}
