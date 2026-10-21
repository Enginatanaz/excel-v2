/**
 * Automated Test Suite for Excel Akademi AI - Stage 4: Universal Lesson Content Engine
 * Validates:
 * 1. Universal Lesson Data Model across 8 lesson types
 * 2. Automated Lesson Quality Control Engine (10 strict criteria)
 * 3. Exemplar 1 (sumFunctionLesson - formula_function) quality report
 * 4. Exemplar 2 (cellFormattingLesson - interface_action) live state validation
 * 5. Formatting Validators (bold, currency, alignment, background color)
 * 6. Independent Practice custom validation
 * 7. Quiz Questions & Answer Key Integrity
 * 8. Lessons Registry and Navigation Lookup
 */

import assert from 'node:assert';
import {
  sumFunctionLesson,
  cellFormattingLesson,
  excelIntroductionLesson,
  allLessons,
  getLessonById,
} from '../src/data/lessons/index.ts';
import { validateLessonQuality } from '../src/modules/learning/lessonQualityEngine.ts';
import {
  validateCellFormatting,
  validateRangeSelection,
} from '../src/modules/learning/taskValidator.ts';
import type { Lesson, LessonType } from '../src/modules/learning/lessonTypes.ts';

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
console.log('  EXCEL AKADEMİ AI — AŞAMA 4: EVRENSEL DERS İÇERİK MOTORU TESTLERİ');
console.log('============================================================\n');

// --------------------------------------------------------------------------
// 1. Universal Lesson Types & Schema Support
// --------------------------------------------------------------------------
console.log('Grup 1: 8 Evrensel Excel Ders Türü ve Veri Modeli');

test('Desteklenen 8 ders kategorisi veri tipinde tanımlıdır', () => {
  const supportedTypes: LessonType[] = [
    'concept',
    'interface_action',
    'formula_function',
    'data_management',
    'visualization',
    'advanced_analysis',
    'automation',
    'project',
  ];
  assert.strictEqual(supportedTypes.length, 8);
  assert.strictEqual(excelIntroductionLesson.lessonType, 'concept');
  assert.strictEqual(sumFunctionLesson.lessonType, 'formula_function');
  assert.strictEqual(cellFormattingLesson.lessonType, 'interface_action');
});

test('Katalogdaki tüm dersler benzersiz ID ve geçerli sayfalara sahiptir', () => {
  assert.strictEqual(allLessons.length, 3);
  const ids = new Set(allLessons.map((l) => l.id));
  assert.strictEqual(ids.size, 3);

  for (const lesson of allLessons) {
    const wb = lesson.initialWorkbookFactory();
    assert.ok(wb.sheets.length > 0, `${lesson.id} çalışma sayfası içermelidir.`);
    assert.ok(wb.name.endsWith('.xlsx'), `${lesson.id} çalışma kitabı .xlsx uzantılı olmalıdır.`);
  }
});

test('getLessonById fonksiyonu kayıtlı dersleri doğru döndürür', () => {
  assert.strictEqual(getLessonById('sum_function')?.id, 'sum_function');
  assert.strictEqual(getLessonById('cell_formatting')?.id, 'cell_formatting');
  assert.strictEqual(getLessonById('excel_intro')?.id, 'excel_intro');
  assert.strictEqual(getLessonById('non_existent'), undefined);
});

// --------------------------------------------------------------------------
// 2. Automated Content Quality Control Engine
// --------------------------------------------------------------------------
console.log('\nGrup 2: Otomatik İçerik Kalite Kontrol Motoru (lessonQualityEngine)');

test('sumFunctionLesson kalite kontrol motorundan tam geçerlilik ve yüksek puan alır', () => {
  const report = validateLessonQuality(sumFunctionLesson);
  assert.strictEqual(report.isValid, true, 'sumFunctionLesson geçerli olmalıdır.');
  assert.ok(report.score >= 85, `Puan en az 85 olmalıdır, mevcut: ${report.score}`);
  assert.strictEqual(report.errors.length, 0, 'Sıfır hata olmalıdır.');
  assert.ok(report.passedChecks.length >= 8, 'En az 8 kriter geçmelidir.');
});

test('cellFormattingLesson kalite kontrol motorundan tam geçerlilik ve sıfır hata alır', () => {
  const report = validateLessonQuality(cellFormattingLesson);
  assert.strictEqual(report.isValid, true, 'cellFormattingLesson geçerli olmalıdır.');
  assert.ok(report.score >= 85, `Puan en az 85 olmalıdır, mevcut: ${report.score}`);
  assert.strictEqual(report.errors.length, 0, 'Hata listesi boş olmalıdır.');
  assert.strictEqual(report.lessonType, 'interface_action');
});

