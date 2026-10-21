/**
 * Hücre Biçimlendirme & Tablo Tasarımı Dersi
 * Excel Akademi AI — Aşama 4: Evrensel Ders İçerik Motoru
 * Tür: interface_action (Arayüz ve İşlem Dersi)
 */

import type { Lesson } from '../../modules/learning/lessonTypes.ts';
import type { Workbook, Worksheet } from '../../modules/spreadsheet/types.ts';
import {
  DEFAULT_ROW_COUNT,
  DEFAULT_COL_COUNT,
  createEmptyWorksheet,
} from '../../modules/spreadsheet/spreadsheetState.ts';
import {
  validateCellFormatting,
  validateRangeSelection,
} from '../../modules/learning/taskValidator.ts';

/**
 * Creates initial unformatted sales table workbook for guided exercises
 */
export function createFormattingWorkbook(): Workbook {
  const sheet: Worksheet = {
    ...createEmptyWorksheet('sheet_formatting_1', 'Satış Raporu'),
    cells: {
      A1: { raw: 'Ürün Adı', computed: 'Ürün Adı' },
      B1: { raw: 'Satış Tutarı', computed: 'Satış Tutarı' },
      A2: { raw: 'Laptop', computed: 'Laptop' },
      B2: { raw: '24500', computed: 24500 },
      A3: { raw: 'Monitör', computed: 'Monitör' },
      B3: { raw: '4200', computed: 4200 },
      A4: { raw: 'Mekanik Klavye', computed: 'Mekanik Klavye' },
      B4: { raw: '1350', computed: 1350 },
      A5: { raw: 'Kablosuz Mouse', computed: 'Kablosuz Mouse' },
      B5: { raw: '650', computed: 650 },
      A6: { raw: 'Kulaklık', computed: 'Kulaklık' },
      B6: { raw: '890', computed: 890 },
      A7: { raw: 'Genel Toplam', computed: 'Genel Toplam' },
      B7: { raw: '=TOPLA(B2:B6)', computed: 31590 },
    },
    rowCount: DEFAULT_ROW_COUNT,
    colCount: DEFAULT_COL_COUNT,
  };

  return {
    id: 'wb_formatting',
    name: 'Satis_Raporu_Tasarim.xlsx',
    sheets: [sheet],
    activeSheetId: sheet.id,
  };
}

/**
 * Creates independent practice workbook: Quarterly Department Budget
 */
export function createFormattingPracticeWorkbook(): Workbook {
  const sheet: Worksheet = {
    ...createEmptyWorksheet('sheet_practice_formatting', 'Departman Bütçesi'),
    cells: {
      A1: { raw: 'Departman', computed: 'Departman' },
      B1: { raw: 'Yıllık Bütçe', computed: 'Yıllık Bütçe' },
      A2: { raw: 'Yazılım & Ar-Ge', computed: 'Yazılım & Ar-Ge' },
      B2: { raw: '185000', computed: 185000 },
      A3: { raw: 'Pazarlama & Büyüme', computed: 'Pazarlama & Büyüme' },
      B3: { raw: '92000', computed: 92000 },
      A4: { raw: 'Müşteri Başarısı', computed: 'Müşteri Başarısı' },
      B4: { raw: '46000', computed: 46000 },
      A5: { raw: 'İnsan Kaynakları', computed: 'İnsan Kaynakları' },
      B5: { raw: '34000', computed: 34000 },
      A6: { raw: 'Genel Toplam', computed: 'Genel Toplam' },
      B6: { raw: '=TOPLA(B2:B5)', computed: 357000 },
    },
    rowCount: DEFAULT_ROW_COUNT,
    colCount: DEFAULT_COL_COUNT,
  };

  return {
    id: 'wb_practice_formatting',
    name: 'Departman_Butcesi_2025.xlsx',
    sheets: [sheet],
    activeSheetId: sheet.id,
  };
}

