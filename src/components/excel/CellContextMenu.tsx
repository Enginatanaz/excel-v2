/**
 * Cell Context Menu for spreadsheet right-click and mobile long-press
 */

import { useEffect, useRef } from 'react';
import {
  Scissors,
  Copy,
  Clipboard,
  Trash2,
  Edit2,
} from 'lucide-react';
import type { ContextMenuState } from '../../modules/spreadsheet/types.ts';

interface CellContextMenuProps {
  contextMenu: ContextMenuState;
  onClose: () => void;
  onEdit: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onClear: () => void;
  hasClipboard: boolean;
}

export function CellContextMenu({
  contextMenu,
  onClose,
  onEdit,
  onCopy,
  onCut,
  onPaste,
  onClear,
  hasClipboard,
}: CellContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (contextMenu.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu.isOpen, onClose]);

  if (!contextMenu.isOpen) return null;

  // Calculate viewport boundaries to prevent overflow
  const menuWidth = 208; // w-52
  const menuHeight = 180;
  const safeX = Math.max(10, Math.min(contextMenu.x, window.innerWidth - menuWidth - 10));
  const safeY = Math.max(10, Math.min(contextMenu.y, window.innerHeight - menuHeight - 10));

  return (
    <div
      ref={menuRef}
      style={{
        top: safeY,
        left: safeX,
      }}
      className="fixed z-50 w-52 bg-white rounded-lg shadow-xl border border-slate-200 py-1 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100"
    >
      {contextMenu.targetCell && (
        <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 border-b border-slate-100">
          Hücre: {contextMenu.targetCell.col}{contextMenu.targetCell.row}
        </div>
      )}

      <button
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 transition-colors text-left cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Edit2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Düzenle</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono">Enter</span>
      </button>

      <div className="h-px bg-slate-100 my-1" />

      <button
        onClick={() => {
          onCopy();
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 transition-colors text-left cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Copy className="w-3.5 h-3.5 text-slate-500" />
          <span>Kopyala</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono">Ctrl+C</span>
      </button>

      <button
        onClick={() => {
          onCut();
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-100 transition-colors text-left cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Scissors className="w-3.5 h-3.5 text-slate-500" />
          <span>Kes</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono">Ctrl+X</span>
      </button>

      <button
        onClick={() => {
          onPaste();
          onClose();
        }}
        disabled={!hasClipboard}
        className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors ${
          hasClipboard
            ? 'hover:bg-slate-100 text-slate-700 cursor-pointer'
            : 'text-slate-300 pointer-events-none'
        }`}
      >
        <span className="flex items-center gap-2">
          <Clipboard className="w-3.5 h-3.5" />
          <span>Yapıştır</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono">Ctrl+V</span>
      </button>

      <div className="h-px bg-slate-100 my-1" />

      <button
        onClick={() => {
          onClear();
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-rose-50 hover:text-rose-600 transition-colors text-left cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Trash2 className="w-3.5 h-3.5" />
          <span>İçeriği Temizle</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono">Del</span>
      </button>
    </div>
  );
}