test('Kalite kontrol motoru eksik veya geçersiz derslerde hata tespit eder', () => {
  const invalidLesson = {
    id: 'x', // too short
    number: 99,
    title: 'A', // too short
    lessonType: 'invalid_type' as any,
    category: '',
    level: 'Başlangıç' as const,
    estimatedMinutes: 5,
    description: 'Kısa',
    learningObjective: 'Kısa',
    introNarration: 'Giriş',
    topics: [],
    explanationContent: {
      overview: 'Test',
      bestPractices: [],
      commonMistakes: [],
    },
    solvedExample: {} as any,
    tasks: [],
    independentPractice: {} as any,
    summary: [],
    initialWorkbookFactory: () => ({} as any),
  } as Lesson;

  const report = validateLessonQuality(invalidLesson);
  assert.strictEqual(report.isValid, false, 'Geçersiz ders isValid=false dönmelidir.');
  assert.ok(report.errors.length >= 4, 'Birden fazla hata raporlanmalıdır.');
  assert.ok(report.score < 70, 'Skor düşük olmalıdır.');
});

// --------------------------------------------------------------------------
// 3. Stage 4 Exemplar: cellFormattingLesson (interface_action) Live Validation
// --------------------------------------------------------------------------
console.log('\nGrup 3: Aşama 4 Hücre Biçimlendirme Dersi ve Doğrulama Kuralları');

test('Görev 1: Başlık hücresi (A1) kalın yapılmadığında uyarı verir, yapılınca onaylar', () => {
  const wb = cellFormattingLesson.initialWorkbookFactory();
  const sheet = wb.sheets[0];

  // Başlangıçta biçimlendirilmemiş
  const initialCheck = cellFormattingLesson.tasks[0].validate(
    sheet,
    { col: 'A', colIndex: 0, row: 1 }
  );
  assert.strictEqual(initialCheck.isValid, false, 'Başlangıçta A1 kalın olmamalı.');
  assert.ok(initialCheck.message.includes('Kalın (Bold)'));

  // Kullanıcı A1 hücresini kalın yaptı:
  sheet.cells['A1'] = {
    ...sheet.cells['A1'],
    style: { bold: true },
  };

  const formattedCheck = cellFormattingLesson.tasks[0].validate(
    sheet,
    { col: 'A', colIndex: 0, row: 1 }
  );
  assert.strictEqual(formattedCheck.isValid, true, 'A1 kalın yapıldığında geçerli olmalı.');
  assert.ok(formattedCheck.message.includes('başarıyla uygulandı'));
});

test('Görev 2: B2 satış tutarı para birimi (₺) yapılınca onaylanır', () => {
  const wb = cellFormattingLesson.initialWorkbookFactory();
  const sheet = wb.sheets[0];

  // Başlangıçta ham sayı
  const initialCheck = cellFormattingLesson.tasks[1].validate(
    sheet,
    { col: 'B', colIndex: 1, row: 2 }
  );
  assert.strictEqual(initialCheck.isValid, false, 'Başlangıçta B2 para birimi olmamalı.');

  // Kullanıcı B2 hücresine format: 'currency' verdi:
  sheet.cells['B2'] = {
    ...sheet.cells['B2'],
    style: { format: 'currency' },
  };

  const currencyCheck = cellFormattingLesson.tasks[1].validate(
    sheet,
    { col: 'B', colIndex: 1, row: 2 }
  );
  assert.strictEqual(currencyCheck.isValid, true, 'B2 para birimi olunca geçerli olmalı.');
});

test('Görev 3: A1 başlığı ortalandığında onaylanır', () => {
  const wb = cellFormattingLesson.initialWorkbookFactory();
  const sheet = wb.sheets[0];

  sheet.cells['A1'] = {
    ...sheet.cells['A1'],
    style: { align: 'center' },
  };

  const alignCheck = cellFormattingLesson.tasks[2].validate(
    sheet,
    { col: 'A', colIndex: 0, row: 1 }
  );
  assert.strictEqual(alignCheck.isValid, true, 'A1 ortalandığında geçerli olmalı.');
});

test('Görev 4: A7 Genel Toplam kalın yapıldığında onaylanır', () => {
  const wb = cellFormattingLesson.initialWorkbookFactory();
  const sheet = wb.sheets[0];

  sheet.cells['A7'] = {
    ...sheet.cells['A7'],
    style: { bold: true },
  };

  const totalCheck = cellFormattingLesson.tasks[3].validate(
    sheet,
    { col: 'A', colIndex: 0, row: 7 }
  );
  assert.strictEqual(totalCheck.isValid, true, 'A7 kalın yapıldığında geçerli olmalı.');
});

// --------------------------------------------------------------------------
// 4. Bağımsız Uygulama (Independent Practice) Doğrulaması
// --------------------------------------------------------------------------
console.log('\nGrup 4: Bağımsız Uygulama Modülü & Çalışma Kitabı');

