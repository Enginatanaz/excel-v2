/**
 * Cell address utilities for Excel Akademi AI
 * Converts between 0-indexed column numbers and Excel letters (A, B, C... AA, AB...)
 */

export function colIndexToLetter(colIndex: number): string {
  let letter = '';
  let temp = colIndex;

  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }

  return letter;
}

export function letterToColIndex(letter: string): number {
  const upper = letter.toUpperCase();
  let index = 0;

  for (let i = 0; i < upper.length; i++) {
    index = index * 26 + (upper.charCodeAt(i) - 64);
  }

  return index - 1;
}

export function cellToAddress(col: number | string, row: number): string {
  const colLetter = typeof col === 'number' ? colIndexToLetter(col) : col.toUpperCase();
  return `${colLetter}${row}`;
}

export function addressToCell(address: string): { col: string; colIndex: number; row: number } | null {
  const match = address.trim().toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  if (!match) return null;

  const col = match[1];
  const row = parseInt(match[2], 10);
  const colIndex = letterToColIndex(col);

  if (isNaN(row) || row <= 0 || colIndex < 0) return null;

  return { col, colIndex, row };
}

export interface CellRange {
  startCol: string;
  startColIndex: number;
  startRow: number;
  endCol: string;
  endColIndex: number;
  endRow: number;
}

export function parseRange(rangeStr: string): CellRange | null {
  const parts = rangeStr.split(':').map((s) => s.trim().toUpperCase());
  if (parts.length === 1) {
    const single = addressToCell(parts[0]);
    if (!single) return null;
    return {
      startCol: single.col,
      startColIndex: single.colIndex,
      startRow: single.row,
      endCol: single.col,
      endColIndex: single.colIndex,
      endRow: single.row,
    };
  }

  if (parts.length === 2) {
    const start = addressToCell(parts[0]);
    const end = addressToCell(parts[1]);
    if (!start || !end) return null;

    const minColIndex = Math.min(start.colIndex, end.colIndex);
    const maxColIndex = Math.max(start.colIndex, end.colIndex);
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);

    return {
      startCol: colIndexToLetter(minColIndex),
      startColIndex: minColIndex,
      startRow: minRow,
      endCol: colIndexToLetter(maxColIndex),
      endColIndex: maxColIndex,
      endRow: maxRow,
    };
  }

  return null;
}

export function isCellInRange(col: string, row: number, range: CellRange): boolean {
  const colIdx = letterToColIndex(col);
  return (
    colIdx >= range.startColIndex &&
    colIdx <= range.endColIndex &&
    row >= range.startRow &&
    row <= range.endRow
  );
}

export function getAddressesInRange(range: CellRange): string[] {
  const addresses: string[] = [];
  for (let r = range.startRow; r <= range.endRow; r++) {
    for (let c = range.startColIndex; c <= range.endColIndex; c++) {
      addresses.push(cellToAddress(c, r));
    }
  }
  return addresses;
}

export interface ParsedCellRef {
  raw: string;
  col: string;
  colIndex: number;
  row: number;
  isColAbsolute: boolean;
  isRowAbsolute: boolean;
}

/**
 * Parses cell references like A1, $A$1, $A1, A$1
 */
export function parseCellReference(refStr: string): ParsedCellRef | null {
  const match = refStr.trim().toUpperCase().match(/^(\$?)([A-Z]+)(\$?)([0-9]+)$/);
  if (!match) return null;

  const isColAbsolute = match[1] === '$';
  const col = match[2];
  const isRowAbsolute = match[3] === '$';
  const row = parseInt(match[4], 10);
  const colIndex = letterToColIndex(col);

  if (isNaN(row) || row <= 0 || colIndex < 0) return null;

  return {
    raw: refStr,
    col,
    colIndex,
    row,
    isColAbsolute,
    isRowAbsolute,
  };
}

/**
 * Offsets a formula string when copying/pasting across rows/columns.
 * Relative references are offset by deltaCol and deltaRow.
 * Absolute references ($A$1) are preserved.
 */
export function offsetFormula(formula: string, deltaCol: number, deltaRow: number): string {
  if (!formula.startsWith('=')) return formula;

  // Pattern matches potential cell references or ranges: e.g. $A$1, B2, $B2:C$10
  // Avoid matching inside string literals e.g. "Yüksek"
  let result = '=';
  let inString = false;
  let buffer = '';

  const expr = formula.slice(1);

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];

    if (char === '"') {
      if (inString) {
        // String ended
        result += buffer + '"';
        buffer = '';
        inString = false;
        continue;
      } else {
        // Process buffer before string
        result += processFormulaToken(buffer, deltaCol, deltaRow);
        buffer = '';
        inString = true;
        result += '"';
        continue;
      }
    }

    if (inString) {
      result += char;
    } else {
      buffer += char;
    }
  }

  if (buffer) {
    result += processFormulaToken(buffer, deltaCol, deltaRow);
  }

  return result;
}

function processFormulaToken(token: string, deltaCol: number, deltaRow: number): string {
  // Replace cell references: ($?[A-Z]+$?[0-9]+)
  return token.replace(/(\$?)([A-Z]+)(\$?)([0-9]+)/gi, (match, colDollar, colLetters, rowDollar, rowDigits) => {
    const isColAbs = colDollar === '$';
    const isRowAbs = rowDollar === '$';
    const currentColIndex = letterToColIndex(colLetters.toUpperCase());
    const currentRow = parseInt(rowDigits, 10);

    let targetColStr = colLetters.toUpperCase();
    if (!isColAbs) {
      const newColIndex = currentColIndex + deltaCol;
      if (newColIndex < 0) return '#BAŞV!';
      targetColStr = colIndexToLetter(newColIndex);
    }

    let targetRowStr = rowDigits;
    if (!isRowAbs) {
      const newRow = currentRow + deltaRow;
      if (newRow < 1) return '#BAŞV!';
      targetRowStr = String(newRow);
    }

    return `${isColAbs ? '$' : ''}${targetColStr}${isRowAbs ? '$' : ''}${targetRowStr}`;
  });
}
