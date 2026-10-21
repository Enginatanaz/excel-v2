/**
 * Task validation service that inspects live spreadsheet state
 * Deterministic rules with contextual diagnostic feedback
 * Stage 4: Expanded with Cell Formatting, Alignment, Range and Interface validation
 */

import type { Worksheet, CellCoordinate, SelectionRange, NumberFormat, HorizontalAlignment, CellStyle } from '../spreadsheet/types.ts';
import type { TaskValidationResult } from './lessonTypes.ts';
import { normalizeFormula, parseNumeric } from '../../utils/validation.ts';
import { parseRange } from '../../utils/cellAddress.ts';

export function validateCellSelection(
  activeCell: CellCoordinate,
  expectedCol: string,
  expectedRow: number,
  cellName: string = 'Toplam hücresi'
): TaskValidationResult {
  const isMatch =
    activeCell.col.toUpperCase() === expectedCol.toUpperCase() &&
    activeCell.row === expectedRow;

  if (isMatch) {
    return {
      isValid: true,
      message: `Harika! ${expectedCol}${expectedRow} (${cellName}) hücresini başarıyla seçtiniz.`,
      expectedValue: `${expectedCol}${expectedRow}`,
    };
  }

  // Diagnostic feedback if user clicked nearby cells
  let diagnostic = `Şu anda ${activeCell.col}${activeCell.row} hücresindesiniz. Lütfen ${expectedCol}${expectedRow} hücresine tıklayın.`;
  if (activeCell.col.toUpperCase() === 'B' && activeCell.row === 6) {
    diagnostic =
      'Toplam hücresini seçmek istiyorduk. Şu anda B6 hücresi seçili. B6, son ürünün (Kulaklık) satış tutarını içeriyor. Bir alt satırdaki B7 hücresini seçmeyi deneyin.';
  } else if (activeCell.col.toUpperCase() === 'A' && activeCell.row === 7) {
    diagnostic =
      'A7 hücresinde "Toplam" metin etiketi bulunuyor. Sayısal toplamı yazacağımız hücre hemen yanındaki B7 hücresidir.';
  }

  return {
    isValid: false,
    message: diagnostic,
    hint: `${expectedCol}${expectedRow} hücresi tablonun toplam satırındaki boş kutudur. Ad kutusuna da yazabilirsiniz.`,
    expectedValue: `${expectedCol}${expectedRow}`,
  };
}

export function validateFormulaBarOrEditFocus(
  activeCell: CellCoordinate,
  expectedCol: string,
  expectedRow: number,
  isEditing?: boolean
): TaskValidationResult {
  const isCellMatch =
    activeCell.col.toUpperCase() === expectedCol.toUpperCase() &&
    activeCell.row === expectedRow;

  if (!isCellMatch) {
    return {
      isValid: false,
      message: `Önce ${expectedCol}${expectedRow} hücresini seçmelisiniz. Şu an ${activeCell.col}${activeCell.row} hücresi seçili.`,
      hint: `${expectedCol}${expectedRow} hücresine tıklayın.`,
    };
  }

  if (isEditing) {
    return {
      isValid: true,
      message: `Harika! Formül giriş alanı düzenleme modunda etkinleştirildi.`,
    };
  }

  return {
    isValid: false,
    message: `${expectedCol}${expectedRow} hücresi seçili, ancak formül giriş alanı henüz düzenleme modunda değil.`,
    hint: `Üstteki fx Formül Çubuğuna tıklayın veya klavyenizden F2 tuşuna basın.`,
  };
}

export function validateFormulaInput(
  sheet: Worksheet,
  targetCellAddr: string,
  acceptedFormulas: string[]
): TaskValidationResult {
  const cell = sheet.cells[targetCellAddr];
  if (!cell || !cell.raw || cell.raw.trim() === '') {
    return {
      isValid: false,
      message: `${targetCellAddr} hücresine henüz bir formül girilmedi.`,
      hint: `Formül çubuğuna veya ${targetCellAddr} hücresine =TOPLA(B2:B6) yazıp Enter'a basın.`,
    };
  }

  const rawTrimmed = cell.raw.trim();

  // Diagnostic: Missing equals sign
  if (!rawTrimmed.startsWith('=')) {
    return {
      isValid: false,
      message: `Formülün başına eşittir (=) işareti koymalısınız. '${rawTrimmed}' şu an düz metin olarak algılanıyor.`,
      hint: `Excel'de tüm formüller = işareti ile başlar. Örnek: =TOPLA(B2:B6)`,
      expectedValue: acceptedFormulas[0],
    };
  }

  const normalizedRaw = normalizeFormula(cell.raw);
  const normalizedAccepted = acceptedFormulas.map(normalizeFormula);

  // Diagnostic: Semicolon used instead of colon in range
  if (normalizedRaw.includes('B2;B6')) {
    return {
      isValid: false,
      message:
        'Aralık belirtirken iki nokta (:) kullanılmalıdır. Noktalı virgül (;) yalnızca B2 ve B6 hücrelerini toplar, aradaki değerleri toplamaz!',
      hint: '=TOPLA(B2:B6) şeklinde iki nokta kullanın.',
      expectedValue: acceptedFormulas[0],
    };
  }

  const isFormulaMatch = normalizedAccepted.includes(normalizedRaw);

  if (isFormulaMatch) {
    return {
      isValid: true,
      message: `Tebrikler! ${targetCellAddr} hücresine doğru formül yazıldı: ${cell.raw}`,
      expectedValue: cell.raw,
    };
  }

  return {
    isValid: false,
    message: `${targetCellAddr} hücresindeki formül '${cell.raw}' beklenen formül ile eşleşmiyor.`,
    hint: `Beklenen formül: =TOPLA(B2:B6) veya =SUM(B2:B6). Büyük/küçük harf fark etmez.`,
    expectedValue: acceptedFormulas[0],
  };
}

