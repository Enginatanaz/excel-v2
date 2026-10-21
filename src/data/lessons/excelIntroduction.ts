/**
 * Excel'e Giriş Dersi
 * Excel Akademi AI - Temel Arayüz ve Hücreler
 */

import type { Lesson } from '../../modules/learning/lessonTypes.ts';
import { createEmptyWorksheet, DEFAULT_ROW_COUNT, DEFAULT_COL_COUNT } from '../../modules/spreadsheet/spreadsheetState.ts';
import { validateCellSelection } from '../../modules/learning/taskValidator.ts';
import type { Workbook, Worksheet } from '../../modules/spreadsheet/types.ts';

function createIntroWorkbook(): Workbook {
  const introSheet: Worksheet = {
    ...createEmptyWorksheet('sheet_intro', 'Giriş'),
    cells: {
      A1: { raw: 'Hoş Geldiniz', computed: 'Hoş Geldiniz', style: { bold: true } },
      B1: { raw: 'Excel Temelleri', computed: 'Excel Temelleri', style: { italic: true } },
    },
    rowCount: DEFAULT_ROW_COUNT,
    colCount: DEFAULT_COL_COUNT,
  };

  return {
    id: 'wb_intro',
    name: 'Excel_Giris.xlsx',
    sheets: [introSheet],
    activeSheetId: introSheet.id,
  };
}

export const excelIntroductionLesson: Lesson = {
  id: 'excel_intro',
  number: 1,
  title: "Excel'e Giriş & Hücre Mantığı",
  lessonType: 'concept',
  category: 'Arayüz ve Temeller',
  level: 'Başlangıç',
  estimatedMinutes: 5,
  description:
    'Çalışma kitabı, sayfalar, sütun harfleri, satır numaraları ve hücre adresi kavramlarını keşfedin.',
  learningObjective:
    'Excel ızgarasında gezinmek, ad kutusunu okumak ve sütun harfi ile satır numarasının kesişimi olan hücre adresini anlamak.',
  introNarration:
    "Excel Akademiye hoş geldiniz! Bu dersimizde Excel'in temel arayüzünü, sütunları, satırları ve hücre adresi mantığını öğreneceğiz.",
  topics: [
    {
      id: 'intro_t1',
      number: 1,
      title: 'Excel Hücre Mantığı',
      content:
        "Excel, verileri satırlar ve sütunlar hâlinde düzenleyen bir elektronik hesap tablosu yazılımıdır. Sütun ve satırın kesiştiği her bir kutucuk 'Hücre' olarak adlandırılır.",
      keyTakeaway: 'Sütun + Satır = Hücre Adresi (Örn: C3).',
      audioNarration:
        "Excel'de her kutucuğa hücre denir. Sütun harfi ile satır numarasının kesişimi hücre adresini oluşturur.",
    },
  ],
  explanationContent: {
    overview:
      "Excel, verileri satırlar ve sütunlar hâlinde düzenleyen bir elektronik hesap tablosu yazılımıdır. Her dikey çizgiye Sütun (A, B, C...) ve her yatay çizgiye Satır (1, 2, 3...) denir. Sütun ve satırın kesiştiği her bir kutucuk 'Hücre' olarak adlandırılır.",
    syntax: 'Hücre Adresi = [Sütun Harfi] + [Satır Numarası] (Örnek: C3, D12, A1)',
    parameters: [
      {
        name: 'Sütun (Column)',
        description: 'Dikey doğrultudaki harfler (A, B, C... Z, AA...)',
        required: true,
      },
      {
        name: 'Satır (Row)',
        description: 'Yatay doğrultudaki sayılar (1, 2, 3... 1.048.576)',
        required: true,
      },
    ],
    bestPractices: [
      'Seçtiğiniz herhangi bir hücrenin adresi sol üstteki Ad Kutusunda anında görüntülenir.',
      'Klavyedeki yön okları ile hücreler arasında hızlıca gezinebilirsiniz.',
    ],
    commonMistakes: [
      'Adres yazarken satırı önce yazmak (ör: 3C yerine daima C3 olmalıdır).',
    ],
  },
  solvedExample: {
    title: 'Örnek: C3 Hücresini Bulma',
    scenario: '3. satır ile C sütununun kesişimindeki hücreyi tespit etmek.',
    dataSnippet: [
      { label: 'Sütun', value: 'C (3. sütun)' },
      { label: 'Satır', value: '3. satır' },
    ],
    formula: 'Hücre Adresi: C3',
    result: 'C3',
    explanation:
      'C sütununu takip edip 3 numaralı satırla birleştiği kutucuğa baktığınızda C3 hücresini görürsünüz.',
    steps: [
      '1. Üstteki sütun başlıklarından C harfini bulun.',
      '2. Soldaki satır başlıklarından 3 rakamını bulun.',
      '3. Kesişimdeki hücreye tıklayın. Sol üstteki Ad Kutusunun C3 yazdığını görün.',
    ],
  },
  summary: [
    'Her hücre benzersiz bir harf ve sayı kombinasyonuna sahiptir.',
    'Aktif hücre yeşil bir çerçeve ile vurgulanır.',
    'Ad kutusu o an seçili hücrenin tam konumunu bildirir.',
  ],
  tasks: [
    {
      id: 'task_intro_1',
      taskNumber: 1,
      title: 'A1 Hücresini İnceleme',
      instruction: 'İlk olarak sol en üstteki başlangıç hücresi olan A1 hücresine tıklayın.',
      hint: 'A sütunu ve 1. satırın kesiştiği yer tablonun en sol üst köşesidir.',
      hints: {
        level1: 'Tablonun sol üst köşesine bakın.',
        level2: 'A sütunu ile 1. satırın birleştiği hücreyi tıklayın.',
        level3: 'A1 hücresine tıklayın veya Ad kutusuna A1 yazın.',
      },
      narrationText:
        'Hoş geldiniz! İlk olarak tablonun başlangıç noktası olan A1 hücresini seçin.',
      targetCell: 'A1',
      validate: (sheet, activeCell) => validateCellSelection(activeCell, 'A', 1, 'Başlangıç'),
    },
    {
      id: 'task_intro_2',
      taskNumber: 2,
      title: 'C4 Hücresine Gezinme',
      instruction:
        'Yön oklarını veya farenizi kullanarak C sütununun 4. satırındaki C4 hücresine gidin.',
      hint: 'C sütununu bulup aşağı doğru 4. satıra kadar inin.',
      hints: {
        level1: 'C sütununu bulun.',
        level2: 'C sütununda 4. satıra kadar inin.',
        level3: 'C4 hücresine tıklayın.',
      },
      narrationText:
        'Harika! Şimdi de tablodaki C4 hücresini bulup seçin.',
      targetCell: 'C4',
      validate: (sheet, activeCell) => validateCellSelection(activeCell, 'C', 4, 'C4'),
    },
  ],
  independentPractice: {
    title: 'Bağımsız Uygulama: B2 Hücresini Bulma',
    description: 'Öğretmenin yönergesi olmadan B2 hücresini seçin.',
    goal: 'B2 hücresini seçerek tamamlayın.',
    targetCell: 'B2',
    expectedFormula: [],
    expectedResult: 0,
    hint: 'B2 hücresine tıklayın.',
    hints: {
      level1: 'B sütununa bakın.',
      level2: '2. satıra bakın.',
      level3: 'B2 hücresini seçin.',
    },
    narrationText: 'Şimdi tek başınıza B2 hücresini seçin.',
    workbookFactory: () => createIntroWorkbook(),
  },
  initialWorkbookFactory: () => createIntroWorkbook(),
};
