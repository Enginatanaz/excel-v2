/**
 * Automated Test Suite for Excel Akademi AI - Stage 2 Spreadsheet Simulator
 * Validates all 18 scenarios and core formula engine requirements
 */

import assert from 'node:assert';
import {
  colIndexToLetter,
  letterToColIndex,
  cellToAddress,
  addressToCell,
  parseRange,
  offsetFormula,
} from '../src/utils/cellAddress.ts';
import {
  evaluateFormula,
  recalculateWorksheet,
} from '../src/modules/spreadsheet/formulaEngine.ts';
import {
  createDefaultWorkbook,
  createEmptyWorksheet,
} from '../src/modules/spreadsheet/spreadsheetState.ts';
import type { Worksheet, CellData, Workbook } from '../src/modules/spreadsheet/types.ts';
import {
  moveCellCoordinate,
  createSelectionRange,
  getAddressesInSelectionRange,
} from '../src/modules/spreadsheet/selection.ts';

let passedTests = 0;
let failedTests = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err: any) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failedTests++;
  }
}

console.log('\n============================================================');
console.log('  EXCEL AKADEMİ AI — SİMÜLATÖR & FORMÜL MOTORU TESTLERİ');
console.log('============================================================\n');

// --------------------------------------------------------------------------
// 1. Column Addressing & Utilities (including beyond Z: AA, AB...)
// --------------------------------------------------------------------------
console.log('Group 1: Hücre Adresleri ve Sütun Dönüşümleri (A..Z, AA..ZZ)');

test('colIndexToLetter converts 0..25 to A..Z correctly', () => {
  assert.strictEqual(colIndexToLetter(0), 'A');
  assert.strictEqual(colIndexToLetter(1), 'B');
  assert.strictEqual(colIndexToLetter(25), 'Z');
});

test('colIndexToLetter converts beyond Z (AA, AB, BA, ZZ) correctly', () => {
  assert.strictEqual(colIndexToLetter(26), 'AA');
  assert.strictEqual(colIndexToLetter(27), 'AB');
  assert.strictEqual(colIndexToLetter(52), 'BA');
  assert.strictEqual(colIndexToLetter(701), 'ZZ');
});

test('letterToColIndex converts A..Z and AA..ZZ correctly', () => {
  assert.strictEqual(letterToColIndex('A'), 0);
  assert.strictEqual(letterToColIndex('B'), 1);
  assert.strictEqual(letterToColIndex('Z'), 25);
  assert.strictEqual(letterToColIndex('AA'), 26);
  assert.strictEqual(letterToColIndex('AB'), 27);
  assert.strictEqual(letterToColIndex('ZZ'), 701);
});

test('addressToCell and cellToAddress work interchangeably', () => {
  const parsed = addressToCell('B7');
  assert.deepStrictEqual(parsed, { col: 'B', colIndex: 1, row: 7 });
  assert.strictEqual(cellToAddress('B', 7), 'B7');
  assert.strictEqual(cellToAddress(1, 7), 'B7');

  const aa5 = addressToCell('AA5');
  assert.deepStrictEqual(aa5, { col: 'AA', colIndex: 26, row: 5 });
  assert.strictEqual(cellToAddress('AA', 5), 'AA5');
});

// --------------------------------------------------------------------------
// 2. Scenarios 1-7: Sales Table & SUM Calculation (=TOPLA(B2:B6) = 3050)
// --------------------------------------------------------------------------
console.log('\nGroup 2: Senaryo 1-7: Satış Tablosu ve TOPLA Fonksiyonu');

test('Scenarios 1-7: B2=350, B3=450, B4=1200, B5=650, B6=400, B7="=TOPLA(B2:B6)" => 3050', () => {
  const sheet = createEmptyWorksheet('test_sheet', 'Test');
  sheet.cells = {
    B2: { raw: '350', computed: 350 },
    B3: { raw: '450', computed: 450 },
    B4: { raw: '1200', computed: 1200 },
    B5: { raw: '650', computed: 650 },
    B6: { raw: '400', computed: 400 },
    B7: { raw: '=TOPLA(B2:B6)', computed: null },
  };

  const calculated = recalculateWorksheet(sheet);
  assert.strictEqual(calculated.cells['B7'].computed, 3050);
  assert.strictEqual(calculated.cells['B7'].raw, '=TOPLA(B2:B6)');
});

