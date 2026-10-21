/**
 * Excel-style action ribbon / toolbar
 */

import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sigma,
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  RotateCcw,
  Undo2,
  Redo2,
} from 'lucide-react';
import type { CellStyle } from '../../modules/spreadsheet/types.ts';

interface ExcelToolbarProps {
  activeCellStyle?: CellStyle;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onSetAlignment: (align: 'left' | 'center' | 'right') => void;
  onToggleCurrency: () => void;
  onAutoSum: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onClear: () => void;
  onReset: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  hasClipboardData: boolean;
}

export function ExcelToolbar({
  activeCellStyle,
  onToggleBold,
  onToggleItalic,
  onSetAlignment,
  onToggleCurrency,
  onAutoSum,
  onCopy,
  onCut,
  onPaste,
  onClear,
  onReset,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  hasClipboardData,
}: ExcelToolbarProps) {
  const isBold = activeCellStyle?.bold;
  const isItalic = activeCellStyle?.italic;
  const currentAlign = activeCellStyle?.align || 'left';
  const isCurrency = activeCellStyle?.format === 'currency';

  return (
    <div className="flex items-center flex-wrap gap-1 p-1.5 bg-slate-100 border-b border-slate-200 text-slate-700 text-xs">
      {/* History (Undo / Redo) Group */}
      <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-300">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Geri Al (Ctrl+Z)"
          className={`p-1.5 rounded transition-colors ${
            canUndo
              ? 'hover:bg-slate-200 text-slate-800 cursor-pointer'
              : 'text-slate-300 pointer-events-none'
          }`}
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Yinele (Ctrl+Y)"
          className={`p-1.5 rounded transition-colors ${
            canRedo
              ? 'hover:bg-slate-200 text-slate-800 cursor-pointer'
              : 'text-slate-300 pointer-events-none'
          }`}
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Clipboard Group */}
      <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-300">
        <button
          onClick={onCut}
          title="Kes (Ctrl+X)"
          className="p-1.5 rounded hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer"
        >
          <Scissors className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onCopy}
          title="Kopyala (Ctrl+C)"
          className="p-1.5 rounded hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onPaste}
          disabled={!hasClipboardData}
          title="Yapıştır (Ctrl+V)"
          className={`p-1.5 rounded transition-colors ${
            hasClipboardData
              ? 'hover:bg-slate-200 text-slate-800 cursor-pointer'
              : 'text-slate-400 pointer-events-none'
          }`}
        >
          <Clipboard className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Font Styling Group */}
      <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-300">
        <button
          onClick={onToggleBold}
          title="Kalın (Ctrl+B)"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            isBold ? 'bg-slate-300 text-slate-900 font-bold' : 'hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onToggleItalic}
          title="İtalik (Ctrl+I)"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            isItalic ? 'bg-slate-300 text-slate-900 italic' : 'hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Alignment Group */}
      <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-300">
        <button
          onClick={() => onSetAlignment('left')}
          title="Sola Hizala"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            currentAlign === 'left' ? 'bg-slate-300 text-slate-900' : 'hover:bg-slate-200 text-slate-700'
          }`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onSetAlignment('center')}
          title="Ortala"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            currentAlign === 'center' ? 'bg-slate-300 text-slate-900' : 'hover:bg-slate-200 text-slate-700'
          }`}
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onSetAlignment('right')}
          title="Sağa Hizala"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            currentAlign === 'right' ? 'bg-slate-300 text-slate-900' : 'hover:bg-slate-200 text-slate-700'
          }`}
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Number Formatting & AutoSum */}
      <div className="flex items-center gap-1 px-1.5 border-r border-slate-300">
        <button
          onClick={onToggleCurrency}
          title="Para Birimi Formatı (₺)"
          className={`px-2 py-1 rounded font-semibold text-xs transition-colors cursor-pointer ${
            isCurrency ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-slate-200 text-slate-700'
          }`}
        >
          ₺
        </button>
        <button
          onClick={onAutoSum}
          title="Otomatik Toplam (=TOPLA)"
          className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded font-medium transition-colors cursor-pointer"
        >
          <Sigma className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Otomatik Toplam</span>
        </button>
      </div>

      {/* Clear & Reset */}
      <div className="flex items-center gap-1 pl-1 ml-auto">
        <button
          onClick={onClear}
          title="Hücre İçeriğini Temizle (Delete)"
          className="p-1.5 rounded hover:bg-rose-50 hover:text-rose-600 transition-colors text-slate-500 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onReset}
          title="Başlangıç Tablosuna Sıfırla"
          className="flex items-center gap-1 px-2 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden lg:inline text-[11px]">Sıfırla</span>
        </button>
      </div>
    </div>
  );
}
