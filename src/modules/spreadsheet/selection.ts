/**
 * Selection and range helpers for Excel Akademi AI
 */

import { colIndexToLetter, letterToColIndex } from '../../utils/cellAddress.ts';
import type { CellCoordinate, SelectionRange } from './types.ts';

export function moveCellCoordinate(
  current: CellCoordinate,
  deltaCol: number,
  deltaRow: number,
  maxCols: number,
  maxRows: number
): CellCoordinate {
  const newColIndex = Math.max(0, Math.min(maxCols - 1, current.colIndex + deltaCol));
  const newRow = Math.max(1, Math.min(maxRows, current.row + deltaRow));

  return {
    col: colIndexToLetter(newColIndex),
    colIndex: newColIndex,
    row: newRow,
  };
}

export function createSelectionRange(
  start: CellCoordinate,
  end: CellCoordinate
): SelectionRange {
  const minCol = Math.min(start.colIndex, end.colIndex);
  const maxCol = Math.max(start.colIndex, end.colIndex);
  const minRow = Math.min(start.row, end.row);
  const maxRow = Math.max(start.row, end.row);

  return {
    startCol: colIndexToLetter(minCol),
    startRow: minRow,
    endCol: colIndexToLetter(maxCol),
    endRow: maxRow,
  };
}

export function isCoordinateWithinRange(
  coord: CellCoordinate,
  range: SelectionRange | null
): boolean {
  if (!range) return false;
  const colIdx = coord.colIndex;
  const startColIdx = letterToColIndex(range.startCol);
  const endColIdx = letterToColIndex(range.endCol);

  return (
    colIdx >= startColIdx &&
    colIdx <= endColIdx &&
    coord.row >= range.startRow &&
    coord.row <= range.endRow
  );
}

export function formatRangeAddress(range: SelectionRange | null, active: CellCoordinate): string {
  if (!range) return `${active.col}${active.row}`;
  if (range.startCol === range.endCol && range.startRow === range.endRow) {
    return `${range.startCol}${range.startRow}`;
  }
  return `${range.startCol}${range.startRow}:${range.endCol}${range.endRow}`;
}

export function getAddressesInSelectionRange(range: SelectionRange): string[] {
  const startColIdx = letterToColIndex(range.startCol);
  const endColIdx = letterToColIndex(range.endCol);
  const minCol = Math.min(startColIdx, endColIdx);
  const maxCol = Math.max(startColIdx, endColIdx);
  const minRow = Math.min(range.startRow, range.endRow);
  const maxRow = Math.max(range.startRow, range.endRow);

  const addrs: string[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      addrs.push(`${colIndexToLetter(c)}${r}`);
    }
  }
  return addrs;
}

export function isCellOnRangeBorder(
  coord: CellCoordinate,
  range: SelectionRange | null
): { isInside: boolean; top: boolean; right: boolean; bottom: boolean; left: boolean } {
  if (!range) {
    return { isInside: false, top: false, right: false, bottom: false, left: false };
  }

  const startColIdx = letterToColIndex(range.startCol);
  const endColIdx = letterToColIndex(range.endCol);
  const minCol = Math.min(startColIdx, endColIdx);
  const maxCol = Math.max(startColIdx, endColIdx);
  const minRow = Math.min(range.startRow, range.endRow);
  const maxRow = Math.max(range.startRow, range.endRow);

  const isInside =
    coord.colIndex >= minCol &&
    coord.colIndex <= maxCol &&
    coord.row >= minRow &&
    coord.row <= maxRow;

  if (!isInside) {
    return { isInside: false, top: false, right: false, bottom: false, left: false };
  }

  return {
    isInside: true,
    top: coord.row === minRow,
    bottom: coord.row === maxRow,
    left: coord.colIndex === minCol,
    right: coord.colIndex === maxCol,
  };
}