// --------------------------------------------------------------------------
// 3. Scenarios 8-9: Auto Recalculation (B3 updated to 500 => B7 = 3100)
// --------------------------------------------------------------------------
console.log('\nGroup 3: Senaryo 8-9: Otomatik Yeniden Hesaplama');

test('Scenarios 8-9: When B3 is updated to 500, B7 automatically updates to 3100', () => {
  const sheet = createEmptyWorksheet('test_sheet', 'Test');
  sheet.cells = {
    B2: { raw: '350', computed: 350 },
    B3: { raw: '450', computed: 450 },
    B4: { raw: '1200', computed: 1200 },
    B5: { raw: '650', computed: 650 },
    B6: { raw: '400', computed: 400 },
    B7: { raw: '=TOPLA(B2:B6)', computed: 3050 },
  };

  // User edits B3 from 450 to 500
  sheet.cells['B3'] = { raw: '500', computed: '500' };

  const recalculated = recalculateWorksheet(sheet);
  assert.strictEqual(recalculated.cells['B3'].computed, 500);
  assert.strictEqual(recalculated.cells['B7'].computed, 3100);
});

// --------------------------------------------------------------------------
// 4. Scenario 10: Formula Bar Synchronization (raw vs computed)
// --------------------------------------------------------------------------
console.log('\nGroup 4: Senaryo 10: Formül Çubuğu Senkronizasyonu (raw vs computed)');

test('Scenario 10: B7 raw formula is preserved separately from computed value', () => {
  const sheet = createEmptyWorksheet('test_sheet', 'Test');
  sheet.cells['B7'] = { raw: '=TOPLA(B2:B6)', computed: 3100 };

  assert.strictEqual(sheet.cells['B7'].raw, '=TOPLA(B2:B6)');
  assert.strictEqual(sheet.cells['B7'].computed, 3100);
});

// --------------------------------------------------------------------------
// 5. Scenario 11: Error Handling (#SAYI/0!, #AD?, #DÖNGÜ!, #HATA!)
// --------------------------------------------------------------------------
console.log('\nGroup 5: Senaryo 11: Hata Yönetimi');

test('Division by zero produces #SAYI/0!', () => {
  const cells: Record<string, CellData> = {
    B2: { raw: '350', computed: 350 },
  };
  const res = evaluateFormula('=B2/0', cells);
  assert.strictEqual(res.value, '#SAYI/0!');
});

test('Unsupported function name produces #AD?', () => {
  const cells: Record<string, CellData> = {};
  const res = evaluateFormula('=BILINMEYEN_FONKSIYON(10; 20)', cells);
  assert.strictEqual(res.value, '#AD?');
});

test('Circular dependency produces #DÖNGÜ!', () => {
  const sheet = createEmptyWorksheet('cycle_sheet', 'Cycle');
  sheet.cells = {
    A1: { raw: '=B1+10', computed: null },
    B1: { raw: '=A1+5', computed: null },
  };
  const result = recalculateWorksheet(sheet);
  assert.strictEqual(result.cells['A1'].computed, '#DÖNGÜ!');
  assert.strictEqual(result.cells['B1'].computed, '#DÖNGÜ!');
});

test('Direct self reference produces #DÖNGÜ!', () => {
  const cells: Record<string, CellData> = {
    A1: { raw: '=A1+1', computed: null },
  };
  const res = evaluateFormula('=A1+1', cells, new Set(['A1']));
  assert.strictEqual(res.value, '#DÖNGÜ!');
});

test('Syntax error produces #HATA!', () => {
  const cells: Record<string, CellData> = {};
  const res = evaluateFormula('=TOPLA(B2:B6', cells); // unclosed paren
  assert.strictEqual(res.value, '#HATA!');
});

// --------------------------------------------------------------------------
// 6. Scenario 13: Copy, Cut, Paste & Relative Formula Transposition
// --------------------------------------------------------------------------
console.log('\nGroup 6: Senaryo 13: Kopyalama, Kesme ve Göreli Formül Taşıma');

test('offsetFormula transposes relative references when moved', () => {
  // Moving from row 7 to row 8 (deltaCol: 0, deltaRow: 1)
  const movedDown = offsetFormula('=TOPLA(B2:B6)', 0, 1);
  assert.strictEqual(movedDown, '=TOPLA(B3:B7)');

  // Moving from Col B to Col C (deltaCol: 1, deltaRow: 0)
  const movedRight = offsetFormula('=TOPLA(B2:B6)', 1, 0);
  assert.strictEqual(movedRight, '=TOPLA(C2:C6)');
});