test('cellFormattingLesson bağımsız çalışma kitabı doğru üretilir ve customValidator ile doğrulanır', () => {
  const practiceWb = cellFormattingLesson.independentPractice.workbookFactory();
  assert.strictEqual(practiceWb.name, 'Departman_Butcesi_2025.xlsx');
  const sheet = practiceWb.sheets[0];

  assert.ok(cellFormattingLesson.independentPractice.customValidator, 'customValidator tanımlı olmalıdır.');

  // Başlangıçta tamamlanmamış
  const initialRes = cellFormattingLesson.independentPractice.customValidator!(sheet);
  assert.strictEqual(initialRes.isValid, false, 'Başlangıçta doğrulanmamalı.');

  // Kullanıcı A1 başlığını kalınlaştırdı ve B2 bütçesini para birimi yaptı:
  sheet.cells['A1'] = { ...sheet.cells['A1'], style: { bold: true } };
  sheet.cells['B2'] = { ...sheet.cells['B2'], style: { format: 'currency' } };

  const finalRes = cellFormattingLesson.independentPractice.customValidator!(sheet);
  assert.strictEqual(finalRes.isValid, true, 'Gereksinimler tamamlandığında bağımsız uygulama geçerlidir.');
});

// --------------------------------------------------------------------------
// 5. Değerlendirme Testi (Quiz) ve Cevap Anahtarları
// --------------------------------------------------------------------------
console.log('\nGrup 5: Değerlendirme Testi Soruları ve Cevap Anahtarı');

test('Her iki ders de geçerli test soruları ve tutarlı cevap anahtarlarına sahiptir', () => {
  for (const lesson of [sumFunctionLesson, cellFormattingLesson]) {
    assert.ok(lesson.quizQuestions, `${lesson.id} dersinde test soruları bulunmalıdır.`);
    assert.ok(lesson.quizQuestions.length >= 3, `${lesson.id} en az 3 test sorusu içermelidir.`);

    for (const q of lesson.quizQuestions) {
      assert.ok(q.question.length > 10, 'Soru metni açıklayıcı olmalıdır.');
      assert.ok(q.options.length >= 4, 'En az 4 seçenek olmalıdır.');
      assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length, 'correctIndex geçerli bir seçeneği işaret etmelidir.');
      assert.ok(q.explanation.length > 15, 'Doğru cevap pedagojik açıklaması bulunmalıdır.');
    }
  }
});

// --------------------------------------------------------------------------
// 6. Çoklu Hücre ve Aralık Doğrulayıcıları
// --------------------------------------------------------------------------
console.log('\nGrup 6: Aralık Seçimi ve Hücre Biçim Doğrulayıcıları');

test('validateCellFormatting hücre aralığı (B2:B6) için topluca kontrol yapabilir', () => {
  const wb = cellFormattingLesson.initialWorkbookFactory();
  const sheet = wb.sheets[0];

  // B2..B6 aralığını Para Birimi yapalım
  ['B2', 'B3', 'B4', 'B5', 'B6'].forEach((addr) => {
    sheet.cells[addr] = { ...sheet.cells[addr], style: { format: 'currency' } };
  });

  const rangeCheck = validateCellFormatting(sheet, 'B2:B6', { format: 'currency' });
  assert.strictEqual(rangeCheck.isValid, true, 'Tüm B2:B6 aralığı para birimi olduğunda geçerli olmalı.');

  // Bir hücrenin formatını bozalım
  sheet.cells['B4'] = { ...sheet.cells['B4'], style: { format: 'general' } };
  const brokenCheck = validateCellFormatting(sheet, 'B2:B6', { format: 'currency' });
  assert.strictEqual(brokenCheck.isValid, false, 'B4 eksik olduğunda aralık doğrulaması başarısız olmalı.');
  assert.ok(brokenCheck.message.includes('B4 hücresine henüz'));
});

test('validateRangeSelection seçili dikdörtgensel aralığı doğru tespit eder', () => {
  const res = validateRangeSelection(
    { startCol: 'A', startRow: 1, endCol: 'B', endRow: 6 },
    { col: 'A', colIndex: 0, row: 1 },
    'A1:B6'
  );
  assert.strictEqual(res.isValid, true);

  const failRes = validateRangeSelection(
    { startCol: 'A', startRow: 1, endCol: 'B', endRow: 5 },
    { col: 'A', colIndex: 0, row: 1 },
    'A1:B6'
  );
  assert.strictEqual(failRes.isValid, false);
});

console.log('\n------------------------------------------------------------');
console.log(`AŞAMA 4 TEST SONUÇLARI: ${passedTests} BAŞARILI, ${failedTests} BAŞARISIZ`);
console.log('------------------------------------------------------------\n');

if (failedTests > 0) {
  process.exit(1);
}
