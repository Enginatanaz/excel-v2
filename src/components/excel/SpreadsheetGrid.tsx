/**
 * Interactive Spreadsheet Grid Component
 * Features:
 * - Single cell & Shift+click / Drag multi-cell selection
 * - Perimeter border & background highlight for selected range
 * - Inline input for direct editing
 * - Column & row headers with active highlights
 * - Full keyboard navigation (Arrows, Tab, Enter, F2, Delete, Ctrl+C/X/V/Z/Y/A/B/S)
 * - Safe right-click context menu positioning
 */

import React, { useRef, useEffect, useState } from 'react';
import type {
  Worksheet,
  SelectionState,
  CellCoordinate,
} from '../../modules/spreadsheet/types.ts';
import { colIndexToLetter, cellToAddress } from '../../utils/cellAddress.ts';
import { formatCellValue } from '../../utils/validation.ts';
import { handleGridKeyDown } from '../../modules/spreadsheet/keyboardShortcuts.ts';
import { isCellOnRangeBorder } from '../../modules/spreadsheet/selection.ts';

interface SpreadsheetGridProps {
  sheet: Worksheet;
  selection: SelectionState;
  onSelectCell: (col: string, row: number, expandSelection?: boolean) => void;
  onSelectAll?: () => void;
  onStartEditing: (initialValue?: string) => void;
  onUpdateEditValue: (value: string) => void;
  onCommitEditing: (moveToNext?: boolean) => void;
  onCancelEditing: () => void;
  onClearCell: () => void;
  onContextMenu: (e: React.MouseEvent, cell: CellCoordinate) => void;
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onToggleBold?: () => void;
  onSave?: () => void;
}