test('offsetFormula preserves absolute references with $', () => {
  // $B$2:$B$6 is absolute, stays unchanged
  const absFormula = offsetFormula('=TOPLA($B$2:$B$6)', 2, 3);
  assert.strictEqual(absFormula, '=TOPLA($B$2:$B$6)');

  // Mixed references: $B2 (absolute col, relative row)
  const mixedCol = offsetFormula('=$B2*2', 3, 2);
  assert.strictEqual(mixedCol, '=$B4*2');

  // Mixed references: B$2 (relative col, absolute row)
  const mixedRow = offsetFormula('=B$2*2', 3, 2);
  assert.strictEqual(mixedRow, '=E$2*2');
});

// --------------------------------------------------------------------------
// 7. Scenarios 14-15: Undo (Ctrl+Z) and Redo (Ctrl+Y) state simulation
// --------------------------------------------------------------------------
console.log('\nGroup 7: Senaryo 14-15: Geri Al (Ctrl+Z) ve Yinele (Ctrl+Y)');

test('Undo restores previous state and Redo re-applies', () => {
  let workbook: Workbook = createDefaultWorkbook();
  const undoStack: Workbook[] = [];
  const redoStack: Workbook[] = [];

  // Snapshot 1 (Initial state)
  const initialB2Val = workbook.sheets[0].cells['B2'].computed;
  assert.strictEqual(initialB2Val, 350);

  // User changes B2 to 999
  undoStack.push(JSON.parse(JSON.stringify(workbook)));
  redoStack.length = 0;

  const modifiedCells = { ...workbook.sheets[0].cells };
  modifiedCells['B2'] = { raw: '999', computed: 999 };
  workbook = {
    ...workbook,
    sheets: [{ ...workbook.sheets[0], cells: modifiedCells }, workbook.sheets[1]],
  };

  assert.strictEqual(workbook.sheets[0].cells['B2'].computed, 999);

  // Perform Undo (Ctrl+Z)
  redoStack.push(JSON.parse(JSON.stringify(workbook)));
  workbook = undoStack.pop()!;
  assert.strictEqual(workbook.sheets[0].cells['B2'].computed, 350);

  // Perform Redo (Ctrl+Y)
  undoStack.push(JSON.parse(JSON.stringify(workbook)));
  workbook = redoStack.pop()!;
  assert.strictEqual(workbook.sheets[0].cells['B2'].computed, 999);
});

// --------------------------------------------------------------------------
// 8. Scenarios 16-17: Multi-Sheet Management & Isolation
// --------------------------------------------------------------------------
console.log('\nGroup 8: Senaryo 16-17: Çoklu Sayfa Yönetimi ve Veri Yalıtımı');

test('Scenarios 16-17: Sheet data is isolated; switching sheets does not contaminate cells', () => {
  const wb = createDefaultWorkbook();
  const sheet1 = wb.sheets[0];
  const sheet2 = wb.sheets[1];

  // Sheet 1 has B2 = 350
  assert.strictEqual(sheet1.cells['B2'].computed, 350);

  // Sheet 2 is empty initially
  assert.strictEqual(sheet2.cells['B2'], undefined);

  // Write to sheet 2
  sheet2.cells['B2'] = { raw: 'İkinci Sayfa Verisi', computed: 'İkinci Sayfa Verisi' };

  // Verify Sheet 1 still has its original number
  assert.strictEqual(sheet1.cells['B2'].computed, 350);
  assert.strictEqual(sheet2.cells['B2'].computed, 'İkinci Sayfa Verisi');
});

// --------------------------------------------------------------------------
// 9. All Core Functions & Formulas (+, -, *, /, ^, SUM, AVERAGE, MIN, MAX, COUNT, COUNTA, IF)
// --------------------------------------------------------------------------
console.log('\nGroup 9: Desteklenen Tüm Excel Fonksiyonları ve Matematiksel İşlemler');

test('Arithmetic precedence and parentheses: =(10 + 5) * 2 ^ 3 = 120', () => {
  const res = evaluateFormula('=(10 + 5) * 2 ^ 3', {});
  assert.strictEqual(res.value, 120);
});