export function validateCellNumericResult(
  sheet: Worksheet,
  targetCellAddr: string,
  expectedSum: number
): TaskValidationResult {
  const cell = sheet.cells[targetCellAddr];
  if (!cell || cell.computed === null || cell.computed === undefined || cell.computed === '') {
    return {
      isValid: false,
      message: `${targetCellAddr} hücresinde henüz bir sonuç hesaplanmadı. Formülü yazıp Enter tuşuna basın.`,
      hint: `Enter tuşuna basarak formül girişini onaylayın.`,
    };
  }

  const computedNum = parseNumeric(cell.computed);

  if (Math.abs(computedNum - expectedSum) < 0.001) {
    return {
      isValid: true,
      message: `Mükemmel! Toplam sonuç tam olarak ${expectedSum} ₺ olarak hesaplandı.`,
      expectedValue: expectedSum,
    };
  }

  return {
    isValid: false,
    message: `Hesaplanan sonuç (${cell.computed}) beklenen değer (${expectedSum}) ile uyuşmuyor.`,
    hint: `Lütfen toplanan hücre aralığının B2:B6 olduğundan emin olun (350+450+1200+650+400 = 3050).`,
    expectedValue: expectedSum,
  };
}

export function validateAutoRecalculation(
  sheet: Worksheet,
  modifiedCellAddr: string,
  expectedModifiedVal: number,
  targetSumAddr: string,
  expectedNewSum: number
): TaskValidationResult {
  const modifiedCell = sheet.cells[modifiedCellAddr];
  const targetCell = sheet.cells[targetSumAddr];

  const currentModVal = modifiedCell ? parseNumeric(modifiedCell.computed) : 0;
  const currentSumVal = targetCell ? parseNumeric(targetCell.computed) : 0;

  if (Math.abs(currentModVal - expectedModifiedVal) > 0.001) {
    return {
      isValid: false,
      message: `${modifiedCellAddr} hücresinin değeri henüz ${expectedModifiedVal} yapılmadı. Şu anki değer: ${currentModVal}.`,
      hint: `${modifiedCellAddr} hücresine tıklayın, 500 yazıp Enter'a basın.`,
      expectedValue: expectedModifiedVal,
    };
  }

  if (Math.abs(currentSumVal - expectedNewSum) < 0.001) {
    return {
      isValid: true,
      message: `Harika! B3 değeri 500 olunca, B7 toplamı otomatik olarak ${expectedNewSum} ₺ oldu!`,
      expectedValue: expectedNewSum,
    };
  }

  return {
    isValid: false,
    message: `${targetSumAddr} hücresindeki toplam ${expectedNewSum} yerine ${currentSumVal} olarak görünüyor.`,
    hint: `B7 hücresindeki formülün =TOPLA(B2:B6) olduğundan emin olun.`,
    expectedValue: expectedNewSum,
  };
}

/**
 * Stage 4 Universal Validators:
 * Cell Formatting, Alignment, Currency, Borders, Background Color, Range Selection
 */

export function resolveTargetAddresses(targetAddrOrRange: string): string[] {
  if (targetAddrOrRange.includes(':')) {
    const range = parseRange(targetAddrOrRange);
    return range ? range.addresses : [targetAddrOrRange];
  }
  return [targetAddrOrRange];
}

