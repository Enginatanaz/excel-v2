/**
 * Interactive Lesson Classroom Page
 * Provides side-by-side or responsive split view with live synchronized spreadsheet simulator
 */

import { useState, useMemo, useEffect } from 'react';
import type { Lesson } from '../../modules/learning/lessonTypes.ts';
import { useSpreadsheet } from '../../hooks/useSpreadsheet.ts';
import { useLessonSession } from '../../hooks/useLessonSession.ts';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout.ts';
import { LessonHeader } from '../../components/lesson/LessonHeader.tsx';
import { LessonTabs, type LessonTabType } from '../../components/lesson/LessonTabs.tsx';
import { LessonContent } from '../../components/lesson/LessonContent.tsx';
import { LessonProgress } from '../../components/lesson/LessonProgress.tsx';
import { TaskInstruction } from '../../components/lesson/TaskInstruction.tsx';
import { TaskFeedback } from '../../components/lesson/TaskFeedback.tsx';
import { TeacherControls } from '../../components/lesson/TeacherControls.tsx';
import { ExcelToolbar } from '../../components/excel/ExcelToolbar.tsx';
import { FormulaBar } from '../../components/excel/FormulaBar.tsx';
import { SpreadsheetGrid } from '../../components/excel/SpreadsheetGrid.tsx';
import { SheetTabs } from '../../components/excel/SheetTabs.tsx';
import { CellContextMenu } from '../../components/excel/CellContextMenu.tsx';
import { Card } from '../../components/common/Card.tsx';
import { BookOpen, Table2, Dumbbell, Sparkles, Target, Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { narrationService } from '../../modules/teacher/narrationService.ts';
import { LessonQuiz } from '../../components/lesson/LessonQuiz.tsx';

interface LessonPageProps {
  lesson: Lesson;
  onBackToLessons: () => void;
}

export function LessonPage({ lesson, onBackToLessons }: LessonPageProps) {
  const { isMobile } = useResponsiveLayout();
  const [mobileTab, setMobileTab] = useState<'instruction' | 'spreadsheet'>('instruction');

  // Spreadsheet state engine
  const spreadsheet = useSpreadsheet(lesson.initialWorkbookFactory);

  // Lesson state engine
  const session = useLessonSession(lesson);

  const {
    currentTaskIndex,
    currentTask,
    activeTab,
    setActiveTab,
    engineState,
    validationResult,
    completedTaskIds,
    currentHintLevel,
    hintsUsedCount,
    isIndependentCompleted,
    independentValidationResult,
    assessmentReport,
    isCompleted,
    proceedToExample,
    proceedToGuidedPractice,
    validateCurrentTask,
    requestHint,
    nextTask,
    validateIndependentPractice,
    jumpToTask,
  } = session;

  const initialWbName = useMemo(() => lesson.initialWorkbookFactory().name, [lesson]);
  const practiceWbName = useMemo(
    () => (lesson.independentPractice ? lesson.independentPractice.workbookFactory().name : ''),
    [lesson]
  );

  // Auto-switch workbook if user is in independent practice mode
  useEffect(() => {
    if (activeTab === 'bagimsiz' && lesson.independentPractice) {
      if (spreadsheet.workbook.name !== practiceWbName) {
        spreadsheet.resetWorkbook(lesson.independentPractice.workbookFactory);
      }
    }
  }, [activeTab, lesson.independentPractice, practiceWbName, spreadsheet]);

  const handleTabChange = (tab: LessonTabType) => {
    if (tab === 'bagimsiz') {
      if (lesson.independentPractice && spreadsheet.workbook.name !== practiceWbName) {
        spreadsheet.resetWorkbook(lesson.independentPractice.workbookFactory);
      }
    } else if (tab === 'uygulama') {
      if (spreadsheet.workbook.name !== initialWbName) {
        spreadsheet.resetWorkbook(lesson.initialWorkbookFactory);
      }
    }
    setActiveTab(tab);
  };

  const handleValidateGuided = () => {
    validateCurrentTask(
      spreadsheet.activeSheet,
      spreadsheet.selection.activeCell,
      spreadsheet.selection.isEditing
    );
  };

  const handleValidateIndependent = () => {
    validateIndependentPractice(spreadsheet.activeSheet);
  };

  // Contextual narration text for teacher controls
  const activeNarrationText = useMemo(() => {
    if (activeTab === 'anlatim') return lesson.introNarration;
    if (activeTab === 'ornek') return lesson.solvedExample.audioNarration || lesson.solvedExample.explanation;
    if (activeTab === 'uygulama') return currentTask?.narrationText || lesson.description;
    if (activeTab === 'bagimsiz') return lesson.independentPractice?.narrationText || 'Bağımsız uygulama adımı.';
    if (activeTab === 'test') return 'Değerlendirme testini yanıtlayarak öğrendiklerinizi pekiştirin.';
    return 'Tebrikler! Dersi ve değerlendirmeyi başarıyla tamamladınız.';
  }, [activeTab, lesson, currentTask]);

  return (
    <div className="space-y-4">
      {/* Lesson Header */}
      <LessonHeader
        lesson={lesson}
        isCompleted={isCompleted}
        onBackToLessons={onBackToLessons}
      />

      {/* Mobile Tab Switcher (< 1024px) */}
      <div className="lg:hidden flex items-center p-1 bg-slate-200/80 rounded-lg">
        <button
          onClick={() => setMobileTab('instruction')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            mobileTab === 'instruction'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#107c41]" />
          <span>Ders & Görevler</span>
        </button>

        <button
          onClick={() => setMobileTab('spreadsheet')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            mobileTab === 'spreadsheet'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table2 className="w-3.5 h-3.5 text-[#107c41]" />
          <span>Excel Çalışma Alanı</span>
        </button>
      </div>

      {/* Main Responsive Split Grid (Side-by-side on desktop, switched on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Lesson Guide & Tasks */}
        <div
          className={`lg:col-span-5 space-y-4 ${
            isMobile && mobileTab === 'spreadsheet' ? 'hidden' : 'block'
          }`}
        >
          {/* Sub Navigation: Anlatım, Örnek, Rehberli, Bağımsız, Rapor */}
          <LessonTabs
            activeTab={activeTab}
            onChangeTab={handleTabChange}
            tasksCompletedCount={completedTaskIds.length}
            totalTasksCount={lesson.tasks.length}
            isIndependentCompleted={isIndependentCompleted}
            hasQuiz={Boolean(lesson.quizQuestions && lesson.quizQuestions.length > 0)}
          />

          {/* Teacher Audio Bar */}
          <TeacherControls currentText={activeNarrationText} />

          {/* Tab Content */}
          <Card className="min-h-[380px]">
            {activeTab === 'uygulama' ? (
              <div className="space-y-4">
                {/* Step indicator */}
                <LessonProgress
                  tasks={lesson.tasks}
                  currentTaskIndex={currentTaskIndex}
                  completedTaskIds={completedTaskIds}
                  onSelectTask={jumpToTask}
                />

                <div className="h-px bg-slate-100" />

                {/* Active Task Instruction with 3-Level Hints */}
                {currentTask && (
                  <TaskInstruction
                    task={currentTask}
                    totalTasks={lesson.tasks.length}
                    currentHintLevel={currentHintLevel}
                    onRequestHint={requestHint}
                    hintsUsedCount={hintsUsedCount}
                  />
                )}

                {/* Validation Feedback & Next Step trigger */}
                <TaskFeedback
                  engineState={engineState}
                  validationResult={validationResult}
                  onValidate={handleValidateGuided}
                  onNextTask={nextTask}
                  onRetry={handleValidateGuided}
                  onRequestHint={requestHint}
                  isLastTask={currentTaskIndex === lesson.tasks.length - 1}
                />

                {/* Mobile helper button to quickly jump to the spreadsheet */}
                {isMobile && (
                  <div className="pt-2">
                    <button
                      onClick={() => setMobileTab('spreadsheet')}
                      className="w-full py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-md text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Table2 className="w-3.5 h-3.5" />
                      <span>Excel Tablosuna Git ve Uygula</span>
                    </button>
                  </div>
                )}
              </div>
            ) : activeTab === 'bagimsiz' ? (
              /* Independent Practice View */
              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        {lesson.independentPractice?.title || 'Bağımsız Uygulama Görevi'}
                      </h3>
                      <span className="text-[11px] text-slate-500">Kendi Başına Formül Yaz</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (lesson.independentPractice?.narrationText) {
                        narrationService.playNarration(lesson.independentPractice.narrationText);
                      }
                    }}
                    className="flex items-center gap-1 text-[11px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors cursor-pointer"
                    title="Görevi Dinle"
                  >
                    <Volume2 className="w-3 h-3 text-emerald-700" />
                    <span>Dinle</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {lesson.independentPractice?.scenario}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="flex items-center gap-1 font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                      <Target className="w-3 h-3 text-emerald-600" />
                      Hedef: {lesson.independentPractice?.targetCell}
                    </span>
                    <span className="text-xs text-slate-500">
                      Beklenen Toplam: <strong className="text-slate-900">{lesson.independentPractice?.expectedResult} ₺</strong>
                    </span>
                  </div>
                </div>

                {/* Independent Validation Feedback */}
                {independentValidationResult ? (
                  independentValidationResult.isValid ? (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg space-y-3">
                      <div className="flex items-start gap-2.5 text-emerald-900">
                        <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-emerald-950">Mükemmel Sonuç!</div>
                          <div className="text-emerald-900 text-xs mt-0.5 font-medium">
                            {independentValidationResult.message}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => setActiveTab('ozet')}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#107c41] hover:bg-[#0b5a2f] text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
                        >
                          <span>Değerlendirme Raporunu ve Karneyi Gör</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg space-y-2 text-xs">
                      <div className="font-bold text-rose-950">Tekrar Kontrol Edin</div>
                      <div className="text-rose-900">{independentValidationResult.message}</div>
                      {independentValidationResult.hint && (
                        <div className="text-amber-900 bg-amber-50 p-2 rounded border border-amber-200 font-medium text-[11px]">
                          <strong>İpucu: </strong>
                          {independentValidationResult.hint}
                        </div>
                      )}
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={handleValidateIndependent}
                          className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded text-xs font-medium cursor-pointer"
                        >
                          Şimdi Yeniden Kontrol Et
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">
                      Tabloya formülü girip Enter'a bastıktan sonra:
                    </span>
                    <button
                      onClick={handleValidateIndependent}
                      className="px-3 py-1.5 bg-[#107c41] hover:bg-[#0b5a2f] text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Bağımsız Görevi Doğrula
                    </button>
                  </div>
                )}

                {/* Mobile switch to spreadsheet */}
                {isMobile && (
                  <div className="pt-2">
                    <button
                      onClick={() => setMobileTab('spreadsheet')}
                      className="w-full py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-md text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Table2 className="w-3.5 h-3.5" />
                      <span>Excel Tablosuna Git ve Uygula</span>
                    </button>
                  </div>
                )}
              </div>
            ) : activeTab === 'test' ? (
              <LessonQuiz
                questions={lesson.quizQuestions || []}
                lessonTitle={lesson.title}
                onQuizCompleted={(score, total) => {
                  // Recorded
                }}
              />
            ) : (
              /* Anlatım, Örnek veya Özet / Değerlendirme Raporu */
              <LessonContent
                lesson={lesson}
                activeTab={activeTab === 'ornek' ? 'ornek' : activeTab === 'ozet' ? 'ozet' : 'anlatim'}
                onProceedToExample={proceedToExample}
                onProceedToPractice={proceedToGuidedPractice}
                assessmentReport={assessmentReport}
              />
            )}
          </Card>
        </div>

        {/* Right Column: Live Interactive Excel Simulator (Hidden on mobile if user is reading instruction) */}
        <div
          className={`lg:col-span-7 ${
            isMobile && mobileTab === 'instruction' ? 'hidden' : 'block'
          }`}
        >
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            {/* Window title bar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-800 text-white text-xs select-none">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-medium truncate">{spreadsheet.workbook.name}</span>
                <span className="text-slate-400 text-[11px] hidden sm:inline">- Excel Simülatörü</span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono">
                Seçili: {spreadsheet.activeCellAddress}
              </div>
            </div>

            {/* Ribbon / Toolbar */}
            <ExcelToolbar
              activeCellStyle={spreadsheet.activeCellData?.style}
              onToggleBold={() =>
                spreadsheet.toggleStyle({
                  bold: !spreadsheet.activeCellData?.style?.bold,
                })
              }
              onToggleItalic={() =>
                spreadsheet.toggleStyle({
                  italic: !spreadsheet.activeCellData?.style?.italic,
                })
              }
              onSetAlignment={(align) => spreadsheet.toggleStyle({ align })}
              onToggleCurrency={() =>
                spreadsheet.toggleStyle({
                  format:
                    spreadsheet.activeCellData?.style?.format === 'currency'
                      ? 'general'
                      : 'currency',
                })
              }
              onAutoSum={() => spreadsheet.applyAutoSum()}
              onCopy={spreadsheet.copyCell}
              onCut={spreadsheet.cutCell}
              onPaste={spreadsheet.pasteCell}
              onClear={spreadsheet.clearCell}
              onReset={() => spreadsheet.resetWorkbook(lesson.initialWorkbookFactory)}
              onUndo={spreadsheet.undo}
              onRedo={spreadsheet.redo}
              canUndo={spreadsheet.canUndo}
              canRedo={spreadsheet.canRedo}
              hasClipboardData={!!spreadsheet.clipboard}
            />

            {/* Formula Bar */}
            <FormulaBar
              activeCellAddress={spreadsheet.activeCellAddress}
              displayAddress={
                spreadsheet.selection.range
                  ? `${spreadsheet.selection.range.startCol}${spreadsheet.selection.range.startRow}:${spreadsheet.selection.range.endCol}${spreadsheet.selection.range.endRow}`
                  : undefined
              }
              rawValue={spreadsheet.activeCellData?.raw || ''}
              isEditing={spreadsheet.selection.isEditing}
              editValue={spreadsheet.selection.editValue}
              onStartEditing={spreadsheet.startEditing}
              onUpdateEditValue={spreadsheet.updateEditValue}
              onCommitEditing={spreadsheet.commitEditing}
              onCancelEditing={spreadsheet.cancelEditing}
              onJumpToAddress={spreadsheet.jumpToAddress}
            />

            {/* Grid */}
            <SpreadsheetGrid
              sheet={spreadsheet.activeSheet}
              selection={spreadsheet.selection}
              onSelectCell={spreadsheet.selectCell}
              onSelectAll={spreadsheet.selectAll}
              onStartEditing={spreadsheet.startEditing}
              onUpdateEditValue={spreadsheet.updateEditValue}
              onCommitEditing={spreadsheet.commitEditing}
              onCancelEditing={spreadsheet.cancelEditing}
              onClearCell={spreadsheet.clearCell}
              onContextMenu={(e, cell) => spreadsheet.openContextMenu(e.clientX, e.clientY, cell)}
              onCopy={spreadsheet.copyCell}
              onCut={spreadsheet.cutCell}
              onPaste={spreadsheet.pasteCell}
              onUndo={spreadsheet.undo}
              onRedo={spreadsheet.redo}
              onToggleBold={() =>
                spreadsheet.toggleStyle({
                  bold: !spreadsheet.activeCellData?.style?.bold,
                })
              }
              onSave={spreadsheet.saveWorkbook}
            />

            {/* Sheet Tabs */}
            <SheetTabs
              sheets={spreadsheet.workbook.sheets}
              activeSheetId={spreadsheet.activeSheetId}
              onSwitchSheet={spreadsheet.switchSheet}
              onAddSheet={spreadsheet.addSheet}
              onRenameSheet={spreadsheet.renameSheet}
              onDeleteSheet={spreadsheet.deleteSheet}
            />
          </div>

          {/* Floating Status Notification */}
          {spreadsheet.statusMessage && (
            <div className="fixed bottom-14 right-4 sm:bottom-6 sm:right-6 bg-slate-900 text-white px-3 py-1.5 rounded-md shadow-lg text-xs font-medium z-50 animate-in fade-in slide-in-from-bottom-2">
              {spreadsheet.statusMessage}
            </div>
          )}

          {/* Quick task verification shortcut under spreadsheet on mobile */}
          {isMobile && activeTab === 'uygulama' && (
            <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-2">
              <div className="text-xs text-slate-700">
                <span className="font-semibold block">Aktif Görev:</span>
                <span className="text-slate-500 truncate block max-w-[200px]">
                  {currentTask?.title}
                </span>
              </div>
              <button
                onClick={() => {
                  handleValidateGuided();
                  setMobileTab('instruction');
                }}
                className="px-3 py-1.5 bg-[#107c41] text-white rounded text-xs font-semibold hover:bg-[#0b5a2f] cursor-pointer"
              >
                Görevi Kontrol Et
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      <CellContextMenu
        contextMenu={spreadsheet.contextMenu}
        onClose={spreadsheet.closeContextMenu}
        onEdit={() => spreadsheet.startEditing()}
        onCopy={spreadsheet.copyCell}
        onCut={spreadsheet.cutCell}
        onPaste={spreadsheet.pasteCell}
        onClear={spreadsheet.clearCell}
        hasClipboard={!!spreadsheet.clipboard}
      />
    </div>
  );
}
