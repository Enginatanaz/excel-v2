/**
 * Learning and Lesson state machine types for Excel Akademi AI
 * Stage 4: Universal Lesson Content Engine & Pedagogical System
 * Supports 8 distinct Excel lesson types with comprehensive pedagogical structures
 */

import type { Worksheet, Workbook, CellCoordinate, NumberFormat, HorizontalAlignment } from '../spreadsheet/types.ts';

/**
 * 8 Universal Excel lesson categories supported by the curriculum engine:
 */
export type LessonType =
  | 'concept'             // A. Kavram dersleri (Hücre, Çalışma Kitabı, Veri Türleri)
  | 'interface_action'    // B. Arayüz ve işlem dersleri (Şerit menü, Biçimlendirme, Kısayollar)
  | 'formula_function'   // C. Formül ve fonksiyon dersleri (TOPLA, EĞER, DÜŞEYARA)
  | 'data_management'     // D. Veri yönetimi dersleri (Sıralama, Filtreleme, Yinelenenler)
  | 'visualization'       // E. Görselleştirme dersleri (Grafikler, Mini Grafikler, Dashboard)
  | 'advanced_analysis'   // F. İleri analiz dersleri (PivotTable, Çapraz Tablolar)
  | 'automation'          // G. Otomasyon dersleri (Makrolar, Veri Temizleme)
  | 'project';            // H. Proje dersleri (Uçtan uca iş senaryoları)

/**
 * Compulsory 14-state lesson engine states:
 */
export type LessonEngineState =
  | 'lesson_intro'
  | 'explanation'
  | 'worked_example'
  | 'ready_for_task'
  | 'teacher_instruction'
  | 'waiting_for_student'
  | 'validating'
  | 'correct'
  | 'incorrect'
  | 'hint'
  | 'next_step'
  | 'independent_practice'
  | 'assessment'
  | 'completed';

export type LessonStepStatus =
  | 'explanation'
  | 'example'
  | 'instruction'
  | 'waiting_for_student'
  | 'validating'
  | 'success'
  | 'retry'
  | 'completed';

export type TaskActionType =
  | 'cell_selection'
  | 'formula_input'
  | 'data_entry'
  | 'cell_formatting'
  | 'formula_result'
  | 'auto_recalculation'
  | 'menu_action'
  | 'keyboard_shortcut'
  | 'independent_challenge';

export interface TaskValidationResult {
  isValid: boolean;
  message: string;
  hint?: string;
  expectedValue?: string | number;
  diagnosticDetail?: string;
}

export interface TaskHintLevels {
  level1: string; // Hafif ipucu: Dikkat edilmesi gereken nokta
  level2: string; // Yönlendirici ipucu: Nereye/hangi hücreye veya menüye bakılacağı
  level3: string; // Ayrıntılı yardım: Adım adım ne yapılması gerektiği
}

export interface TaskStep {
  id: string;
  taskNumber: number;
  title: string;
  actionType?: TaskActionType;
  instruction: string;
  hint: string; // Default hint
  hints: TaskHintLevels; // 3-level graduated hint system
  narrationText: string;
  teacherIntroNarration?: string;
  targetCell?: string; // e.g. "B7"
  targetRange?: string; // e.g. "B2:B6"
  validate: (sheet: Worksheet, activeCell: CellCoordinate, isEditing?: boolean) => TaskValidationResult;
}

export interface LessonSolvedExample {
  title: string;
  scenario: string;
  dataSnippet: Array<{ label: string; value: string }>;
  formula?: string;
  result?: string;
  procedureSteps?: string[];
  explanation: string;
  steps: string[];
  audioNarration?: string;
}

export interface ExplanationTopic {
  id: string;
  number: number;
  title: string;
  content: string;
  keyTakeaway: string;
  audioNarration: string;
}

export interface LessonGlossaryItem {
  id: string;
  term: string;
  englishEquivalent?: string;
  definition: string;
  category?: string;
  example?: string;
}