export function validateCellFormatting(
  sheet: Worksheet,
  targetCellOrRange: string,
  expectedStyle: {
    bold?: boolean;
    italic?: boolean;
    format?: NumberFormat;
    align?: HorizontalAlignment;
    backgroundColor?: string;
  },
  styleLabel: string = 'İstenen biçimlendirme'
): TaskValidationResult {
  const addresses = resolveTargetAddresses(targetCellOrRange);

  if (addresses.length === 0) {
    return {
      isValid: false,
      message: `Geçersiz hedef adres: ${targetCellOrRange}`,
    };
  }

  for (const addr of addresses) {
    const cell = sheet.cells[addr];
    const style: CellStyle = cell?.style || {};

    if (expectedStyle.bold !== undefined && style.bold !== expectedStyle.bold) {
      return {
        isValid: false,
        message: `${addr} hücresi henüz Kalın (Bold) yapılmadı. Lütfen araç çubuğundaki B (Kalın) düğmesine tıklayın veya Ctrl+B kısayolunu kullanın.`,
        hint: `${targetCellOrRange} aralığını seçin ve araç çubuğundaki Kalın (B) simgesine tıklayın.`,
      };
    }

    if (expectedStyle.italic !== undefined && style.italic !== expectedStyle.italic) {
      return {
        isValid: false,
        message: `${addr} hücresi henüz İtalik yapılmadı. Araç çubuğundaki I (İtalik) düğmesine tıklayın.`,
        hint: `İtalik yapmak için araç çubuğundaki I simgesine veya Ctrl+I kısayoluna basın.`,
      };
    }

    if (expectedStyle.format !== undefined && style.format !== expectedStyle.format) {
      const formatNames: Record<string, string> = {
        currency: 'Finansal Para Birimi (₺)',
        percentage: 'Yüzde (%)',
        number: 'Sayı',
        general: 'Genel',
      };
      const expectedName = formatNames[expectedStyle.format] || expectedStyle.format;
      return {
        isValid: false,
        message: `${addr} hücresine henüz ${expectedName} biçimlendirmesi uygulanmadı.`,
        hint: `${targetCellOrRange} hücrelerini seçtikten sonra araç çubuğundaki ₺ (Para Birimi) butonuna tıklayın.`,
      };
    }

    if (expectedStyle.align !== undefined && style.align !== expectedStyle.align) {
      const alignNames: Record<string, string> = {
        center: 'Ortala',
        left: 'Sola Hizala',
        right: 'Sağa Hizala',
      };
      return {
        isValid: false,
        message: `${addr} hücresi ${alignNames[expectedStyle.align] || expectedStyle.align} olarak hizalanmadı.`,
        hint: `Araç çubuğundaki hizalama düğmelerinden Ortala butonunu seçin.`,
      };
    }

    if (expectedStyle.backgroundColor && style.backgroundColor !== expectedStyle.backgroundColor) {
      return {
        isValid: false,
        message: `${addr} hücresine dolgu rengi uygulanmadı.`,
        hint: `Dolgu rengi paletinden belirtilen rengi seçin.`,
      };
    }
  }

  return {
    isValid: true,
    message: `Tebrikler! ${targetCellOrRange} alanına ${styleLabel} başarıyla uygulandı.`,
  };
}

export function validateRangeSelection(
  selectionRange: SelectionRange | null,
  activeCell: CellCoordinate,
  expectedRangeStr: string
): TaskValidationResult {
  const expected = parseRange(expectedRangeStr);
  if (!expected) {
    return {
      isValid: false,
      message: `Geçersiz hedef aralık tanımı: ${expectedRangeStr}`,
    };
  }

  if (!selectionRange) {
    const isSingleCellMatch =
      expected.addresses.length === 1 &&
      activeCell.col.toUpperCase() === expected.start.col.toUpperCase() &&
      activeCell.row === expected.start.row;

    if (isSingleCellMatch) {
      return {
        isValid: true,
        message: `Harika! ${expectedRangeStr} hücresi seçildi.`,
      };
    }

    return {
      isValid: false,
      message: `Lütfen ${expectedRangeStr} aralığını seçin. Şu anda yalnızca ${activeCell.col}${activeCell.row} hücresi seçili.`,
      hint: `Shift tuşuna basılı tutarak veya fare ile sürükleyerek ${expectedRangeStr} aralığını seçebilirsiniz.`,
    };
  }

  const isColMatch =
    selectionRange.startCol.toUpperCase() === expected.start.col.toUpperCase() &&
    selectionRange.endCol.toUpperCase() === expected.end.col.toUpperCase();
  const isRowMatch =
    selectionRange.startRow === expected.start.row &&
    selectionRange.endRow === expected.end.row;

  if (isColMatch && isRowMatch) {
    return {
      isValid: true,
      message: `Harika! ${expectedRangeStr} aralığı tam olarak seçildi.`,
    };
  }

  return {
    isValid: false,
    message: `Seçili aralık (${selectionRange.startCol}${selectionRange.startRow}:${selectionRange.endCol}${selectionRange.endRow}) beklenen ${expectedRangeStr} ile eşleşmiyor.`,
    hint: `Farenizi ${expected.start.col}${expected.start.row} hücresinden ${expected.end.col}${expected.end.row} hücresine kadar sürükleyin.`,
  };
}