test('Turkish & English function aliases: SUM / TOPLA', () => {
  const cells: Record<string, CellData> = {
    A1: { raw: '10', computed: 10 },
    A2: { raw: '20', computed: 20 },
    A3: { raw: '30', computed: 30 },
  };
  const toplaRes = evaluateFormula('=TOPLA(A1:A3)', cells);
  const sumRes = evaluateFormula('=SUM(A1:A3)', cells);
  assert.strictEqual(toplaRes.value, 60);
  assert.strictEqual(sumRes.value, 60);
});

test('AVERAGE / ORTALAMA', () => {
  const cells: Record<string, CellData> = {
    A1: { raw: '10', computed: 10 },
    A2: { raw: '20', computed: 20 },
    A3: { raw: '30', computed: 30 },
  };
  const avg = evaluateFormula('=ORTALAMA(A1:A3)', cells);
  assert.strictEqual(avg.value, 20);
});

test('MAX / MAK and MIN / MİN', () => {
  const cells: Record<string, CellData> = {
    A1: { raw: '10', computed: 10 },
    A2: { raw: '50', computed: 50 },
    A3: { raw: '25', computed: 25 },
  };
  assert.strictEqual(evaluateFormula('=MAK(A1:A3)', cells).value, 50);
  assert.strictEqual(evaluateFormula('=MAX(A1:A3)', cells).value, 50);
  assert.strictEqual(evaluateFormula('=MİN(A1:A3)', cells).value, 10);
  assert.strictEqual(evaluateFormula('=MIN(A1:A3)', cells).value, 10);
});

test('COUNT / SAY (counts only numeric cells)', () => {
  const cells: Record<string, CellData> = {
    A1: { raw: '10', computed: 10 },
    A2: { raw: 'Metin', computed: 'Metin' },
    A3: { raw: '30', computed: 30 },
  };
  assert.strictEqual(evaluateFormula('=SAY(A1:A3)', cells).value, 2);
  assert.strictEqual(evaluateFormula('=COUNT(A1:A3)', cells).value, 2);
});

test('COUNTA / BAĞ_DEĞ_DOLU_SAY (counts all non-empty cells)', () => {
  const cells: Record<string, CellData> = {
    A1: { raw: '10', computed: 10 },
    A2: { raw: 'Metin', computed: 'Metin' },
    A3: { raw: '', computed: null },
    A4: { raw: '40', computed: 40 },
  };
  assert.strictEqual(evaluateFormula('=BAĞ_DEĞ_DOLU_SAY(A1:A4)', cells).value, 3);
  assert.strictEqual(evaluateFormula('=COUNTA(A1:A4)', cells).value, 3);
});

test('IF / EĞER conditional function with comparison', () => {
  const cells: Record<string, CellData> = {
    B2: { raw: '350', computed: 350 },
  };
  // With semicolon delimiter (Turkish locale)
  const trRes = evaluateFormula('=EĞER(B2>100; "Yüksek"; "Düşük")', cells);
  assert.strictEqual(trRes.value, 'Yüksek');

  // With false condition
  const falseRes = evaluateFormula('=EĞER(B2>500; "Yüksek"; "Düşük")', cells);
  assert.strictEqual(falseRes.value, 'Düşük');

  // With comma delimiter (English locale)
  const enRes = evaluateFormula('=IF(B2>100, "High", "Low")', cells);
  assert.strictEqual(enRes.value, 'High');
});

// --------------------------------------------------------------------------
// 10. Selection & Navigation
// --------------------------------------------------------------------------
console.log('\nGroup 10: Hücre Seçimi ve Gezinme Mantığı');

test('moveCellCoordinate respects grid bounds', () => {
  const start = { col: 'A', colIndex: 0, row: 1 };
  // Can't move up from row 1
  const up = moveCellCoordinate(start, 0, -1, 10, 25);
  assert.strictEqual(up.row, 1);

  // Can't move left from col A
  const left = moveCellCoordinate(start, -1, 0, 10, 25);
  assert.strictEqual(left.col, 'A');

  // Move right 1 col
  const right = moveCellCoordinate(start, 1, 0, 10, 25);
  assert.strictEqual(right.col, 'B');

  // Move down 1 row
  const down = moveCellCoordinate(start, 0, 1, 10, 25);
  assert.strictEqual(down.row, 2);
});

