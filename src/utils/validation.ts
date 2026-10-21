/**
 * Validation and formatting utilities for Excel values and expressions
 */

export function isNumeric(val: unknown): val is number {
  if (typeof val === 'number') return !isNaN(val) && isFinite(val);
  if (typeof val === 'string' && val.trim() !== '') {
    const num = Number(val.replace(',', '.'));
    return !isNaN(num) && isFinite(num);
  }
  return false;
}

export function parseNumeric(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const num = Number(val.replace(',', '.'));
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

export function formatCellValue(
  value: unknown,
  format: 'general' | 'currency' | 'number' | 'percentage' = 'general'
): string {
  if (value === null || value === undefined || value === '') return '';

  if (isNumeric(value)) {
    const num = parseNumeric(value);
    if (format === 'currency') {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
      }).format(num);
    }
    if (format === 'percentage') {
      return `%${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(num * 100)}`;
    }
    if (format === 'number') {
      return new Intl.NumberFormat('tr-TR').format(num);
    }
    return String(num);
  }

  return String(value);
}

export function isFormula(value: string): boolean {
  return typeof value === 'string' && value.trim().startsWith('=');
}

export function normalizeFormula(formula: string): string {
  return formula
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}
