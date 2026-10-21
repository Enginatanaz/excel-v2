/**
 * Standalone Excel Simulator Workbench
 * Full-width interactive spreadsheet sandbox with formulas, toolbar, and sheet tabs
 */

import { useSpreadsheet } from '../../hooks/useSpreadsheet.ts';
import { ExcelToolbar } from '../../components/excel/ExcelToolbar.tsx';
import { FormulaBar } from '../../components/excel/FormulaBar.tsx';
import { SpreadsheetGrid } from '../../components/excel/SpreadsheetGrid.tsx';
import { SheetTabs } from '../../components/excel/SheetTabs.tsx';
import { CellContextMenu } from '../../components/excel/CellContextMenu.tsx';
import { createDefaultWorkbook } from '../../modules/spreadsheet/spreadsheetState.ts';

export function SimulatorPage() {
  const spreadsheet = useSpreadsheet(createDefaultWorkbook);

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Excel Çalışma Alanı Simülatörü
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Formül denemeleri, tablo düzenleme ve serbest Excel pratiği için tam etkileşimli çalışma kitabı.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-500 bg-white px-3 py-1.5 rounded border border-slate-200 self-start sm:self-auto">
          Aktif: {spreadsheet.activeCellAddress}
        </div>
      </div>

      {/* Spreadsheet Workspace Container */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
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
          onReset={() => spreadsheet.resetWorkbook()}
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

      {/* Quick Help Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-500 pt-2">
        <div className="p-3 bg-white border border-slate-200 rounded-md">
          <span className="font-semibold text-slate-800 block mb-1">Gezinme & Seçim</span>
          Yön okları ile hücrelerde gezinebilir, çift tıklayarak veya doğrudan yazmaya başlayarak düzenleme yapabilirsiniz.
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-md">
          <span className="font-semibold text-slate-800 block mb-1">Desteklenen Formüller</span>
          <code className="text-emerald-700 font-mono">=TOPLA(B2:B6)</code>, <code className="text-emerald-700 font-mono">=SUM(B2:B6)</code>, <code className="text-emerald-700 font-mono">=ORTALAMA(...)</code>, <code className="text-emerald-700 font-mono">=MAK(...)</code>, <code className="text-emerald-700 font-mono">=MİN(...)</code>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded-md">
          <span className="font-semibold text-slate-800 block mb-1">Bağlam Menüsü</span>
          Herhangi bir hücreye sağ tıklayarak Kopyala, Kes, Yapıştır, İçeriği Temizle ve Düzenle işlemlerini gerçekleştirebilirsiniz.
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