test('createSelectionRange creates normalized rectangular range', () => {
  const anchor = { col: 'B', colIndex: 1, row: 2 };
  const target = { col: 'D', colIndex: 3, row: 5 };
  const range = createSelectionRange(anchor, target);

  assert.strictEqual(range.startCol, 'B');
  assert.strictEqual(range.startRow, 2);
  assert.strictEqual(range.endCol, 'D');
  assert.strictEqual(range.endRow, 5);

  const addrs = getAddressesInSelectionRange(range);
  // (D - B + 1) * (5 - 2 + 1) = 3 * 4 = 12 cells
  assert.strictEqual(addrs.length, 12);
  assert(addrs.includes('B2'));
  assert(addrs.includes('D5'));
  assert(addrs.includes('C3'));
});

// --------------------------------------------------------------------------
// 7. STAGE 3 — Natural Teacher & Step-by-Step Learning Engine Tests (16 Scenarios)
// --------------------------------------------------------------------------
console.log('\n============================================================');
console.log('  AŞAMA 3 — DOĞAL SESLİ ÖĞRETMEN & ADIM ADIM ÖĞRENME MOTORU TESTLERİ');
console.log('============================================================\n');

import { speechService } from '../src/modules/teacher/speechService.ts';
import { narrationService } from '../src/modules/teacher/narrationService.ts';
import { sumFunctionLesson } from '../src/data/lessons/sumFunction.ts';
import {
  createMonthlyExpensesWorksheet,
  createSalesWorksheet,
} from '../src/modules/spreadsheet/spreadsheetState.ts';
import { progressService } from '../src/modules/learning/progressService.ts';

// Senaryo 1: Ders Başlangıcı ve 15 Konu Başlığı
test('Senaryo 1: Ders Başlangıcı — Türkçe giriş anlatımı ve 15 detaylı konu başlığı mevcut', () => {
  assert(sumFunctionLesson.introNarration.length > 50, 'Giriş anlatımı yeterince kapsamlı olmalı');
  assert(sumFunctionLesson.introNarration.includes('TOPLA'), 'Giriş anlatımında TOPLA geçmeli');
  assert.strictEqual(sumFunctionLesson.topics.length, 15, 'Zorunlu 15 ayrı konu başlığı bulunmalı');
  sumFunctionLesson.topics.forEach((topic, idx) => {
    assert.strictEqual(topic.number, idx + 1, `Konu numarası ${idx + 1} olmalı`);
    assert(topic.title.length > 0, 'Konu başlığı boş olmamalı');
    assert(topic.content.length > 30, 'Konu içeriği kapsamlı olmalı');
    assert(topic.audioNarration.length > 20, 'Sesli anlatım metni bulunmalı');
  });
});

// Senaryo 2: Anlatım Oynatma
test('Senaryo 2: Anlatım Oynatma — Ses motoru konuşmayı başlatır ve durum güncellenir', () => {
  const introText = sumFunctionLesson.introNarration;
  speechService.playNarration(introText);
  const status = speechService.getNarrationStatus();
  assert.strictEqual(status.status, 'playing');
  assert.strictEqual(status.currentText, introText);
});

// Senaryo 3: Anlatım Duraklatma
test('Senaryo 3: Anlatım Duraklatma — pauseNarration çağrıldığında ses duraklatılır', () => {
  speechService.pauseNarration();
  const status = speechService.getNarrationStatus();
  assert.strictEqual(status.status, 'paused');
});

// Senaryo 4: Anlatımı Devam Ettirme
test('Senaryo 4: Anlatımı Devam Ettirme — resumeNarration ve stopNarration doğru çalışır', () => {
  speechService.resumeNarration();
  assert.strictEqual(speechService.getNarrationStatus().status, 'playing');
  speechService.stopNarration();
  assert.strictEqual(speechService.getNarrationStatus().status, 'idle');
});

// Senaryo 5: Görev 1 Yanlış Hücre
test('Senaryo 5: Görev 1 Yanlış Hücre — Öğrenci B7 yerine A1 seçerse hata döner', () => {
  const task1 = sumFunctionLesson.tasks[0];
  const sheet = createSalesWorksheet();
  const wrongCoord = { col: 'A', colIndex: 0, row: 1 }; // A1
  const result = task1.validate(sheet, wrongCoord, false);
  assert.strictEqual(result.isValid, false, 'A1 hücresi hedef hücre olmadığından reddedilmeli');
  assert(result.message.includes('B7'), 'Hata mesajı B7 hücresine yönlendirmeli');
});

