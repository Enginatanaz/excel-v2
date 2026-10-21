/**
 * Initial state and factory for spreadsheets in Excel Akademi AI
 */

import { recalculateWorksheet } from './formulaEngine.ts';
import type { Workbook, Worksheet, CellData } from './types.ts';

export const DEFAULT_ROW_COUNT = 25;
export const DEFAULT_COL_COUNT = 10; // A to J

export function createEmptyWorksheet(id: string, name: string): Worksheet {
  return {
    id,
    name,
    cells: {},
    rowCount: DEFAULT_ROW_COUNT,
    colCount: DEFAULT_COL_COUNT,
  };
}

/**
 * Creates the sample sales table required for the lesson and interactive workbench:
 * A1: Ürün, B1: Satış tutarı
 * A2: Mouse, B2: 350
 * A3: Klavye, B3: 450
 * A4: Ekran, B4: 1200
 * A5: Kamera, B5: 650
 * A6: Kulaklık, B6: 400
 * A7: Toplam, B7: [boş]
 */
export function createSampleSalesWorksheet(): Worksheet {
  const initialCells: Record<string, CellData> = {
    A1: { raw: 'Ürün', computed: 'Ürün', style: { bold: true, align: 'left', backgroundColor: '#f1f5f9' } },
    B1: { raw: 'Satış tutarı', computed: 'Satış tutarı', style: { bold: true, align: 'right', backgroundColor: '#f1f5f9' } },
    A2: { raw: 'Mouse', computed: 'Mouse', style: { align: 'left' } },
    B2: { raw: '350', computed: 350, style: { align: 'right', format: 'currency' } },
    A3: { raw: 'Klavye', computed: 'Klavye', style: { align: 'left' } },
    B3: { raw: '450', computed: 450, style: { align: 'right', format: 'currency' } },
    A4: { raw: 'Ekran', computed: 'Ekran', style: { align: 'left' } },
    B4: { raw: '1200', computed: 1200, style: { align: 'right', format: 'currency' } },
    A5: { raw: 'Kamera', computed: 'Kamera', style: { align: 'left' } },
    B5: { raw: '650', computed: 650, style: { align: 'right', format: 'currency' } },
    A6: { raw: 'Kulaklık', computed: 'Kulaklık', style: { align: 'left' } },
    B6: { raw: '400', computed: 400, style: { align: 'right', format: 'currency' } },
    A7: { raw: 'Toplam', computed: 'Toplam', style: { bold: true, align: 'left' } },
    B7: { raw: '', computed: null, style: { bold: true, align: 'right', format: 'currency' } },
  };

  const sheet: Worksheet = {
    id: 'sheet_sales',
    name: 'Satış Raporu',
    cells: initialCells,
    rowCount: DEFAULT_ROW_COUNT,
    colCount: DEFAULT_COL_COUNT,
  };

  return recalculateWorksheet(sheet);
}

export const createSalesWorksheet = createSampleSalesWorksheet;

export function createDefaultWorkbook(): Workbook {
  const salesSheet = createSampleSalesWorksheet();
  const blankSheet = createEmptyWorksheet('sheet_2', 'Sayfa2');

  return {
    id: 'wb_default',
    name: 'Alıştırma_Çalışma_Kitabı.xlsx',
    sheets: [salesSheet, blankSheet],
    activeSheetId: salesSheet.id,
  };
}

export function createMonthlyExpensesWorksheet(): Worksheet {
  const initialCells: Record<string, CellData> = {
    A1: { raw: 'Gider Türü', computed: 'Gider Türü', style: { bold: true, align: 'left', backgroundColor: '#f1f5f9' } },
    B1: { raw: 'Tutar (₺)', computed: 'Tutar (₺)', style: { bold: true, align: 'right', backgroundColor: '#f1f5f9' } },
    A2: { raw: 'Ofis Kirası', computed: 'Ofis Kirası', style: { align: 'left' } },
    B2: { raw: '2500', computed: 2500, style: { align: 'right', format: 'currency' } },
    A3: { raw: 'Elektrik & Su', computed: 'Elektrik & Su', style: { align: 'left' } },
    B3: { raw: '450', computed: 450, style: { align: 'right', format: 'currency' } },
    A4: { raw: 'İnternet & Telefon', computed: 'İnternet & Telefon', style: { align: 'left' } },
    B4: { raw: '250', computed: 250, style: { align: 'right', format: 'currency' } },
    A5: { raw: 'Yemek & Mutfak', computed: 'Yemek & Mutfak', style: { align: 'left' } },
    B5: { raw: '800', computed: 800, style: { align: 'right', format: 'currency' } },
    A6: { raw: 'Kırtasiye', computed: 'Kırtasiye', style: { align: 'left' } },
    B6: { raw: '350', computed: 350, style: { align: 'right', format: 'currency' } },
    A7: { raw: 'Genel Toplam', computed: 'Genel Toplam', style: { bold: true, align: 'left' } },
    B7: { raw: '', computed: null, style: { bold: true, align: 'right', format: 'currency' } },
  };

  const sheet: Worksheet = {
    id: 'sheet_expenses',
    name: 'Aylık Gider Raporu',
    cells: initialCells,
    rowCount: DEFAULT_ROW_COUNT,
    colCount: DEFAULT_COL_COUNT,
  };

  return recalculateWorksheet(sheet);
}

export function createIndependentPracticeWorkbook(): Workbook {
  const expenseSheet = createMonthlyExpensesWorksheet();
  return {
    id: 'wb_independent_practice',
    name: 'Bağımsız_Uygulama_Giderler.xlsx',
    sheets: [expenseSheet],
    activeSheetId: expenseSheet.id,
  };
}
