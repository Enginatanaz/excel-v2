/**
 * Type definitions for the Excel Akademi spreadsheet core
 */

export type HorizontalAlignment = 'left' | 'center' | 'right';
export type NumberFormat = 'general' | 'currency' | 'number' | 'percentage';

export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  align?: HorizontalAlignment;
  format?: NumberFormat;
  textColor?: string;
  backgroundColor?: string;
}

export interface CellData {
  raw: string; // The user input or formula e.g. "=TOPLA(B2:B6)" or "Mouse" or "350"
  computed: string | number | null; // Evaluated display value
  style?: CellStyle;
  error?: string; // e.g. "#HATA!", "#DEĞER!"
}

export interface CellCoordinate {
  col: string;
  colIndex: number;
  row: number; // 1-indexed
}

export interface Worksheet {
  id: string;
  name: string;
  cells: Record<string, CellData>; // key: e.g. "A1", "B7"
  rowCount: number;
  colCount: number;
}

export interface Workbook {
  id: string;
  name: string;
  sheets: Worksheet[];
  activeSheetId: string;
}

export interface SelectionRange {
  startCol: string;
  startRow: number;
  endCol: string;
  endRow: number;
}

export interface SelectionState {
  activeCell: CellCoordinate;
  anchorCell?: CellCoordinate;
  range: SelectionRange | null;
  isEditing: boolean;
  editValue: string;
}

export interface ClipboardData {
  isCut: boolean;
  sourceSheetId: string;
  sourceRange: SelectionRange;
  cells: Record<string, CellData>; // relative to sourceRange.startCol & startRow
  baseCell: CellCoordinate;
}

export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  targetCell: CellCoordinate | null;
}

