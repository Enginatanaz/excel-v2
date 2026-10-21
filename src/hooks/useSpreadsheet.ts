/**
 * Spreadsheet state management hook
 * Provides:
 * - History stack for Undo (Ctrl+Z) & Redo (Ctrl+Y)
 * - Single cell & Shift+click / Shift+arrow multi-cell selection
 * - Safe formula evaluation & automatic dependency recalculation
 * - Advanced Copy/Cut/Paste with relative formula transposition
 * - Multi-sheet management (add, switch, rename, delete with safety checks)
 * - Educational / programmatic query API for lesson tasks
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import type {
  Workbook,
  Worksheet,
  CellCoordinate,
  SelectionState,
  ContextMenuState,
  CellStyle,
  CellData,
  ClipboardData,
  SelectionRange,
} from '../modules/spreadsheet/types.ts';
import {
  createDefaultWorkbook,
  createEmptyWorksheet,
} from '../modules/spreadsheet/spreadsheetState.ts';
import { recalculateWorksheet } from '../modules/spreadsheet/formulaEngine.ts';
import {
  letterToColIndex,
  colIndexToLetter,
  cellToAddress,
  addressToCell,
  offsetFormula,
} from '../utils/cellAddress.ts';
import {
  moveCellCoordinate,
  createSelectionRange,
  getAddressesInSelectionRange,
} from '../modules/spreadsheet/selection.ts';

const MAX_HISTORY = 30;

export function useSpreadsheet(initialWorkbookFactory = createDefaultWorkbook) {
  const [workbook, setWorkbook] = useState<Workbook>(initialWorkbookFactory);
  const [activeSheetId, setActiveSheetId] = useState<string>(workbook.activeSheetId);

  // Undo / Redo history stacks (snapshots of workbook)
  const undoStackRef = useRef<Workbook[]>([]);
  const redoStackRef = useRef<Workbook[]>([]);

  // Feedback indicator (e.g. "Kaydedildi" on Ctrl+S)
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeSheet = useMemo(() => {
    return (
      workbook.sheets.find((s) => s.id === activeSheetId) ||
      workbook.sheets[0]
    );
  }, [workbook, activeSheetId]);

  const [selection, setSelection] = useState<SelectionState>({
    activeCell: { col: 'B', colIndex: 1, row: 7 },
    anchorCell: { col: 'B', colIndex: 1, row: 7 },
    range: null,
    isEditing: false,
    editValue: '',
  });

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    targetCell: null,
  });

  const [clipboard, setClipboard] = useState<ClipboardData | null>(null);

  // Active cell data in current sheet
  const activeCellAddress = `${selection.activeCell.col}${selection.activeCell.row}`;
  const activeCellData = activeSheet.cells[activeCellAddress] || {
    raw: '',
    computed: null,
  };

  /**
   * Pushes current state to undo stack before making modifications
   */
  const recordHistory = useCallback((currentWb: Workbook) => {
    undoStackRef.current.push(JSON.parse(JSON.stringify(currentWb)));
    if (undoStackRef.current.length > MAX_HISTORY) {
      undoStackRef.current.shift();
    }
    // Any new change clears redo stack
    redoStackRef.current = [];
  }, []);

  /**
   * Undo action (Ctrl+Z)
   */
  const undo = useCallback(() => {
    if (undoStackRef.current.length === 0) return;

    const previousState = undoStackRef.current.pop()!;
    redoStackRef.current.push(JSON.parse(JSON.stringify(workbook)));

    setWorkbook(previousState);
    if (!previousState.sheets.some((s) => s.id === activeSheetId)) {
      setActiveSheetId(previousState.activeSheetId);
    }
    setStatusMessage('Geri alındı (Undo)');
    setTimeout(() => setStatusMessage(null), 1500);
  }, [workbook, activeSheetId]);

  /**
   * Redo action (Ctrl+Y)
   */
  const redo = useCallback(() => {
    if (redoStackRef.current.length === 0) return;

    const nextState = redoStackRef.current.pop()!;
    undoStackRef.current.push(JSON.parse(JSON.stringify(workbook)));

    setWorkbook(nextState);
    if (!nextState.sheets.some((s) => s.id === activeSheetId)) {
      setActiveSheetId(nextState.activeSheetId);
    }
    setStatusMessage('Yinelendi (Redo)');
    setTimeout(() => setStatusMessage(null), 1500);
  }, [workbook, activeSheetId]);

  /**
   * Select a cell with optional range expansion (Shift+click or Shift+arrow)
   */
  const selectCell = useCallback(
    (col: string, row: number, expandSelection: boolean = false) => {
      const colIndex = letterToColIndex(col);
      const newActive: CellCoordinate = { col, colIndex, row };

      setSelection((prev) => {
        if (prev.isEditing) {
          const addr = `${prev.activeCell.col}${prev.activeCell.row}`;
          const rawValue = prev.editValue;
          recordHistory(workbook);
          setWorkbook((wbPrev) => {
            const currentSheet = wbPrev.sheets.find((s) => s.id === activeSheetId) || wbPrev.sheets[0];
            const existingCell = currentSheet.cells[addr];
            const updatedCells: Record<string, CellData> = {
              ...currentSheet.cells,
              [addr]: {
                ...existingCell,
                raw: rawValue,
                computed: rawValue,
              },
            };
            const updatedSheet = recalculateWorksheet({
              ...currentSheet,
              cells: updatedCells,
            });
            return {
              ...wbPrev,
              sheets: wbPrev.sheets.map((s) => (s.id === updatedSheet.id ? updatedSheet : s)),
            };
          });
        }

        if (expandSelection) {
          const anchor = prev.anchorCell || prev.activeCell;
          const range = createSelectionRange(anchor, newActive);
          return {
            ...prev,
            activeCell: newActive,
            anchorCell: anchor,
            range,
            isEditing: false,
            editValue: '',
          };
        } else {
          return {
            activeCell: newActive,
            anchorCell: newActive,
            range: null,
            isEditing: false,
            editValue: '',
          };
        }
      });

      setContextMenu((prev) => ({ ...prev, isOpen: false }));
    },
    [workbook, activeSheetId, recordHistory]
  );

  /**
   * Jump to address from Name Box (e.g. A1, B7, AA5)
   */
  const jumpToAddress = useCallback(
    (addr: string) => {
      const parsed = addressToCell(addr);
      if (parsed) {
        selectCell(parsed.col, parsed.row, false);
        setStatusMessage(`Hücre: ${parsed.col}${parsed.row}`);
        setTimeout(() => setStatusMessage(null), 1200);
        return true;
      }
      setStatusMessage(`Geçersiz adres: ${addr}`);
      setTimeout(() => setStatusMessage(null), 1500);
      return false;
    },
    [selectCell]
  );

  /**
   * Select entire used area or active sheet (Ctrl+A)
   */
  const selectAll = useCallback(() => {
    const range: SelectionRange = {
      startCol: 'A',
      startRow: 1,
      endCol: colIndexToLetter(activeSheet.colCount - 1),
      endRow: activeSheet.rowCount,
    };
    setSelection((prev) => ({
      ...prev,
      anchorCell: { col: 'A', colIndex: 0, row: 1 },
      range,
      isEditing: false,
      editValue: '',
    }));
  }, [activeSheet]);

  /**
   * Start editing active cell
   */
  const startEditing = useCallback(
    (initialVal?: string) => {
      const currentCell = activeSheet.cells[activeCellAddress];
      const valToEdit =
        initialVal !== undefined
          ? initialVal
          : currentCell
          ? currentCell.raw
          : '';

      setSelection((prev) => ({
        ...prev,
        isEditing: true,
        editValue: valToEdit,
      }));
    },
    [activeSheet, activeCellAddress]
  );

  /**
   * Update edit input buffer
   */
  const updateEditValue = useCallback((val: string) => {
    setSelection((prev) => ({
      ...prev,
      isEditing: true,
      editValue: val,
    }));
  }, []);

  /**
   * Commit editing to worksheet and trigger auto-recalculation
   */
  const commitEditing = useCallback(
    (moveToNextRow: boolean = false) => {
      const addr = activeCellAddress;
      const rawValue = selection.editValue;

      recordHistory(workbook);

      setWorkbook((prev) => {
        const currentSheet = prev.sheets.find((s) => s.id === activeSheetId) || prev.sheets[0];
        const existingCell = currentSheet.cells[addr];

        const updatedCells: Record<string, CellData> = {
          ...currentSheet.cells,
          [addr]: {
            ...existingCell,
            raw: rawValue,
            computed: rawValue,
          },
        };

        const updatedSheet = recalculateWorksheet({
          ...currentSheet,
          cells: updatedCells,
        });

        return {
          ...prev,
          sheets: prev.sheets.map((s) => (s.id === updatedSheet.id ? updatedSheet : s)),
        };
      });

      if (moveToNextRow) {
        setSelection((prev) => {
          const nextCoord = moveCellCoordinate(
            prev.activeCell,
            0,
            1,
            activeSheet.colCount,
            activeSheet.rowCount
          );
          return {
            ...prev,
            activeCell: nextCoord,
            anchorCell: nextCoord,
            range: null,
            isEditing: false,
            editValue: '',
          };
        });
      } else {
        setSelection((prev) => ({
          ...prev,
          isEditing: false,
          editValue: '',
        }));
      }
    },
    [activeCellAddress, selection.editValue, recordHistory, workbook, activeSheetId, activeSheet.colCount, activeSheet.rowCount]
  );

  /**
   * Cancel editing
   */
  const cancelEditing = useCallback(() => {
    setSelection((prev) => ({
      ...prev,
      isEditing: false,
      editValue: '',
    }));
  }, []);

  /**
   * Directly set a cell value (programmatic or task helper)
   */
  const setCellValue = useCallback(
    (col: string, row: number, rawValue: string) => {
      const addr = cellToAddress(col, row);
      recordHistory(workbook);

      setWorkbook((prev) => {
        const currentSheet = prev.sheets.find((s) => s.id === activeSheetId) || prev.sheets[0];
        const existingCell = currentSheet.cells[addr];

        const updatedCells: Record<string, CellData> = {
          ...currentSheet.cells,
          [addr]: {
            ...existingCell,
            raw: rawValue,
            computed: rawValue,
          },
        };

        const updatedSheet = recalculateWorksheet({
          ...currentSheet,
          cells: updatedCells,
        });

        return {
          ...prev,
          sheets: prev.sheets.map((s) => (s.id === updatedSheet.id ? updatedSheet : s)),
        };
      });
    },
    [activeSheetId, recordHistory, workbook]
  );

  /**
   * Clear cell contents (handles either active cell or entire selected range)
   */
  const clearCell = useCallback(() => {
    recordHistory(workbook);

    setWorkbook((prev) => {
      const currentSheet = prev.sheets.find((s) => s.id === activeSheetId) || prev.sheets[0];
      const updatedCells = { ...currentSheet.cells };

      if (selection.range) {
        const addrs = getAddressesInSelectionRange(selection.range);
        for (const a of addrs) {
          delete updatedCells[a];
        }
      } else {
        delete updatedCells[activeCellAddress];
      }

      const updatedSheet = recalculateWorksheet({
        ...currentSheet,
        cells: updatedCells,
      });

      return {
        ...prev,
        sheets: prev.sheets.map((s) => (s.id === updatedSheet.id ? updatedSheet : s)),
      };
    });

    setSelection((prev) => ({ ...prev, isEditing: false, editValue: '' }));
  }, [recordHistory, workbook, activeSheetId, selection.range, activeCellAddress]);

  /**
   * Toggle styling (Bold, Italic, Alignment, Currency)
   */
  const toggleStyle = useCallback(
    (stylePatch: Partial<CellStyle>) => {
      recordHistory(workbook);

      setWorkbook((prev) => {
        const currentSheet = prev.sheets.find((s) => s.id === activeSheetId) || prev.sheets[0];
        const targetAddresses = selection.range
          ? getAddressesInSelectionRange(selection.range)
          : [activeCellAddress];

        const updatedCells = { ...currentSheet.cells };

        for (const addr of targetAddresses) {
          const currentCell = updatedCells[addr] || { raw: '', computed: null };
          updatedCells[addr] = {
            ...currentCell,
            style: {
              ...currentCell.style,
              ...stylePatch,
            },
          };
        }

        return {
          ...prev,
          sheets: prev.sheets.map((s) =>
            s.id === currentSheet.id ? { ...currentSheet, cells: updatedCells } : s
          ),
        };
      });
    },
    [recordHistory, workbook, activeSheetId, selection.range, activeCellAddress]
  );

  /**
   * Copy action: captures single cell or range
   */
  const copyCell = useCallback(() => {
    const range: SelectionRange = selection.range || {
      startCol: selection.activeCell.col,
      startRow: selection.activeCell.row,
      endCol: selection.activeCell.col,
      endRow: selection.activeCell.row,
    };

    const addrs = getAddressesInSelectionRange(range);
    const copiedCells: Record<string, CellData> = {};

    for (const addr of addrs) {
      if (activeSheet.cells[addr]) {
        copiedCells[addr] = JSON.parse(JSON.stringify(activeSheet.cells[addr]));
      }
    }

    setClipboard({
      isCut: false,
      sourceSheetId: activeSheet.id,
      sourceRange: range,
      cells: copiedCells,
      baseCell: selection.activeCell,
    });

    setStatusMessage('Kopyalandı');
    setTimeout(() => setStatusMessage(null), 1200);
  }, [selection.range, selection.activeCell, activeSheet]);

  /**
   * Cut action
   */
  const cutCell = useCallback(() => {
    copyCell();
    setClipboard((prev) => (prev ? { ...prev, isCut: true } : null));
    setStatusMessage('Kesildi');
    setTimeout(() => setStatusMessage(null), 1200);
  }, [copyCell]);

  /**
   * Paste action: transports values and offsets relative formula references
   */
  const pasteCell = useCallback(() => {
    if (!clipboard) return;

    recordHistory(workbook);

    const baseColIdx = letterToColIndex(clipboard.sourceRange.startCol);
    const baseRow = clipboard.sourceRange.startRow;

    const targetColIdx = selection.activeCell.colIndex;
    const targetRow = selection.activeCell.row;

    const deltaCol = targetColIdx - baseColIdx;
    const deltaRow = targetRow - baseRow;

    setWorkbook((prev) => {
      let sourceSheet = prev.sheets.find((s) => s.id === clipboard.sourceSheetId);
      let targetSheet = prev.sheets.find((s) => s.id === activeSheetId) || prev.sheets[0];

      const newTargetCells = { ...targetSheet.cells };

      // Map copied cells to new target positions
      for (const [sourceAddr, cellData] of Object.entries(clipboard.cells)) {
        const parsed = addressToCell(sourceAddr);
        if (!parsed) continue;

        const newColIdx = parsed.colIndex + deltaCol;
        const newRow = parsed.row + deltaRow;

        if (newColIdx >= 0 && newColIdx < targetSheet.colCount && newRow >= 1 && newRow <= targetSheet.rowCount) {
          const destAddr = cellToAddress(newColIdx, newRow);
          let newRaw = cellData.raw;

          // If formula, offset relative references!
          if (newRaw.startsWith('=')) {
            newRaw = offsetFormula(newRaw, deltaCol, deltaRow);
          }

          newTargetCells[destAddr] = {
            ...cellData,
            raw: newRaw,
            computed: newRaw,
          };
        }
      }

      // If it was a cut, remove from source sheet
      let updatedSourceSheet = sourceSheet;
      if (clipboard.isCut && sourceSheet) {
        const sourceCells = { ...sourceSheet.cells };
        for (const sourceAddr of Object.keys(clipboard.cells)) {
          delete sourceCells[sourceAddr];
        }
        updatedSourceSheet = recalculateWorksheet({
          ...sourceSheet,
          cells: sourceCells,
        });
      }

      const recalculatedTarget = recalculateWorksheet({
        ...targetSheet,
        cells: newTargetCells,
      });

      return {
        ...prev,
        sheets: prev.sheets.map((s) => {
          if (updatedSourceSheet && s.id === updatedSourceSheet.id && s.id !== recalculatedTarget.id) {
            return updatedSourceSheet;
          }
          if (s.id === recalculatedTarget.id) {
            return recalculatedTarget;
          }
          return s;
        }),
      };
    });

    if (clipboard.isCut) {
      setClipboard(null);
    }

    setStatusMessage('Yapıştırıldı');
    setTimeout(() => setStatusMessage(null), 1200);
  }, [clipboard, recordHistory, workbook, selection.activeCell, activeSheetId]);

  /**
   * AutoSum convenience
   */
  const applyAutoSum = useCallback(() => {
    const col = selection.activeCell.col;
    const row = selection.activeCell.row;
    const startRow = Math.max(1, row - 5);
    const endRow = Math.max(1, row - 1);
    const formulaStr = `=TOPLA(${col}${startRow}:${col}${endRow})`;

    setCellValue(col, row, formulaStr);
  }, [selection.activeCell, setCellValue]);

  /**
   * Multi-Sheet Management
   */
  const switchSheet = useCallback((sheetId: string) => {
    setActiveSheetId(sheetId);
    setSelection({
      activeCell: { col: 'A', colIndex: 0, row: 1 },
      anchorCell: { col: 'A', colIndex: 0, row: 1 },
      range: null,
      isEditing: false,
      editValue: '',
    });
  }, []);

  const addSheet = useCallback((sheetName?: string) => {
    recordHistory(workbook);
    setWorkbook((prev) => {
      const newIndex = prev.sheets.length + 1;
      const name = sheetName || `Sayfa${newIndex}`;
      const newSheet = createEmptyWorksheet(`sheet_${Date.now()}`, name);
      return {
        ...prev,
        sheets: [...prev.sheets, newSheet],
        activeSheetId: newSheet.id,
      };
    });
  }, [recordHistory, workbook]);

  const renameSheet = useCallback(
    (sheetId: string, newName: string): boolean => {
      const trimmed = newName.trim();
      if (!trimmed) return false;

      // Check uniqueness
      if (workbook.sheets.some((s) => s.id !== sheetId && s.name.toLowerCase() === trimmed.toLowerCase())) {
        return false;
      }

      recordHistory(workbook);
      setWorkbook((prev) => ({
        ...prev,
        sheets: prev.sheets.map((s) => (s.id === sheetId ? { ...s, name: trimmed } : s)),
      }));

      setStatusMessage(`Sayfa adı '${trimmed}' yapıldı`);
      setTimeout(() => setStatusMessage(null), 1500);
      return true;
    },
    [recordHistory, workbook]
  );

  const deleteSheet = useCallback(
    (sheetId: string): boolean => {
      if (workbook.sheets.length <= 1) {
        setStatusMessage('En az bir çalışma sayfası kalmalıdır');
        setTimeout(() => setStatusMessage(null), 2000);
        return false;
      }

      recordHistory(workbook);

      setWorkbook((prev) => {
        const remaining = prev.sheets.filter((s) => s.id !== sheetId);
        const newActiveId =
          prev.activeSheetId === sheetId ? remaining[0].id : prev.activeSheetId;

        return {
          ...prev,
          sheets: remaining,
          activeSheetId: newActiveId,
        };
      });

      if (activeSheetId === sheetId) {
        const remaining = workbook.sheets.filter((s) => s.id !== sheetId);
        if (remaining.length > 0) {
          setActiveSheetId(remaining[0].id);
        }
      }

      setStatusMessage('Çalışma sayfası silindi');
      setTimeout(() => setStatusMessage(null), 1500);
      return true;
    },
    [workbook, recordHistory, activeSheetId]
  );

  /**
   * Save action (Ctrl+S)
   */
  const saveWorkbook = useCallback(() => {
    setStatusMessage('Çalışma kitabı kaydedildi');
    setTimeout(() => setStatusMessage(null), 2000);
  }, []);

  /**
   * Context Menu triggers
   */
  const openContextMenu = useCallback((x: number, y: number, cell: CellCoordinate) => {
    setContextMenu({
      isOpen: true,
      x,
      y,
      targetCell: cell,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * Reset spreadsheet
   */
  const resetWorkbook = useCallback((factory = initialWorkbookFactory) => {
    const fresh = factory();
    setWorkbook(fresh);
    setActiveSheetId(fresh.activeSheetId);
    setSelection({
      activeCell: { col: 'B', colIndex: 1, row: 7 },
      anchorCell: { col: 'B', colIndex: 1, row: 7 },
      range: null,
      isEditing: false,
      editValue: '',
    });
    undoStackRef.current = [];
    redoStackRef.current = [];
    setStatusMessage('Tablo sıfırlandı');
    setTimeout(() => setStatusMessage(null), 1500);
  }, [initialWorkbookFactory]);

  /**
   * Programmatic inspection API for lesson tasks & validation
   */
  const getActiveCellAddress = useCallback(() => activeCellAddress, [activeCellAddress]);
  const getCellRaw = useCallback(
    (addr: string) => activeSheet.cells[addr]?.raw || '',
    [activeSheet]
  );
  const getCellComputed = useCallback(
    (addr: string) => activeSheet.cells[addr]?.computed ?? null,
    [activeSheet]
  );
  const hasFormula = useCallback(
    (addr: string) => (activeSheet.cells[addr]?.raw || '').startsWith('='),
    [activeSheet]
  );
  const getSelectedRange = useCallback(() => selection.range, [selection.range]);

  return {
    workbook,
    activeSheet,
    activeSheetId,
    selection,
    activeCellAddress,
    activeCellData,
    contextMenu,
    clipboard,
    statusMessage,
    canUndo: undoStackRef.current.length > 0,
    canRedo: redoStackRef.current.length > 0,
    undo,
    redo,
    selectCell,
    selectAll,
    startEditing,
    updateEditValue,
    commitEditing,
    cancelEditing,
    setCellValue,
    clearCell,
    toggleStyle,
    copyCell,
    cutCell,
    pasteCell,
    applyAutoSum,
    switchSheet,
    addSheet,
    renameSheet,
    deleteSheet,
    saveWorkbook,
    openContextMenu,
    closeContextMenu,
    resetWorkbook,
    setSelection,
    jumpToAddress,
    // Inspection API
    getActiveCellAddress,
    getCellRaw,
    getCellComputed,
    hasFormula,
    getSelectedRange,
  };
}