export function SpreadsheetGrid({
  sheet,
  selection,
  onSelectCell,
  onSelectAll,
  onStartEditing,
  onUpdateEditValue,
  onCommitEditing,
  onCancelEditing,
  onClearCell,
  onContextMenu,
  onCopy,
  onCut,
  onPaste,
  onUndo,
  onRedo,
  onToggleBold,
  onSave,
}: SpreadsheetGridProps) {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);

  const { activeCell, isEditing, editValue, range } = selection;

  // Auto focus inline input when editing starts
  useEffect(() => {
    if (isEditing && inlineInputRef.current) {
      inlineInputRef.current.focus();
    }
  }, [isEditing]);

  // Clean up mouse drag selection
  useEffect(() => {
    const handleMouseUp = () => setIsMouseDown(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleTouchStart = (col: string, rowNum: number, e: React.TouchEvent, coord: CellCoordinate) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    touchTimerRef.current = setTimeout(() => {
      onSelectCell(col, rowNum, false);
      onContextMenu({ clientX: touch.clientX, clientY: touch.clientY, preventDefault: () => {} } as any, coord);
      touchTimerRef.current = null;
    }, 550);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartPos.current) {
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - touchStartPos.current.x);
      const dy = Math.abs(touch.clientY - touchStartPos.current.y);
      if (dx > 10 || dy > 10) {
        if (touchTimerRef.current) {
          clearTimeout(touchTimerRef.current);
          touchTimerRef.current = null;
        }
      }
    }
  };

  const handleTouchEnd = (col: string, rowNum: number) => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
      onSelectCell(col, rowNum, false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleGridKeyDown(e, selection, sheet.colCount, sheet.rowCount, {
      onMoveActiveCell: (newCoord, expandSelection) =>
        onSelectCell(newCoord.col, newCoord.row, expandSelection),
      onStartEditing: (char) => onStartEditing(char),
      onCommitEditing: (moveToNext) => onCommitEditing(moveToNext),
      onCancelEditing: () => onCancelEditing(),
      onClearCell: () => onClearCell(),
      onCopy,
      onCut,
      onPaste,
      onUndo,
      onRedo,
      onSelectAll,
      onToggleBold,
      onSave,
    });
  };

  // Generate column letters
  const columns = Array.from({ length: sheet.colCount }, (_, i) => ({
    letter: colIndexToLetter(i),
    index: i,
  }));

  // Generate rows (1 to rowCount)
  const rows = Array.from({ length: sheet.rowCount }, (_, i) => i + 1);

  return (
    <div
      ref={gridContainerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative flex-1 overflow-auto bg-white border border-slate-200 outline-none select-none max-h-[580px] min-h-[380px]"
    >
      <table className="w-full border-collapse border-spacing-0 table-fixed text-xs font-sans">
        {/* Column Width Definitions */}
        <colgroup>
          {/* Row header column */}
          <col style={{ width: '44px' }} />
          {/* Content columns */}
          {columns.map((c) => (
            <col
              key={c.letter}
              style={{
                width: c.index === 0 ? '160px' : c.index === 1 ? '135px' : '96px',
              }}
            />
          ))}
        </colgroup>

        {/* Top Header: Column Letters */}
        <thead className="sticky top-0 z-20 bg-slate-100 shadow-xs">
          <tr>
            {/* Top-left corner box (Clicking selects all) */}
            <th
              onClick={onSelectAll}
              title="Tümünü Seç (Ctrl+A)"
              className="h-7 border-r border-b border-slate-300 bg-slate-200/80 font-mono text-[11px] font-normal text-slate-500 text-center select-none sticky left-0 z-30 hover:bg-slate-300 transition-colors cursor-pointer"
            >
              ◢
            </th>

            {/* Column Headers A, B, C... */}
            {columns.map((col) => {
              const isColActive = activeCell.col === col.letter;
              return (
                <th
                  key={col.letter}
                  className={`h-7 border-r border-b border-slate-300 font-mono text-[11px] font-semibold text-center select-none transition-colors ${
                    isColActive
                      ? 'bg-emerald-100/90 text-emerald-900 border-b-2 border-b-[#107c41]'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {col.letter}
                </th>
              );
            })}
          </tr>
        </thead>

        {/* Grid Body: Rows & Cells */}
        <tbody>
          {rows.map((rowNum) => {
            const isRowActive = activeCell.row === rowNum;

            return (
              <tr key={rowNum} className="h-7">
                {/* Row Number Header */}
                <th
                  className={`border-r border-b border-slate-300 font-mono text-[11px] font-normal text-center select-none sticky left-0 z-10 transition-colors ${
                    isRowActive
                      ? 'bg-emerald-100/90 text-emerald-900 font-semibold border-r-2 border-r-[#107c41]'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {rowNum}
                </th>

                {/* Cells in Row */}
                {columns.map((col) => {
                  const addr = cellToAddress(col.letter, rowNum);
                  const cell = sheet.cells[addr];
                  const isActive =
                    activeCell.col === col.letter && activeCell.row === rowNum;

                  const currentCoord: CellCoordinate = {
                    col: col.letter,
                    colIndex: col.index,
                    row: rowNum,
                  };

                  const borderInfo = isCellOnRangeBorder(currentCoord, range);
                  const isRangeSelected = borderInfo.isInside && !isActive;

                  const isCellEditing = isActive && isEditing;
                  const displayContent = cell
                    ? formatCellValue(cell.computed, cell.style?.format)
                    : '';

                  // Align styles
                  const alignClass =
                    cell?.style?.align === 'right'
                      ? 'text-right'
                      : cell?.style?.align === 'center'
                      ? 'text-center'
                      : 'text-left';

                  const fontStyleClass = `${cell?.style?.bold ? 'font-semibold' : ''} ${
                    cell?.style?.italic ? 'italic' : ''
                  }`;

                  // Range border visual classes
                  let rangeBorderClass = '';
                  if (borderInfo.isInside) {
                    if (borderInfo.top) rangeBorderClass += ' border-t-2 border-t-[#107c41]';
                    if (borderInfo.bottom) rangeBorderClass += ' border-b-2 border-b-[#107c41]';
                    if (borderInfo.left) rangeBorderClass += ' border-l-2 border-l-[#107c41]';
                    if (borderInfo.right) rangeBorderClass += ' border-r-2 border-r-[#107c41]';
                  }

                  return (
                    <td
                      key={addr}
                      onMouseDown={(e) => {
                        if (e.button === 0) {
                          gridContainerRef.current?.focus();
                          setIsMouseDown(true);
                          onSelectCell(col.letter, rowNum, e.shiftKey);
                        }
                      }}
                      onTouchStart={(e) => handleTouchStart(col.letter, rowNum, e, currentCoord)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={() => handleTouchEnd(col.letter, rowNum)}
                      onMouseEnter={() => {
                        if (isMouseDown) {
                          onSelectCell(col.letter, rowNum, true);
                        }
                      }}
                      onDoubleClick={() => onStartEditing(cell?.raw || '')}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        onSelectCell(col.letter, rowNum, false);
                        onContextMenu(e, currentCoord);
                      }}
                      style={{
                        backgroundColor:
                          cell?.style?.backgroundColor ||
                          (isRangeSelected ? 'rgba(16, 124, 65, 0.08)' : undefined),
                      }}
                      className={`relative px-2 py-1 border-r border-b border-slate-200 transition-colors cursor-cell select-none truncate ${alignClass} ${fontStyleClass} ${rangeBorderClass} ${
                        isActive
                          ? 'ring-2 ring-[#107c41] ring-inset z-10 bg-white font-medium'
                          : isRangeSelected
                          ? 'bg-emerald-50/70'
                          : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {isCellEditing ? (
                        <input
                          ref={inlineInputRef}
                          type="text"
                          value={editValue}
                          onChange={(e) => onUpdateEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              onCommitEditing(true);
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              onCancelEditing();
                            }
                          }}
                          onBlur={() => onCommitEditing(false)}
                          className="absolute inset-0 w-full h-full px-2 py-1 text-xs bg-white text-slate-900 border-none outline-none ring-2 ring-[#107c41] ring-inset z-20 font-mono"
                        />
                      ) : (
                        <span
                          className={`block truncate ${
                            cell?.error
                              ? 'text-rose-600 font-mono font-semibold'
                              : cell?.style?.format === 'currency' ||
                                typeof cell?.computed === 'number'
                              ? 'font-mono tabular-nums'
                              : ''
                          }`}
                        >
                          {cell?.error ? cell.error : displayContent}
                        </span>
                      )}

                      {/* Excel Active Cell Fill Handle Dot */}
                      {isActive && !isCellEditing && (
                        <div
                          aria-hidden="true"
                          className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#107c41] border border-white z-20 cursor-crosshair pointer-events-none"
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