export interface LessonUiLocation {
  elementName: string;
  ribbonTab: string; // 'Giriş' | 'Ekle' | 'Sayfa Düzeni' | 'Formüller' | 'Veri'
  group: string;     // 'Yazı Tipi' | 'Hizalama' | 'Sayı' | 'Stiller' | 'İşlev Kitaplığı'
  shortcut?: string; // e.g. 'Ctrl + B'
  description: string;
}

export interface LessonRealWorldScenario {
  id: string;
  industry: string;       // e.g. 'Finans & Muhasebe', 'Perakende', 'Lojistik'
  role: string;           // e.g. 'Bütçe Uzmanı', 'Mağaza Müdürü'
  challenge: string;      // İş yerinde karşılaşılan somut problem
  solution: string;       // Excel aracı ile sağlanan çözüm
  dataDescription: string;// Tablo yapısı
  appliedBenefit: string; // Zaman tasarrufu veya hata önleme kazanımı
}

export interface LessonMistakeItem {
  id: string;
  title: string;
  mistake: string;
  cause: string;
  solution: string;
  badExample?: string;
  goodExample?: string;
}

export interface LessonParameter {
  name: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  example?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number; // 0-indexed
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface IndependentPracticeSpec {
  title: string;
  description: string;
  scenario?: string;
  goal: string;
  targetCell: string;
  targetRange?: string;
  expectedFormula?: string[];
  expectedResult?: number | string;
  expectedFormat?: NumberFormat;
  expectedAlignment?: HorizontalAlignment;
  hint: string;
  hints: TaskHintLevels;
  narrationText: string;
  workbookFactory: () => Workbook;
  customValidator?: (sheet: Worksheet) => TaskValidationResult;
}

export interface AssessmentReport {
  lessonId: string;
  lessonTitle: string;
  completedAt: string;
  tasksCompleted: number;
  totalTasks: number;
  independentPracticeCompleted: boolean;
  totalWrongAttempts: number;
  totalHintsUsed: number;
  score: number; // 0 - 100
  masteredSkills: string[];
  topicsToReview: string[];
  nextRecommendedLesson: {
    id: string;
    title: string;
  };
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  lessonType: LessonType;
  category: string;
  level: 'Başlangıç' | 'Orta' | 'İleri';
  estimatedMinutes: number;
  description: string;
  learningObjective: string;
  learningOutcomes?: string[];
  prerequisites?: Array<{ id: string; title: string }>;
  introNarration: string;
  topics: ExplanationTopic[];
  glossary?: LessonGlossaryItem[];
  uiLocations?: LessonUiLocation[];
  realWorldScenarios?: LessonRealWorldScenario[];
  commonMistakes?: LessonMistakeItem[];
  bestPractices?: string[];
  explanationContent: {
    overview: string;
    syntax?: string;
    parameters?: LessonParameter[];
    procedureSteps?: string[];
    bestPractices: string[];
    commonMistakes: string[];
  };
  solvedExample: LessonSolvedExample;
  alternativeExamples?: LessonSolvedExample[];
  tasks: TaskStep[];
  independentPractice: IndependentPracticeSpec;
  quizQuestions?: QuizQuestion[];
  summary: string[];
  initialWorkbookFactory: () => Workbook;
}

export interface UserLessonProgress {
  lessonId: string;
  completed: boolean;
  currentTaskIndex: number;
  completedTasks: string[];
  lastStudiedAt: string;
  score?: number;
  quizScore?: number;
  engineState?: LessonEngineState;
  hintsUsedCount?: number;
  wrongAttemptsCount?: number;
  independentCompleted?: boolean;
}

export interface OverallLearningProgress {
  totalCompletedLessons: number;
  totalTimeSpentMinutes: number;
  dailyGoalMinutes: number;
  dailyMinutesCompleted: number;
  lastLessonId: string;
  recommendedLessonId: string;
  lessonProgress: Record<string, UserLessonProgress>;
}
