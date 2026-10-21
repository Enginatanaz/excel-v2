/**
 * Keyboard shortcuts handler for spreadsheet grid
 * Isolates navigation from text editing input
 * Supports:
 * - Arrows / Tab / Shift+Tab navigation
 * - Shift+Arrows: Range selection expansion
 * - F2: Start editing existing cell content
 * - Enter: Commit edit and move down
 * - Escape: Cancel edit or range selection
 * - Delete / Backspace: Clear selected cells
 * - Ctrl+C / Cmd+C: Copy
 * - Ctrl+X / Cmd+X: Cut
 * - Ctrl+V / Cmd+V: Paste
 * - Ctrl+Z / Cmd+Z: Undo
 * - Ctrl+Y / Cmd+Y / Ctrl+Shift+Z: Redo
 * - Ctrl+A / Cmd+A: Select All
 * - Ctrl+B / Cmd+B: Bold toggle
 * - Ctrl+S / Cmd+S: Save trigger
 */

import type { CellCoordinate, SelectionState } from './types.ts';
import { moveCellCoordinate, createSelectionRange } from './selection.ts';

export interface KeyActionHandlers {
  onMoveActiveCell: (newCoord: CellCoordinate, expandSelection?: boolean) => void;
  onStartEditing: (initialValue?: string) => void;
  onCommitEditing: (moveToNext?: boolean) => void;
  onCancelEditing: () => void;
  onClearCell: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onCut?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onSelectAll?: () => void;
  onToggleBold?: () => void;
  onSave?: () => void;
}

export function handleGridKeyDown(
  e: React.KeyboardEvent,
  selection: SelectionState,
  maxCols: number,
  maxRows: number,
  handlers: KeyActionHandlers
) {
  // If user is focused on an input element (formula bar or inline input)
  const isInputTarget =
    e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

  if (selection.isEditing) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handlers.onCommitEditing(true);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handlers.onCommitEditing(false);
      handlers.onMoveActiveCell(
        moveCellCoordinate(selection.activeCell, e.shiftKey ? -1 : 1, 0, maxCols, maxRows),
        false
      );
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handlers.onCancelEditing();
    }
    // Allow normal typing and left/right cursor movements inside the input
    return;
  }

  // When NOT in edit mode and target is an input (e.g. formula bar)
  if (isInputTarget) return;

  const isCmdOrCtrl = e.ctrlKey || e.metaKey;

  // Undo: Ctrl+Z / Cmd+Z (without shift)
  if (isCmdOrCtrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
    e.preventDefault();
    if (handlers.onUndo) handlers.onUndo();
    return;
  }

  // Redo: Ctrl+Y / Cmd+Y or Ctrl+Shift+Z / Cmd+Shift+Z
  if ((isCmdOrCtrl && e.key.toLowerCase() === 'y') || (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z')) {
    e.preventDefault();
    if (handlers.onRedo) handlers.onRedo();
    return;
  }

  // Select All: Ctrl+A / Cmd+A
  if (isCmdOrCtrl && e.key.toLowerCase() === 'a') {
    e.preventDefault();
    if (handlers.onSelectAll) handlers.onSelectAll();
    return;
  }

  // Save: Ctrl+S / Cmd+S
  if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
    e.preventDefault();
    if (handlers.onSave) handlers.onSave();
    return;
  }

  // Bold: Ctrl+B / Cmd+B
  if (isCmdOrCtrl && e.key.toLowerCase() === 'b') {
    e.preventDefault();
    if (handlers.onToggleBold) handlers.onToggleBold();
    return;
  }

  // Clipboard: Ctrl+C, Ctrl+V, Ctrl+X
  if (isCmdOrCtrl && e.key.toLowerCase() === 'c') {
    e.preventDefault();
    if (handlers.onCopy) handlers.onCopy();
    return;
  }
  if (isCmdOrCtrl && e.key.toLowerCase() === 'v') {
    e.preventDefault();
    if (handlers.onPaste) handlers.onPaste();
    return;
  }
  if (isCmdOrCtrl && e.key.toLowerCase() === 'x') {
    e.preventDefault();
    if (handlers.onCut) handlers.onCut();
    return;
  }

  // F2: Edit existing cell without overwriting
  if (e.key === 'F2') {
    e.preventDefault();
    handlers.onStartEditing();
    return;
  }

  // Navigation with optional Shift (range selection)
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      handlers.onMoveActiveCell(
        moveCellCoordinate(selection.activeCell, 0, -1, maxCols, maxRows),
        e.shiftKey
      );
      break;
    case 'ArrowDown':
      e.preventDefault();
      handlers.onMoveActiveCell(
        moveCellCoordinate(selection.activeCell, 0, 1, maxCols, maxRows),
        e.shiftKey
      );
      break;
    case 'ArrowLeft':
      e.preventDefault();
      handlers.onMoveActiveCell(
        moveCellCoordinate(selection.activeCell, -1, 0, maxCols, maxRows),
        e.shiftKey
      );
      break;
    case 'ArrowRight':
      e.preventDefault();
      handlers.onMoveActiveCell(
        moveCellCoordinate(selection.activeCell, 1, 0, maxCols, maxRows),
        e.shiftKey
      );
      break;
    case 'Tab':
      e.preventDefault();
      handlers.onMoveActiveCell(
        moveCellCoordinate(selection.activeCell, e.shiftKey ? -1 : 1, 0, maxCols, maxRows),
        false
      );
      break;
    case 'Enter':
      e.preventDefault();
      handlers.onStartEditing();
      break;
    case 'Delete':
    case 'Backspace':
      e.preventDefault();
      handlers.onClearCell();
      break;
    case 'Escape':
      e.preventDefault();
      handlers.onCancelEditing();
      break;
    default:
      // If typing a single character (letter, number, =, arithmetic) without Ctrl/Cmd/Alt
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        handlers.onStartEditing(e.key);
      }
      break;
  }
}