export const cellFormattingLesson: Lesson = {
  id: 'cell_formatting',
  number: 3,
  title: 'Hücre Biçimlendirme & Tablo Tasarımı',
  lessonType: 'interface_action',
  category: 'Arayüz ve Biçimlendirme',
  level: 'Başlangıç',
  estimatedMinutes: 10,
  description:
    'Excel tablolarını profesyonel, okunaklı ve sunuma hazır hâle getirmek için kalın yazı tipi, finansal para birimi (₺), metin hizalama ve görsel stilleri öğrenin.',
  learningObjective:
    'Hücrelere kalın (bold) yazı tipi uygulamak, sayıları finansal para birimi (₺) olarak biçimlendirmek, metinleri hizalamak ve veri tablolarında görsel hiyerarşi oluşturmak.',
  learningOutcomes: [
    'Başlık satırlarını veri satırlarından ayırmak için Kalın (Ctrl+B) yazı stili uygulayabilme',
    'Sayısal tutarları hücre değerini bozmadan Para Birimi (₺) formatına dönüştürebilme',
    'Metin ve başlıkları tablonun düzenine göre ortalayabilme veya sola hizalayabilme',
    'Biçimlendirilmiş hücrelerin formüllerle ve otomatik hesaplamayla uyumunu koruyabilme',
  ],
  prerequisites: [
    {
      id: 'excel_intro',
      title: "Excel'e Giriş & Hücre Mantığı",
    },
  ],

  introNarration:
    'Excel Akademi AI’ya hoş geldiniz! Bu dersimizde ham ve dağınık verileri profesyonel, göz yormayan ve yöneticilere sunulabilecek kalitede tablolara dönüştürmeyi öğreneceğiz. Hücre stilleri, kalın yazı tipi, para birimi simgeleri ve hizalama araçlarını adım adım uygulayacağız.',

  topics: [
    {
      id: 'topic_cf_1',
      number: 1,
      title: 'Biçimlendirmenin Önemi ve Görsel Hiyerarşi',
      content:
        'Biçimlendirilmemiş bir Excel tablosunda başlıklar, sayılar ve toplamlar birbirine karışır. Okuyucu ilk bakışta tablonun ne anlattığını anlayamaz. Doğru biçimlendirme; başlıkları belirginleştirir, sayıların birimini netleştirir ve hata yapılmasını önler.',
      keyTakeaway: 'Biçimlendirme, tablonun okunabilirliğini ve güvenilirliğini katbekat artırır.',
      audioNarration:
        'Biçimlendirilmemiş bir tablo ham ve güvensiz görünür. Başlıkları vurgulamak ve sayılara doğru birimleri atamak, tablonun yönetim düzeyinde okunabilmesini sağlar.',
    },
    {
      id: 'topic_cf_2',
      number: 2,
      title: 'Kalın (Bold) Yazı Tipi ve Başlık Vurgusu',
      content:
        'Başlık satırları tablonun kılavuzudur. Başlık hücrelerini seçip Giriş sekmesindeki Kalın (B) butonuna basarak veya Ctrl+B kısayolunu kullanarak yazı tipini kalınlaştırabiliriz. Bu işlem tablonun taranmasını kolaylaştırır.',
      keyTakeaway: 'Başlıklar ve genel toplam satırları her zaman Kalın (Bold) yapılmalıdır.',
      audioNarration:
        'Başlıkları verilerden ayırmak için ilk adım kalın yazı tipidir. Seçili hücrelerde araç çubuğundaki B harfine tıklayarak veya klavyeden Ctrl+B tuşlarına basarak bunu anında yapabilirsiniz.',
    },
    {
      id: 'topic_cf_3',
      number: 3,
      title: 'Finansal Para Birimi (₺) Formatı',
      content:
        'En sık yapılan hata, sayının yanına klavyeden elle "TL" veya "₺" yazmaktır. Bunu yaptığınızda Excel sayıyı metne dönüştürür ve formüller çalışmaz! Doğru yöntem: Hücreye yalnızca ham sayıyı (örneğin 24500) yazıp araç çubuğundaki ₺ (Para Birimi) butonuna tıklamaktır.',
      keyTakeaway: 'Elle birim yazmayın; araç çubuğundaki ₺ Para Birimi biçimlendirmesini kullanın.',
      audioNarration:
        'Sayının yanına kesinlikle elle TL veya ₺ yazmayın. Çünkü Excel bu durumda sayıyı metin sanır ve toplayamaz. Doğru yöntem, araç çubuğundaki ₺ butonuna basmaktır.',
    },
    {
      id: 'topic_cf_4',
      number: 4,
      title: 'Metin ve Sayı Hizalama Kuralları',
      content:
        'Excel kuralı olarak metinler varsayılan olarak sola, sayılar ise basamak basamak hizalanabilmesi için sağa yaslanır. Tablo başlıkları veya kısa kodlar estetik nedenlerle ortalanabilir (Center). Hizalama butonları Giriş sekmesinde yer alır.',
      keyTakeaway: 'Metinler sola, sayılar sağa, başlıklar veya kısa kodlar ortaya hizalanır.',
      audioNarration:
        'Standart olarak sayılar sağa, metinler sola yaslanır. Başlıkları veya kısa metinleri ise daha dengeli bir görünüm için ortalayabilirsiniz.',
    },
    {
      id: 'topic_cf_5',
      number: 5,
      title: 'Hücre Biçimlendirmenin Formüllere Etkisi',
      content:
        'Hücre biçimlendirmesi yalnızca görünümü değiştirir, hücrenin ham değerini değiştirmez. B2 hücresinde "24.500,00 ₺" görünse bile TOPLA formülü arka plandaki 24500 sayısını kullanır. Böylece hesaplama hızı ve doğruluğu korunur.',
      keyTakeaway: 'Biçim vitrindir; arka plandaki ham matematiksel değer asla bozulmaz.',
      audioNarration:
        'Hücreye para birimi formatı verdiğinizde, formüller arka plandaki saf sayıyla işlem yapmaya devam eder. Böylece hem güzel bir görünüm elde edilir hem de hesaplama hatasız çalışır.',
    },
  ],

  explanationContent: {
    overview:
      'Hücre biçimlendirme; yazı tipi stili (kalın, italik), sayı biçimleri (para birimi, yüzde) ve metin hizalama araçlarıyla tabloların profesyonel düzeye getirilmesidir.',
    procedureSteps: [
      '1. Biçimlendirilecek hücreyi veya fareyi sürükleyerek hücre aralığını seçin.',
      '2. Üstteki Giriş araç çubuğundan istediğiniz stil düğmesine (B, I, ₺, Hizalama) tıklayın.',
      '3. Sonucu kontrol edin; ham sayının korunduğundan emin olun.',
    ],
    bestPractices: [
      'Tablo başlıklarını mutlaka Kalın (Bold) yapın.',
      'Parasal tutarlar için daima Para Birimi (₺) formatını kullanın; elle yazı yazmayın.',
      'Bir tabloda ikiden fazla yazı tipi veya karmaşık renkler kullanmaktan kaçının.',
      'Genel toplam satırını başlık gibi kalınlaştırarak verilerden ayırın.',
    ],
    commonMistakes: [
      'Hücreye "1500 TL" yazmak (formüllerin çalışmamasına yol açar).',
      'Tüm tabloyu tek düze, başlıksız ve aynı hizada bırakmak.',
    ],
  },

  solvedExample: {
    title: 'Çözümlü Örnek: Satış Tablosunu Biçimlendirme',
    scenario:
      'A1:B7 aralığında ürünler ve tutarları yer alıyor. Yönetim toplantısı için başlıkları kalınlaştırıp, satış tutarlarını ₺ para birimine dönüştürmemiz isteniyor.',
    dataSnippet: [
      { label: 'A1:B1', value: 'Ürün Adı / Satış Tutarı (Ham Metin)' },
      { label: 'B2:B6', value: '24500, 4200, 1350, 650, 890 (Ham Sayılar)' },
      { label: 'B7', value: '=TOPLA(B2:B6) -> 31590' },
    ],
    steps: [
      '1. Adım: A1 ve B1 başlık hücrelerini seçip Kalın (Bold) butonuna tıklarız.',
      '2. Adım: B2’den B6’ya kadar olan satış tutarlarını seçip araç çubuğundaki ₺ Para Birimi butonuna tıklarız.',
      '3. Adım: Genel Toplam satırını (A7:B7) da kalınlaştırarak tablonun hiyerarşisini tamamlarız.',
    ],
    explanation:
      'Yapılan bu 3 basit işlem sayesinde tablo bir taslaktan çıkıp yönetim kurulu toplantısında sunulabilecek net ve profesyonel bir rapora dönüşmüştür.',
    audioNarration:
      'Çözümlü örneğimizde gördüğümüz gibi, başlıkları kalınlaştırmak ve tutarlara ₺ formatı vermek tablomuzu anında profesyonel bir seviyeye taşıdı.',
  },

  glossary: [
    {
      id: 'gl_cf_bold',
      term: 'Kalın Yazı Tipi (Bold)',
      englishEquivalent: 'Bold',
      definition: 'Yazı karakterlerinin vuruş kalınlığını artırarak metni daha belirgin kılan biçimlendirme stili.',
      category: 'Yazı Tipi',
      example: 'Ctrl + B',
    },
    {
      id: 'gl_cf_currency',
      term: 'Para Birimi (Currency)',
      englishEquivalent: 'Currency Format',
      definition: 'Sayısal değerlerin yanına otomatik olarak para birimi simgesi (₺, $, €) ve binlik ayraç ekleyen sayı biçimi.',
      category: 'Sayı Biçimleri',
      example: '24500 -> 24.500,00 ₺',
    },
    {
      id: 'gl_cf_align',
      term: 'Metin Hizalama (Alignment)',
      englishEquivalent: 'Text Alignment',
      definition: 'Hücre içeriğinin hücre sınırları içinde sola, ortaya veya sağa dayalı konumlandırılması.',
      category: 'Hizalama',
      example: 'Ortala (Center)',
    },
    {
      id: 'gl_cf_hierarchy',
      term: 'Görsel Hiyerarşi (Visual Hierarchy)',
      englishEquivalent: 'Visual Hierarchy',
      definition: 'Tablo öğelerinin önem sırasına göre renk, kalınlık ve boyutla farklılaştırılarak okunabilirliğin kılavuzlanması.',
      category: 'Tasarım İlkeleri',
    },
  ],

  uiLocations: [
    {
      elementName: 'Kalın (Bold) Butonu',
      ribbonTab: 'Giriş',
      group: 'Yazı Tipi',
      shortcut: 'Ctrl + B',
      description: 'Seçili hücrelerdeki metin veya sayıları kalınlaştırır.',
    },
    {
      elementName: 'Para Birimi (₺) Butonu',
      ribbonTab: 'Giriş',
      group: 'Sayı',
      shortcut: 'Ctrl + Shift + $',
      description: 'Seçili sayı hücrelerine yerel para birimi simgesi ve basamak ayracı uygular.',
    },
    {
      elementName: 'Ortala (Center) Butonu',
      ribbonTab: 'Giriş',
      group: 'Hizalama',
      shortcut: 'Alt + H + A + C',
      description: 'Hücre içeriğini yatayda tam ortalar.',
    },
  ],

  realWorldScenarios: [
    {
      id: 'sc_cf_sales_report',
      industry: 'E-Ticaret & Satış',
      role: 'Finansal Raporlama Uzmanı',
      challenge: 'Genel Müdüre sunulan satış dökümünde sayılar ham görünüyor ve başlıklar verilerden ayırt edilemediği için sunum sırasında yanlış anlaşılmalar yaşanıyor.',
      solution: 'Başlık satırları kalınlaştırılır, tutarlar Para Birimi (₺) yapılır ve ürün isimleri ortalanarak temiz bir yönetim tablosu elde edilir.',
      dataDescription: 'Ürün listesi ve haftalık ciro tablosu.',
      appliedBenefit: 'Yönetim toplantısında rapor anında onaylanır; sayılar üzerinde tereddüt yaşanmaz.',
    },
  ],

  commonMistakes: [
    {
      id: 'err_cf_manual_tl',
      title: 'Hücreye Elle "TL" veya "₺" Yazmak',
      mistake: 'Hücreye "4200 TL" yazmak.',
      cause: 'Excel metin karakteri görünce hücreyi sayı tipinden çıkarır; toplama formülleri bu değeri hesaplayamaz.',
      solution: 'Hücreye sadece 4200 yazın, ardından Giriş sekmesindeki ₺ butonuna tıklayın.',
      badExample: '4200 TL',
      goodExample: '4.200,00 ₺ (Sayı biçimiyle)',
    },
    {
      id: 'err_cf_align_all_center',
      title: 'Tüm Sayıları Ortalamak',
      mistake: 'Büyük ve küçük basamaklı sayıların tamamını ortaya hizalamak.',
      cause: 'Sayılar ortalandığında basamaklar (birler, onlar, yüzler) alt alta gelmez ve gözle karşılaştırma zorlaşır.',
      solution: 'Sayıları her zaman sağa yaslı bırakın; yalnızca başlık veya kısa kodları ortalayın.',
      badExample: 'Tüm bütçe sütununu ortalamak',
      goodExample: 'Sayı sütununu sağa yaslı, başlığı ortalı bırakmak',
    },
  ],

  tasks: [
    {
      id: 'fmt_task_1',
      taskNumber: 1,
      actionType: 'cell_formatting',
      title: 'Adım 1 — Tablo Başlığını Kalın (Bold) Yapın',
      instruction:
        'A1 hücresini seçin ve üstteki araç çubuğunda bulunan B (Kalın) düğmesine tıklayın (veya Ctrl+B kısayolunu kullanın).',
      hint: 'A1 hücresine tıklayın ve üst araç çubuğundaki B harfine basın.',
      hints: {
        level1: 'A1 hücresindeki "Ürün Adı" başlığını kalınlaştırın.',
        level2: 'A1 hücresini seçin ve araç çubuğundaki B (Kalın) simgesine tıklayın.',
        level3: 'A1 hücresine tıklayın, ardından araç çubuğunun solundaki B butonuna basın veya klavyenizden Ctrl+B tuşlarına basın.',
      },
      narrationText:
        'İlk adımımız başlığı belirginleştirmek. A1 hücresindeki Ürün Adı başlığına tıklayın ve araç çubuğundaki Kalın düğmesine basarak başlığı vurgulayın.',
      targetCell: 'A1',
      validate: (sheet) => validateCellFormatting(sheet, 'A1', { bold: true }, 'Kalın (Bold) yazı tipi'),
    },
    {
      id: 'fmt_task_2',
      taskNumber: 2,
      actionType: 'cell_formatting',
      title: 'Adım 2 — Satış Tutarını Para Birimi (₺) Formatına Çevirin',
      instruction:
        'B2 hücresini seçin ve araç çubuğundaki ₺ (Para Birimi) düğmesine tıklayarak sayıyı finansal formata dönüştürün.',
      hint: 'B2 hücresini seçip araç çubuğundaki ₺ simgesine tıklayın.',
      hints: {
        level1: 'B2 hücresindeki 24500 sayısına para birimi ekleyin.',
        level2: 'B2 hücresini seçip araç çubuğunda B ve I harflerinin sağındaki ₺ butonuna tıklayın.',
        level3: 'B2 hücresine tıklayın, ardından araç çubuğunda üzerinde ₺ sembolü olan butona basın. Değer 24.500 ₺ olarak görünecektir.',
      },
      narrationText:
        'Harika! Şimdi B2 hücresindeki 24500 satış tutarını seçin ve araç çubuğundaki ₺ simgesine tıklayarak Para Birimi biçimlendirmesi uygulayın.',
      targetCell: 'B2',
      validate: (sheet) => validateCellFormatting(sheet, 'B2', { format: 'currency' }, 'Para Birimi (₺) formatı'),
    },
    {
      id: 'fmt_task_3',
      taskNumber: 3,
      actionType: 'cell_formatting',
      title: 'Adım 3 — Başlığı Ortaya Hizalayın',
      instruction:
        'A1 hücresini seçin ve araç çubuğundaki Ortala düğmesine basarak başlık metnini hücrenin tam ortasına konumlandırın.',
      hint: 'A1 hücresini seçip araç çubuğundaki Ortala simgesine tıklayın.',
      hints: {
        level1: 'A1 başlığını hücre içinde ortalayın.',
        level2: 'A1 hücresine tıklayın ve araç çubuğunda ortalanmış çizgiler olan butonu seçin.',
        level3: 'A1 hücresini seçin ve araç çubuğundaki Hizalama grubundan Ortala düğmesine basın.',
      },
      narrationText:
        'Çok iyi! Şimdi A1 hücresindeki başlığı daha dengeli göstermek için araç çubuğundaki Ortala butonuna basın.',
      targetCell: 'A1',
      validate: (sheet) => validateCellFormatting(sheet, 'A1', { align: 'center' }, 'Ortalı hizalama'),
    },
    {
      id: 'fmt_task_4',
      taskNumber: 4,
      actionType: 'cell_formatting',
      title: 'Adım 4 — Genel Toplam Satırını Kalın Yapın',
      instruction:
        'A7 hücresindeki "Genel Toplam" etiketini seçin ve B (Kalın) düğmesine basarak tablonun alt sınırını belirginleştirin.',
      hint: 'A7 hücresini seçip Kalın (B) butonuna tıklayın.',
      hints: {
        level1: 'A7 hücresini kalınlaştırın.',
        level2: 'A7 hücresine tıklayın ve araç çubuğundaki B butonuna basın.',
        level3: 'A7 hücresini seçip Ctrl+B tuşlarına veya araç çubuğundaki B simgesine tıklayın.',
      },
      narrationText:
        'Son rehberli adımımız: Tablonun en altındaki A7 Genel Toplam hücresini seçin ve Kalın yaparak toplamın verilerden ayrılmasını sağlayın.',
      targetCell: 'A7',
      validate: (sheet) => validateCellFormatting(sheet, 'A7', { bold: true }, 'Kalın (Bold) yazı tipi'),
    },
  ],

  independentPractice: {
    title: 'Bağımsız Uygulama: Yıllık Departman Bütçesi Tablosu',
    description:
      'Rehber olmadan, yeni açılan Departman Bütçesi tablosunda A1 başlığını kalın yapın ve B2 bütçe hücresine Para Birimi (₺) formatı uygulayın.',
    goal: 'A1 hücresini Kalın (Bold) yapın ve B2 hücresini Para Birimi (₺) olarak biçimlendirin.',
    targetCell: 'A1',
    hint: 'A1 hücresini seçip B butonuna basın; B2 hücresini seçip ₺ butonuna basın.',
    hints: {
      level1: 'A1 başlığını kalınlaştırın ve B2 hücresini para birimi yapın.',
      level2: 'A1 hücresinde Kalın (Ctrl+B), B2 hücresinde ₺ simgesini kullanın.',
      level3: 'A1’e tıklayıp B butonuna basın. Ardından B2’ye tıklayıp ₺ butonuna basın.',
    },
    narrationText:
      'Şimdi bağımsız uygulama zamanı! Yeni açılan departman bütçesi tablosunda A1 hücresini kalınlaştırın ve B2 hücresine para birimi formatı uygulayın. Başarılar!',
    workbookFactory: () => createFormattingPracticeWorkbook(),
    customValidator: (sheet) => {
      const a1Val = validateCellFormatting(sheet, 'A1', { bold: true }, 'A1 Kalın');
      if (!a1Val.isValid) return a1Val;
      const b2Val = validateCellFormatting(sheet, 'B2', { format: 'currency' }, 'B2 Para Birimi');
      if (!b2Val.isValid) return b2Val;
      return {
        isValid: true,
        message: 'Tebrikler! Bağımsız uygulama tablosunu başarıyla biçimlendirdiniz!',
      };
    },
  },

  quizQuestions: [
    {
      id: 'quiz_cf_1',
      question: 'Excel’de bir hücreye "4500 TL" yazmak yerine 4500 yazıp Para Birimi (₺) formatı uygulamanın temel sebebi nedir?',
      options: [
        'Hücreye elle TL yazıldığında Excel hücreyi metin olarak görür ve matematiksel formüller bu hücreyi toplayamaz.',
        'Elle yazılan TL harfleri bilgisayarın belleğinde daha fazla yer kaplar.',
        'Excel sadece İngilizce para birimlerini destekler.',
        'Elle yazıldığında hücrenin rengi otomatik olarak kırmızıya döner.',
      ],
      correctIndex: 0,
      explanation: 'Excel metin içeren hücreleri sayı olarak kabul etmez. Para Birimi biçimlendirmesi ham sayıyı korurken vitrine ₺ simgesi ekler, böylece formüller sorunsuz çalışır.',
      difficulty: 'medium',
    },
    {
      id: 'quiz_cf_2',
      question: 'Seçili bir hücre veya hücre aralığını Kalın (Bold) yapmak için hangi klavye kısayolu kullanılır?',
      options: [
        'Ctrl + B',
        'Ctrl + Z',
        'Ctrl + S',
        'Alt + F4',
      ],
      correctIndex: 0,
      explanation: 'Ctrl + B (İngilizce Bold) veya Türkçe sürümlerde Ctrl + K seçili hücrelerin yazı tipini kalınlaştırır.',
      difficulty: 'easy',
    },
    {
      id: 'quiz_cf_3',
      question: 'Standart Excel kurallarına göre metinler ve sayılar varsayılan olarak hangi yöne yaslanır?',
      options: [
        'Metinler sola, sayılar sağa yaslanır.',
        'Metinler sağa, sayılar sola yaslanır.',
        'Hem metinler hem de sayılar varsayılan olarak ortalanır.',
        'Rakamlar sola, harfler yukarı yaslanır.',
      ],
      correctIndex: 0,
      explanation: 'Metinler soldan sağa okunduğu için sola yaslanır; sayılar ise basamak değerlerinin (birler, onlar, yüzler) alt alta gelebilmesi için sağa yaslanır.',
      difficulty: 'easy',
    },
  ],

  summary: [
    'Hücre biçimlendirme; başlıkları, sayıları ve toplamları görsel hiyerarşiyle birbirinden ayırır.',
    'Yazı tipini Kalın (Bold) yapmak için Giriş sekmesindeki B butonu veya Ctrl+B kullanılır.',
    'Sayılara elle para birimi yazılmaz; araç çubuğundaki ₺ simgesiyle finansal biçim verilir.',
    'Metinler sola, sayılar sağa yaslı tutulmalıdır; başlıklar dengeli bir görünüm için ortalanabilir.',
    'Biçimlendirme vitrindir; arka plandaki ham sayıyı veya formülü asla değiştirmez.',
  ],

  initialWorkbookFactory: () => createFormattingWorkbook(),
};