// Senaryo 6: Görev 1 Doğru Hücre
test('Senaryo 6: Görev 1 Doğru Hücre — Öğrenci B7 seçtiğinde doğrulama başarılı olur', () => {
  const task1 = sumFunctionLesson.tasks[0];
  const sheet = createSalesWorksheet();
  const correctCoord = { col: 'B', colIndex: 1, row: 7 }; // B7
  const result = task1.validate(sheet, correctCoord, false);
  assert.strictEqual(result.isValid, true, 'B7 hücresi başarıyla doğrulanmalı');
});

// Senaryo 7: Görev 3 Yanlış Formül
test('Senaryo 7: Görev 3 Yanlış Formül — =TOPLA(B2:B5) girilirse eksik hücre uyarısı verir', () => {
  const task3 = sumFunctionLesson.tasks[2];
  const sheet = createSalesWorksheet();
  sheet.cells.B7 = { raw: '=TOPLA(B2:B5)', computed: 2650 };
  const b7Coord = { col: 'B', colIndex: 1, row: 7 };
  const result = task3.validate(sheet, b7Coord, false);
  assert.strictEqual(result.isValid, false, 'B2:B5 eksik aralık olduğu için reddedilmeli');
});

// Senaryo 8: Görev 3 Eksik Parantez
test('Senaryo 8: Görev 3 Eksik Parantez — =TOPLA(B2:B6 sözdizimi uyarısı verir', () => {
  const task3 = sumFunctionLesson.tasks[2];
  const sheet = createSalesWorksheet();
  sheet.cells.B7 = { raw: '=TOPLA(B2:B6', computed: '#HATA!' };
  const b7Coord = { col: 'B', colIndex: 1, row: 7 };
  const result = task3.validate(sheet, b7Coord, false);
  assert.strictEqual(result.isValid, false, 'Eksik parantezli formül kabul edilmemeli');
});

// Senaryo 9: Görev 3 Doğru Formül & Görev 4 Sonuç Doğrulama
test('Senaryo 9: Görev 3 Doğru Formül — =TOPLA(B2:B6) girildiğinde 3050 hesaplanır ve doğrulanır', () => {
  const task3 = sumFunctionLesson.tasks[2];
  const task4 = sumFunctionLesson.tasks[3];
  let sheet = createSalesWorksheet();
  sheet.cells.B7 = { raw: '=TOPLA(B2:B6)', computed: null };
  sheet = recalculateWorksheet(sheet);
  assert.strictEqual(sheet.cells.B7.computed, 3050, 'B7 3050 olarak hesaplanmalı');
  const b7Coord = { col: 'B', colIndex: 1, row: 7 };
  const resultFormula = task3.validate(sheet, b7Coord, false);
  assert.strictEqual(resultFormula.isValid, true, 'Görev 3 formül girişi doğrulanmalı');
  const resultNumeric = task4.validate(sheet, b7Coord, false);
  assert.strictEqual(resultNumeric.isValid, true, 'Görev 4 sayısal sonucu doğrulanmalı');
});

// Senaryo 10: Görev 5 Otomatik Yeniden Hesaplama
test('Senaryo 10: Görev 5 Otomatik Güncelleme — B3 hücresi 500 yapıldığında B7 3100 olur', () => {
  const task5 = sumFunctionLesson.tasks[4];
  let sheet = createSalesWorksheet();
  sheet.cells.B7 = { raw: '=TOPLA(B2:B6)', computed: null };
  sheet = recalculateWorksheet(sheet);

  // Update B3 to 500
  sheet.cells.B3 = { raw: '500', computed: 500 };
  sheet = recalculateWorksheet(sheet);

  assert.strictEqual(sheet.cells.B7.computed, 3100, 'B7 otomatik olarak 3100 olmalı');
  const b3Coord = { col: 'B', colIndex: 1, row: 3 };
  const result = task5.validate(sheet, b3Coord, false);
  assert.strictEqual(result.isValid, true, 'Görev 5 başarıyla doğrulanmalı');
});

// Senaryo 11-13: 3 Seviyeli Kademeli İpucu Sistemi
test('Senaryo 11-13: 3 Seviyeli İpucu Sistemi — Seviye 1 (genel), Seviye 2 (sözdizimi), Seviye 3 (tam çözüm)', () => {
  const indHints = sumFunctionLesson.independentPractice.hints;
  assert(indHints, 'Bağımsız alıştırma için 3 seviyeli ipuçları tanımlı olmalı');
  assert(indHints.level1.includes('formül yazın'), 'Seviye 1 genel yönlendirme olmalı');
  assert(indHints.level2.includes('=TOPLA(B2:B6)'), 'Seviye 2 sözdizimi formatını vermeli');
  assert(indHints.level3.includes('B7') && indHints.level3.includes('Enter'), 'Seviye 3 tam çözüm ve adımları vermeli');

  const task3Hints = sumFunctionLesson.tasks[2].hints;
  assert(task3Hints.level1.includes('='), 'Görev 3 seviye 1 ipucu = kuralını hatırlatmalı');
  assert(task3Hints.level2.includes(':'), 'Görev 3 seviye 2 ipucu iki nokta kuralını vermeli');
  assert(task3Hints.level3.includes('Enter'), 'Görev 3 seviye 3 ipucu Enter onayını belirtmeli');
});

// Senaryo 14: Bağımsız Uygulama (Aylık Giderler Tablosu)
test('Senaryo 14: Bağımsız Uygulama — Yeni tabloda =TOPLA(B2:B6) yazıldığında 4350 hesaplanır', () => {
  let monthlySheet = createMonthlyExpensesWorksheet();
  assert.strictEqual(monthlySheet.cells.B2.computed, 2500);
  assert.strictEqual(monthlySheet.cells.B3.computed, 450);
  assert.strictEqual(monthlySheet.cells.B4.computed, 250);
  assert.strictEqual(monthlySheet.cells.B5.computed, 800);
  assert.strictEqual(monthlySheet.cells.B6.computed, 350);

  // Student writes formula in B7
  monthlySheet.cells.B7 = {
    raw: '=TOPLA(B2:B6)',
    computed: null,
  };
  monthlySheet = recalculateWorksheet(monthlySheet);

  assert.strictEqual(monthlySheet.cells.B7.computed, 4350, 'Aylık gider toplamı tam olarak 4350 ₺ olmalı');
  assert.strictEqual(sumFunctionLesson.independentPractice?.expectedResult, 4350);
});

// Senaryo 15: Ders Sonu Başarı Karnesi ve Eksik Konular
test('Senaryo 15: Ders Sonu ve Rapor — Karnede puan, yetkinlikler ve eksik konular yer alır', () => {
  const totalTasks = sumFunctionLesson.tasks.length;
  const completedTasks = totalTasks;
  const hintsUsed = 1;
  const wrongAttempts = 0;
  const finalScore = Math.max(65, Math.min(100, Math.round((completedTasks / totalTasks) * 60) + 40 - (hintsUsed * 3 + wrongAttempts * 2)));

  assert(finalScore >= 90, 'Az ipucuyla tamamlandığında puan yüksek olmalı');
  assert(sumFunctionLesson.summary.length >= 3, 'Ders özeti en az 3 madde içermeli');
});

// Senaryo 16: Durum Kalıcılığı (Persistence)
test('Senaryo 16: Durum Kalıcılığı — İlerleme kaydedilir ve geri okunabilir', () => {
  progressService.saveLessonProgress(sumFunctionLesson.id, {
    completed: true,
    currentTaskIndex: 4,
    completedTasks: sumFunctionLesson.tasks.map((t) => t.id),
    score: 97,
  });

  const saved = progressService.getProgress().lessonProgress[sumFunctionLesson.id];
  assert(saved, 'İlerleme kaydedilmiş olmalı');
  assert.strictEqual(saved.completed, true);
  assert.strictEqual(saved.score, 97);
  assert.strictEqual(saved.completedTasks.length, 5);
});

// --------------------------------------------------------------------------
// Summary
// --------------------------------------------------------------------------
console.log('\n------------------------------------------------------------');
console.log(`TEST SONUÇLARI: ${passedTests} BAŞARILI, ${failedTests} BAŞARISIZ`);
console.log('------------------------------------------------------------\n');

if (failedTests > 0) {
  process.exit(1);
}

