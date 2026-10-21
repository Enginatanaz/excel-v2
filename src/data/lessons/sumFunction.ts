/**
 * TOPLA (SUM) Fonksiyonu Dersi - Excel Akademi AI
 * Aşama 3: Doğal Sesli Öğretmen ve Adım Adım Öğrenme Motoru
 *
 * İçerik:
 * 1. 15 Zorunlu Konu Anlatımı Başlığı
 * 2. Çözümlü Örnek
 * 3. 5 Adımlı Rehberli Uygulama ve 3 Seviyeli Kademeli İpuçları
 * 4. Bağımsız Uygulama Senaryosu (Aylık İşletme Giderleri)
 * 5. Gerçek Veri Doğrulama ve Ders Sonu Değerlendirme
 */

import type { Lesson } from '../../modules/learning/lessonTypes.ts';
import {
  createDefaultWorkbook,
  createIndependentPracticeWorkbook,
} from '../../modules/spreadsheet/spreadsheetState.ts';
import {
  validateCellSelection,
  validateFormulaBarOrEditFocus,
  validateFormulaInput,
  validateCellNumericResult,
  validateAutoRecalculation,
} from '../../modules/learning/taskValidator.ts';

export const sumFunctionLesson: Lesson = {
  id: 'sum_function',
  number: 2,
  title: 'TOPLA (SUM) Fonksiyonu',
  lessonType: 'formula_function',
  category: 'Temel Matematiksel Formüller',
  level: 'Başlangıç',
  estimatedMinutes: 12,
  description:
    'Excel’de sayıları tek tek toplamak yerine hücre aralığı belirterek hızlı, hatasız ve otomatik güncellenen formüller oluşturmayı öğrenin.',
  learningObjective:
    'TOPLA fonksiyonunun sözdizimini kavramak, ardışık hücre aralıklarını (B2:B6) ifade edebilmek, formül çubuğunu kullanmak ve otomatik yeniden hesaplama mantığını pekiştirmek.',
  learningOutcomes: [
    'Excel formül sözdizimini (= ile başlama kuralı) hatasız uygulayabilme',
    'İki nokta (:) ile ardışık hücre aralığı (B2:B6) belirtebilme',
    'TOPLA ve SUM fonksiyonlarını büyük/küçük harf fark etmeksizin çalıştırabilme',
    'Bağımlı hücrelerin otomatik yeniden hesaplama mantığını kavrama',
  ],
  prerequisites: [
    {
      id: 'excel_intro',
      title: "Excel'e Giriş & Hücre Mantığı",
    },
  ],

  introNarration:
    'Excel Akademi AI’ya hoş geldiniz! Bu dersimizde iş hayatında ve günlük tablolarda en çok başvurulan TOPLA fonksiyonunu birlikte öğreneceğiz. Hiç Excel bilmediğinizi varsayarak adım adım ilerleyeceğiz. Önce konuyu detaylarıyla inceleyeceğiz, ardından simülatör üzerinde rehberli alıştırmalar yapacağız. Hazırsanız başlayalım!',

  topics: [
    {
      id: 'topic_1',
      number: 1,
      title: 'TOPLA Fonksiyonunun Amacı',
      content:
        'TOPLA fonksiyonu, belirttiğimiz tek tek hücreleri veya geniş hücre bloklarını hatasız ve anında toplamak için geliştirilmiş temel bir Excel aracıdır. Satış rakamları, bütçeler veya masraf listeleri gibi sayı dizilerini toplarken insan hatasını sıfıra indirir.',
      keyTakeaway: 'Sayı dizilerini hatasız ve tek bir hamlede toplar.',
      audioNarration:
        'TOPLA fonksiyonunun temel amacı, tablomuzdaki sayısal değerleri hatasız ve hızlı biçimde toplamaktır. Yüzlerce sayıyı tek tek hesap makinesine yazmak yerine Excel’e bu görevi tek bir komutla veririz.',
    },
    {
      id: 'topic_2',
      number: 2,
      title: 'Hangi Durumlarda Kullanılır?',
      content:
        'Bütçe tablolarında, haftalık/aylık ciro raporlarında, fatura dökümlerinde ve stok miktarlarının hesaplanmasında kullanılır. Bir sütunun veya satırın genel toplamını almak istediğiniz her yerde ilk tercih TOPLA fonksiyonudur.',
      keyTakeaway: 'Ciro, bütçe, fatura ve stok gibi tüm kümülatif tablolarda kullanılır.',
      audioNarration:
        'Satış raporlarında genel ciro çıkarırken, aylık şirket bütçesinde giderleri toplarken veya bir depodaki toplam stok adetlerini hesaplarken her zaman TOPLA fonksiyonundan yararlanırız.',
    },
    {
      id: 'topic_3',
      number: 3,
      title: 'Formül ve Fonksiyon Arasındaki İlişki',
      content:
        'Excel’de eşittir (=) işaretiyle başlayan her matematiksel veya mantıksal ifade bir "formül"dür. "Fonksiyon" ise Excel içinde önceden tanımlanmış özel hesaplama kalıplarıdır. Yani =TOPLA(B2:B6) yazdığınızda, TOPLA fonksiyonunu içeren bir formül oluşturmuş olursunuz.',
      keyTakeaway: 'Formül genel ifadeyi, fonksiyon ise önceden tanımlı hesaplama kuralını belirtir.',
      audioNarration:
        'Excel’de eşittir işaretiyle başlayan her ifade bir formüldür. Fonksiyon ise Excel’in hafızasında önceden tanımlanmış hazır işlem motorudur. TOPLA ifadesini bir formülün içinde çağırırız.',
    },
    {
      id: 'topic_4',
      number: 4,
      title: 'Fonksiyonun Sözdizimi (Syntax)',
      content:
        'Türkçe Excel’de =TOPLA(sayı1; [sayı2]; ...) veya aralık için =TOPLA(başlangıç:bitiş) şeklinde yazılır. İngilizce Excel sürümlerinde aynı fonksiyon =SUM(...) adını alır. Excel Akademi motoru her iki dili de kabul eder.',
      keyTakeaway: '=TOPLA(aralık) veya İngilizce =SUM(range)',
      audioNarration:
        'Fonksiyonun yazım kuralı çok basittir: Eşittir işareti koyarız, ardından büyük veya küçük harfle TOPLA yazarız, parantez açıp toplanacak aralığı belirtir ve parantezi kapatırız.',
    },
    {
      id: 'topic_5',
      number: 5,
      title: 'Hücre Referanslarının Anlamı',
      content:
        'Excel çalışma sayfası sütun harfleri (A, B, C...) ve satır numaralarından (1, 2, 3...) oluşur. B2 ifadesi, B sütunu ile 2. satırın kesiştiği kutucuğu temsil eden benzersiz bir koordinattır.',
      keyTakeaway: 'Sütun harfi + satır numarası = Hücre adresi (örn: B2).',
      audioNarration:
        'Hücre referansı, tablodaki bir kutucuğun adresidir. Örneğin B2 dediğimizde, B sütunu ile ikinci satırın kesişimindeki değeri işaret etmiş oluruz.',
    },
    {
      id: 'topic_6',
      number: 6,
      title: 'Hücre Aralığının Anlamı ve İki Nokta (:)',
      content:
        'Birden fazla ardışık hücreyi topluca belirtmek için aralık gösterimi kullanılır. İki nokta (:) işareti, "-den ... -e kadar" anlamına gelir. B2:B6 yazıldığında B2, B3, B4, B5 ve B6 hücrelerinin tümü kapsanır.',
      keyTakeaway: 'İki nokta (:) ardışık bir hücre bloğunu ifade eder.',
      audioNarration:
        'İki nokta üst üste işareti Excel dilinde köprü kurar. B2 iki nokta B6 yazdığımızda, B2’den başla ve B6’ya kadar olan tüm hücreleri dahil et demiş oluruz.',
    },
    {
      id: 'topic_7',
      number: 7,
      title: 'B2:B6 İfadesi Nasıl Okunur?',
      content:
        'Bu ifade "B2’den B6’ya kadar olan hücre aralığı" şeklinde okunur. Araya virgül veya noktalı virgül koymak yerine iki nokta koymak, aradaki tüm satırların formüle otomatik dahil edilmesini sağlar.',
      keyTakeaway: 'Okunuşu: "B2’den B6’ya kadar".',
      audioNarration:
        'B2 iki nokta B6 ifadesi, B2’den B6’ya kadar anlamına gelir. Böylece aradaki üç hücreyi tek tek yazmak zorunda kalmazsınız.',
    },
    {
      id: 'topic_8',
      number: 8,
      title: 'Formül Nasıl Yazılır?',
      content:
        '1. Toplamın görüneceği boş hücre seçilir (Örn: B7).\n2. Hücreye veya üstteki Formül Çubuğuna tıklanır.\n3. Klavyeden =TOPLA(B2:B6) yazılır.\n4. Parantez kapatılır.',
      keyTakeaway: 'Hedef hücreyi seçin, formül çubuğuna formülü yazın.',
      audioNarration:
        'Formülü yazarken önce sonucu görmek istediğimiz boş hücreye tıklarız. Ardından formül çubuğuna geçip eşittir TOPLA parantez içinde B2 iki nokta B6 yazarız.',
    },
    {
      id: 'topic_9',
      number: 9,
      title: 'Enter İle Formülü Onaylama',
      content:
        'Excel’de formül yazarken klavyeden Enter tuşuna basılmadığı sürece formül hesaplanmaz ve düzenleme modunda kalır. Enter tuşuna bastığınız an Excel ifadeyi derler, hesaplar ve sonucu ekrana getirir.',
      keyTakeaway: 'Enter tuşuna basmak hesaplamayı tetikler.',
      audioNarration:
        'Çok önemli bir kural: Formülü yazdıktan sonra mutlaka Enter tuşuna basmalısınız. Enter’a basana kadar formül hesaplanmaz ve düzenleme modunda bekler.',
    },
    {
      id: 'topic_10',
      number: 10,
      title: 'Sonucun Hesaplanma Mantığı',
      content:
        'B2:B6 aralığında 350, 450, 1200, 650 ve 400 sayıları bulunuyorsa, TOPLA fonksiyonu bu sayıları toplar:\n350 + 450 + 1200 + 650 + 400 = 3050.\nHücrede hesaplanan 3050 görünürken, formül çubuğunda formülün kendisi saklanır.',
      keyTakeaway: 'Hücrede hesaplanan sonuç, formül çubuğunda ise formül görünür.',
      audioNarration:
        'Fonksiyon arka planda hücrelerdeki sayıları toplar. Örneğin 350, 450, 1200, 650 ve 400 değerleri toplandığında ekranda tam 3050 sonucunu görürüz.',
    },
    {
      id: 'topic_11',
      number: 11,
      title: 'Otomatik Yeniden Hesaplama (Auto Recalculation)',
      content:
        'TOPLA fonksiyonunun en büyük gücü dinamik olmasıdır. Eğer ürünlerden birinin satış tutarını (örneğin B3’ü 450’den 500’e) değiştirirseniz, B7 hücresindeki toplam formülü tekrar yazmanıza gerek kalmadan kendiliğinden 3100’e yükselir!',
      keyTakeaway: 'Hücre değerleri değiştikçe formül sonucu anında güncellenir.',
      audioNarration:
        'İşte Excel’in en harika yanı: Bir ürünün fiyatı değiştiğinde toplamı yeniden hesaplamanız gerekmez. Örneğin B3 değerini 500 yaptığınız an, toplam hücresi kendiliğinden 3100 olur.',
    },
    {
      id: 'topic_12',
      number: 12,
      title: 'Boş Hücreler ve Metinlerin Davranışı',
      content:
        'TOPLA fonksiyonu aralık içindeki metinleri (örneğin ürün adlarını) veya boş bırakılmış hücreleri otomatik olarak göz ardı eder ve 0 kabul eder. Bu sayede tablonuzda araya boş satır girse bile formül hata vermez.',
      keyTakeaway: 'Metinler ve boş hücreler toplamı bozmaz, 0 sayılır.',
      audioNarration:
        'TOPLA fonksiyonu son derece akıllıdır. Aralıktaki boş hücreleri veya metinleri otomatik olarak görmezden gelir, sadece geçerli sayıları toplar.',
    },
    {
      id: 'topic_13',
      number: 13,
      title: 'Sık Yapılan Hatalar',
      content:
        '1. İki nokta (:) yerine noktalı virgül (;) koymak: =TOPLA(B2;B6) yazarsanız aradaki B3, B4, B5 toplanmaz!\n2. Eşittir (=) işaretini unutmak: Formül metin olarak kalır.\n3. Parantezi kapatmamak: Excel sözdizimi hatası verir.\n4. Kendi hücresini dahil etmek: B7 hücresine =TOPLA(B2:B7) yazarsanız döngüsel başvuru (#DÖNGÜ!) hatası oluşur.',
      keyTakeaway: 'Noktalı virgül değil iki nokta kullanın; döngüsel başvurudan kaçının.',
      audioNarration:
        'En sık yapılan hata, iki nokta yerine noktalı virgül kullanmaktır. B2 noktalı virgül B6 yazarsanız yalnızca o iki hücre toplanır, aradakiler atlanır. Mutlaka iki nokta üst üste kullanmalıyız.',
    },
    {
      id: 'topic_14',
      number: 14,
      title: 'TOPLA İle Sayıları Elle Toplama Arasındaki Fark',
      content:
        'Manuel toplama: =B2+B3+B4+B5+B6\nBu yöntem 5 satırda idare edebilir ancak 500 satırda imkansızdır. Ayrıca tabloya yeni satır eklendiğinde + işaretli formüller bozulurken, TOPLA fonksiyonu yeni hücreleri otomatik içine alır.',
      keyTakeaway: 'Manuel toplama zahmetli ve kırılgandır; TOPLA esnek ve otomatiktir.',
      audioNarration:
        'Sayıları tek tek artı işaretiyle toplamak hem yorucudur hem de araya yeni bir ürün satırı eklendiğinde formül güncellenmez. TOPLA fonksiyonu ise dinamik olarak aralığa uyum sağlar.',
    },
    {
      id: 'topic_15',
      number: 15,
      title: 'Gerçek İş Hayatında Kullanım Örnekleri',
      content:
        'Finans departmanları günlük kasa kapanışlarında, e-ticaret siteleri haftalık sipariş cirolarında, insan kaynakları prim hesaplamalarında TOPLA fonksiyonunu ana hesaplama aracı olarak kullanır.',
      keyTakeaway: 'Muhasebe, finans, lojistik ve insan kaynaklarının temel formülüdür.',
      audioNarration:
        'Gerçek iş hayatında ister küçük bir esnaf olun ister büyük bir şirkette finans yöneticisi, gün sonu cirolarından aylık bütçelere kadar her hesaplamada TOPLA fonksiyonu ile çalışacaksınız.',
    },
  ],

  explanationContent: {
    overview:
      'Excel’de en sık kullanılan fonksiyon olan TOPLA, parametre olarak verilen hücrelerin veya hücre aralıklarının toplamını hesaplar. Manuel toplama işlemi yerine (=B2+B3+B4+...) TOPLA kullanmak onlarca veya yüzlerce satırı tek bir hamlede toplamanızı sağlar ve sonradan araya satır eklendiğinde formül otomatik genişler.',
    syntax: '=TOPLA(başlangıç_hücresi:bitiş_hücresi) veya =SUM(start:end)',
    parameters: [
      {
        name: 'aralık (ör: B2:B6)',
        description: 'Toplanacak hücrelerin başlangıç ve bitiş adresleri. İki nokta üst üste (:) aralık belirtir.',
        required: true,
      },
    ],
    bestPractices: [
      'Toplanacak hücreler ardışık ise her hücreyi tek tek toplamak yerine daima B2:B6 gibi aralık gösterimi kullanın.',
      'Türkçe Excel’de =TOPLA(), İngilizce Excel’de ise =SUM() adıyla kullanılır. Her iki dili de kullanabilirsiniz.',
      'Sütun toplamı alırken toplam hücresini her zaman listenin hemen altındaki boş satıra konumlandırın.',
      'Değerler güncellendiğinde formülü silip tekrar yazmayın; Excel otomatik olarak yeniden hesaplar.',
    ],
    commonMistakes: [
      'Aralık yazarken iki nokta (:) yerine noktalı virgül (;) kullanmak: B2;B6 sadece B2 ve B6 hücrelerini toplar, aradakileri atlar!',
      'Eşittir (=) işaretini unutmak: Excel ifadeyi matematiksel formül yerine düz metin kabul eder.',
      'Döngüsel başvuru: Sonucun yazıldığı B7 hücresini aralığa dahil ederek =TOPLA(B2:B7) yazmak (#DÖNGÜ! hatası verir).',
    ],
  },

  solvedExample: {
    title: 'Çözümlü Örnek: Haftalık Mağaza Satış Tablosu',
    scenario:
      'Teknoloji mağazamızın 5 farklı ürün grubundan (Mouse, Klavye, Ekran, Kamera, Kulaklık) elde ettiği haftalık satış tutarlarını toplayarak toplam ciroyu bulmak istiyoruz.',
    dataSnippet: [
      { label: 'B2 (Mouse)', value: '350 ₺' },
      { label: 'B3 (Klavye)', value: '450 ₺' },
      { label: 'B4 (Ekran)', value: '1.200 ₺' },
      { label: 'B5 (Kamera)', value: '650 ₺' },
      { label: 'B6 (Kulaklık)', value: '400 ₺' },
      { label: 'B7 (Toplam)', value: 'Hesaplanacak' },
    ],
    formula: '=TOPLA(B2:B6)',
    result: '3.050 ₺',
    explanation:
      'B2 hücresinden başlayıp B6 hücresine kadar uzanan aralıktaki 5 sayı toplanır:\n350 + 450 + 1200 + 650 + 400 = 3050 ₺.',
    steps: [
      '1. Sonucun yazılacağı B7 hücresi fare ile tıklanarak aktif hale getirilir.',
      '2. Formül çubuğuna veya doğrudan hücreye =TOPLA(B2:B6) yazılır.',
      '3. Klavyeden Enter tuşuna basılarak hesaplama onaylanır.',
      '4. B7 hücresinde 3.050 ₺ sonucu görüntülenir.',
    ],
    audioNarration:
      'Şimdi çözümlü örneğimize bakalım. Tablomuzda 5 ürünün satışları B2’den B6’ya kadar sıralanmış durumda. B7 hücresine =TOPLA(B2:B6) formülünü yazdığımızda, Excel bu beş sayıyı toplar: 350 artı 450 artı 1200 artı 650 artı 400 eşittir tam 3050 ₺. Şimdi birlikte rehberli uygulamaya geçelim!',
  },

  tasks: [
    {
      id: 'sum_task_1',
      taskNumber: 1,
      title: 'Adım 1 — Doğru Hücreyi Seç',
      instruction:
        'Toplam sonucunu yazdırmak istediğimiz hücreyi belirlemeliyiz. Lütfen tablonun "Toplam" satırındaki boş hücre olan B7 hücresine tıklayın.',
      hint: 'Tabloda "Toplam" yazısının hemen sağındaki boş hücre B7 hücresidir.',
      hints: {
        level1: 'Tabloda ürün tutarlarının hemen altındaki boş hücreye dikkat edin.',
        level2: 'B sütununda 7. satırda yer alan "Toplam" etiketinin sağındaki kutuya tıklayın.',
        level3: 'Hedef hücre B7’dir. Fare ile B7 kutusuna tıklayın ya da sol üstteki Ad Kutusuna B7 yazıp Enter’a basın.',
      },
      narrationText:
        'Merhaba! İlk görevimiz, toplam sonucunun yazılacağı hücreyi seçmek. Tabloda ürün satışlarının hemen altındaki boş hücre olan B7 hücresine tıklayın.',
      targetCell: 'B7',
      validate: (sheet, activeCell) => validateCellSelection(activeCell, 'B', 7, 'Toplam'),
    },
    {
      id: 'sum_task_2',
      taskNumber: 2,
      title: 'Adım 2 — Formül Çubuğunu / Giriş Alanını Tanı',
      instruction:
        'B7 hücresi seçiliyken, üstteki "fx" simgeli Formül Çubuğuna tıklayın veya klavyenizden F2 tuşuna basarak formül giriş alanını etkinleştirin.',
      hint: 'Formül çubuğuna tıklayabilir, B7 hücresine çift tıklayabilir veya F2 tuşuna basabilirsiniz.',
      hints: {
        level1: 'Tablonun hemen üzerinde Ad Kutusunun sağındaki uzun beyaz çubuğa bakın.',
        level2: 'Formül çubuğuna tıklayın veya klavyeden F2 tuşuna basarak düzenlemeyi başlatın.',
        level3: 'B7 seçiliyken klavyenizden F2 tuşuna basın veya fareyle üstteki "fx" yanındaki yazı alanına tıklayın.',
      },
      narrationText:
        'Harika! Şimdi formül giriş alanını etkinleştirelim. Üstteki Formül Çubuğuna tıklayın ya da klavyenizden F2 tuşuna basarak düzenleme moduna geçin.',
      targetCell: 'B7',
      validate: (sheet, activeCell, isEditing) =>
        validateFormulaBarOrEditFocus(activeCell, 'B', 7, isEditing),
    },
    {
      id: 'sum_task_3',
      taskNumber: 3,
      title: 'Adım 3 — TOPLA Formülünü Yaz ve Onayla',
      instruction:
        'B7 hücresine =TOPLA(B2:B6) formülünü yazın ve klavyenizden ENTER tuşuna basarak formülü onaylayın.',
      hint: 'Eşittir işaretiyle başlayın: =TOPLA(B2:B6) yazıp mutlaka Enter’a basın.',
      hints: {
        level1: 'Excel’de tüm formüller = işaretiyle başlar.',
        level2: 'B2’den B6’ya kadar olan aralığı belirtmek için iki nokta kullanın: =TOPLA(B2:B6).',
        level3: 'Tam olarak =TOPLA(B2:B6) yazın ve mutlaka Enter tuşuna basarak formülü tamamlayın.',
      },
      narrationText:
        'Şimdi formülü yazma vakti. Eşittir TOPLA, parantez içinde B2 iki nokta B6 yazın ve mutlaka klavyenizden Enter tuşuna basarak formülü onaylayın.',
      targetCell: 'B7',
      validate: (sheet) =>
        validateFormulaInput(sheet, 'B7', [
          '=TOPLA(B2:B6)',
          '=SUM(B2:B6)',
        ]),
    },
    {
      id: 'sum_task_4',
      taskNumber: 4,
      title: 'Adım 4 — Sonucu Doğrula',
      instruction:
        'Enter’a bastıktan sonra B7 hücresinde hesaplanan değeri inceleyin. Sonucun tam olarak 3.050 ₺ olarak hesaplandığını doğrulayın.',
      hint: 'B7 hücresinde 350 + 450 + 1200 + 650 + 400 işleminin sonucu olan 3050 görünmelidir.',
      hints: {
        level1: 'B7 hücresindeki sayısal sonuca bakın.',
        level2: 'Beş ürünün toplamı 3050 olmalıdır.',
        level3: 'B7 hücresinin computed değeri 3050 olmalıdır. Formülünüz =TOPLA(B2:B6) değilse düzeltin.',
      },
      narrationText:
        'Tebrikler! Enter tuşuna bastınız. Şimdi B7 hücresindeki değeri inceleyin. Beş ürünün satış tutarının tam olarak 3.050 ₺ olduğunu doğrulayın.',
      targetCell: 'B7',
      validate: (sheet) => validateCellNumericResult(sheet, 'B7', 3050),
    },
    {
      id: 'sum_task_5',
      taskNumber: 5,
      title: 'Adım 5 — Bağımsız Kontrol: Otomatik Yeniden Hesaplama',
      instruction:
        'Excel’in dinamik hesaplama gücünü görmek için B3 hücresindeki Klavye tutarını 450 yerine 500 olarak değiştirin ve Enter’a basın. B7 hücresindeki toplamın otomatik olarak 3.100 ₺’ye yükseldiğini gözlemleyin!',
      hint: 'B3 hücresine tıklayın, 500 yazıp Enter’a basın.',
      hints: {
        level1: 'B3 hücresindeki 450 değerini 500 yapın.',
        level2: 'B3’e 500 yazıp Enter’a bastığınızda B7’deki formülü tekrar yazmanıza gerek kalmaz.',
        level3: 'B3 hücresine tıklayın, 500 yazın ve Enter’a basın. B7 toplamı kendiliğinden 3100 olacaktır.',
      },
      narrationText:
        'Mükemmel! Şimdi son ve en önemli adım: Otomatik Yeniden Hesaplama. B3 hücresindeki değeri 500 olarak değiştirin ve Enter’a basın. Toplam hücresinin formülü hiç değiştirmeden kendiliğinden 3.100 ₺ olduğunu görün!',
      targetCell: 'B3',
      validate: (sheet) => validateAutoRecalculation(sheet, 'B3', 500, 'B7', 3100),
    },
  ],

  independentPractice: {
    title: 'Bağımsız Uygulama: Aylık İşletme Giderleri Tablosu',
    description:
      'Öğretmenin adım adım yönergeleri olmadan, yeni bir işletme tablosunda TOPLA fonksiyonunu tek başınıza uygulayın.',
    goal: 'B7 hücresine formül yazarak 5 farklı gider kaleminin toplamını (Kira: 2500, Elektrik: 450, İnternet: 250, Mutfak: 800, Kırtasiye: 350) hesaplayın.',
    targetCell: 'B7',
    expectedFormula: ['=TOPLA(B2:B6)', '=SUM(B2:B6)'],
    expectedResult: 4350,
    hint: 'B7 hücresine tıklayıp =TOPLA(B2:B6) yazın ve Enter’a basın. Beklenen sonuç 4.350 ₺’dir.',
    hints: {
      level1: 'Giderlerin toplandığı B7 hücresine formül yazın.',
      level2: 'B2’den B6’ya kadar olan giderleri toplamak için =TOPLA(B2:B6) formülünü kullanın.',
      level3: 'B7 hücresine =TOPLA(B2:B6) yazıp Enter’a basın. Sonuç 4350 ₺ olacaktır.',
    },
    narrationText:
      'Şimdi bağımsız uygulama zamanı! Karşınızda bir aylık işletme giderleri tablosu var. B2’den B6’ya kadar olan giderleri B7 hücresinde TOPLA fonksiyonu ile toplayın. Başarılar!',
    workbookFactory: () => createIndependentPracticeWorkbook(),
  },

  glossary: [
    {
      id: 'gl_syntax',
      term: 'Sözdizimi (Syntax)',
      englishEquivalent: 'Syntax',
      definition: 'Bir formül veya fonksiyonun Excel tarafından anlaşılabilmesi için uyulması gereken zorunlu yazım kuralları bütünü.',
      category: 'Formül Mantığı',
      example: '=TOPLA(aralık)',
    },
    {
      id: 'gl_range',
      term: 'Hücre Aralığı (Range)',
      englishEquivalent: 'Cell Range',
      definition: 'Başlangıç ve bitiş koordinatları arasında kalan, iki nokta (:) ile birbirine bağlanan dikdörtgensel hücre grubu.',
      category: 'Hücre Başvuruları',
      example: 'B2:B6',
    },
    {
      id: 'gl_argument',
      term: 'Bağımsız Değişken (Argüman)',
      englishEquivalent: 'Argument / Parameter',
      definition: 'Fonksiyonun hesaplama yapabilmesi için parantez içerisine aktarılan girdi değerleri, hücre adresleri veya aralıklar.',
      category: 'Fonksiyon Yapısı',
      example: 'B2:B6 argümandır.',
    },
    {
      id: 'gl_recalc',
      term: 'Otomatik Yeniden Hesaplama',
      englishEquivalent: 'Automatic Recalculation',
      definition: 'Formüle dahil olan herhangi bir hücrenin değeri değiştiğinde, formül sonucunun anında ve kendiliğinden güncellenmesi.',
      category: 'Hesaplama Motoru',
      example: 'B3 hücresi 450 yerine 500 olunca B7 otomatik 3100 olur.',
    },
  ],

  uiLocations: [
    {
      elementName: 'Otomatik Toplam (AutoSum)',
      ribbonTab: 'Giriş / Formüller',
      group: 'Düzenleme / İşlev Kitaplığı',
      shortcut: 'Alt + =',
      description: 'Aktif hücrenin üstündeki veya solundaki sayı bloğunu otomatik olarak TOPLA formülü içine alır.',
    },
    {
      elementName: 'Formül Çubuğu (fx)',
      ribbonTab: 'Arayüz Sabit Çubuğu',
      group: 'Formül Giriş Alanı',
      shortcut: 'F2',
      description: 'Hücrenin hesaplanan değerinin arkasındaki gerçek formül dizesini gösterir ve düzenlemeye olanak tanır.',
    },
  ],

  realWorldScenarios: [
    {
      id: 'sc_retail_sales',
      industry: 'Perakende & E-Ticaret',
      role: 'Mağaza Müdürü / Satış Uzmanı',
      challenge: 'Günün sonunda satılan 50 farklı ürünün tutarını hesap makinesiyle tek tek toplamak zaman alıyor ve dalgınlıkla yanlış tuşa basılma riski yüksek.',
      solution: 'Satış sütununa tek bir =TOPLA(B2:B51) formülü yazılarak gün sonu cirosu saniyeler içinde hatasız hesaplanır.',
      dataDescription: 'A sütunu: Ürün Adı, B sütunu: Satış Tutarı (₺).',
      appliedBenefit: 'Günde 25 dakika tasarruf ve fatura mutabakatlarında sıfır hata.',
    },
    {
      id: 'sc_finance_budget',
      industry: 'Şirket Finansı & Muhasebe',
      role: 'Bütçe Planlama Sorumlusu',
      challenge: 'Aylık departman giderleri sürekli revize ediliyor; manuel hesaplamalarda her değişiklikte tüm toplamları baştan hesaplamak gerekiyor.',
      solution: 'Hücre bağımlılığı ile dinamik TOPLA formülü kurulur; gider kalemleri güncellendikçe genel bütçe otomatik yenilenir.',
      dataDescription: 'Gider başlıkları ve aylık harcama tutarları.',
      appliedBenefit: 'Dinamik senaryo analizi ve yönetim raporlamasında anlık güncelleme.',
    },
  ],

  commonMistakes: [
    {
      id: 'err_colon_vs_semicolon',
      title: 'İki Nokta (:) Yerine Noktalı Virgül (;) Kullanmak',
      mistake: '=TOPLA(B2;B6) yazmak.',
      cause: 'Noktalı virgül yalnızca iki ayrık hücreyi (B2 ve B6) toplar; aradaki B3, B4, B5 hücrelerini göz ardı eder.',
      solution: 'Ardışık aralık toplarken her zaman iki nokta (:) kullanılmalıdır: =TOPLA(B2:B6).',
      badExample: '=TOPLA(B2;B6) -> 750 (Yanlış)',
      goodExample: '=TOPLA(B2:B6) -> 3050 (Doğru)',
    },
    {
      id: 'err_text_in_number',
      title: 'Hücre İçine Sayıyla Birlikte Metin Yazmak',
      mistake: 'Hücreye "350 TL" veya "450 ₺" şeklinde elle birim yazmak.',
      cause: 'Excel bu hücreyi sayı yerine metin olarak algılar; matematiksel formüller bu hücreyi 0 sayabilir veya #DEĞER! hatası verebilir.',
      solution: 'Hücreye yalnızca ham sayı (350) yazılmalı, para birimi araç çubuğundaki Sayı Biçimlendirme (₺) butonundan verilmelidir.',
      badExample: 'B2 hücresine "350 TL" yazmak',
      goodExample: 'B2 hücresine 350 yazıp Hücre Biçimi: Para Birimi seçmek',
    },
  ],

  quizQuestions: [
    {
      id: 'quiz_sum_1',
      question: 'Excel’de B2’den B6’ya kadar olan beş hücredeki sayıları toplamak için hangi formül kullanılmalıdır?',
      options: [
        '=TOPLA(B2:B6)',
        '=TOPLA(B2;B6)',
        '=TOPLAM(B2..B6)',
        'TOPLA(B2-B6)',
      ],
      correctIndex: 0,
      explanation: 'Excel’de ardışık hücre aralığı iki nokta (:) ile ifade edilir ve tüm formüller eşittir (=) işaretiyle başlar: =TOPLA(B2:B6).',
      difficulty: 'easy',
    },
    {
      id: 'quiz_sum_2',
      question: 'B7 hücresinde =TOPLA(B2:B6) formülü varken, B3 hücresindeki sayıyı 450 yerine 500 olarak değiştirirseniz ne olur?',
      options: [
        'Formülü B7 hücresine baştan yazmak gerekir.',
        'B7 hücresindeki sonuç kendiliğinden otomatik olarak 3.100 ₺’ye güncellenir.',
        'Excel hata mesajı (#DÖNGÜ!) verir.',
        'Değişikliğin yansıması için bilgisayarı yeniden başlatmak gerekir.',
      ],
      correctIndex: 1,
      explanation: 'Excel dinamik hesaplama motoruna sahiptir. Bir formülün başvurduğu hücrelerdeki değer değiştiğinde sonuç otomatik olarak yeniden hesaplanır.',
      difficulty: 'medium',
    },
    {
      id: 'quiz_sum_3',
      question: 'Formül çubuğuna yazılan =TOPLA(B2:B6) formülünün hücrede hesaplanması için hangi tuşa basılmalıdır?',
      options: [
        'Escape (Esc)',
        'F1',
        'Enter',
        'Boşluk (Space)',
      ],
      correctIndex: 2,
      explanation: 'Enter tuşu girilen veriyi ve formülü onaylar ve Excel’in hesaplama motorunu tetikler. Escape ise düzenlemeyi iptal eder.',
      difficulty: 'easy',
    },
  ],

  summary: [
    '=TOPLA(başlangıç:bitiş) formülü ardışık hücrelerdeki sayıları toplar.',
    'B2:B6 ifadesindeki iki nokta üst üste (:), aradaki tüm hücreleri kapsayan bir köprü kurar.',
    'Formül çubuğuna formül yazıldıktan sonra hesaplatmak için mutlaka Enter tuşuna basılmalıdır.',
    'Hücrelerdeki değerler sonradan değiştirildiğinde TOPLA fonksiyonu otomatik olarak güncellenir.',
    'Boş hücreler veya metin içeren hücreler toplamı bozmaz, 0 sayılır.',
    'Excel Akademi motoru hem Türkçe (=TOPLA) hem de uluslararası (=SUM) fonksiyon adlarını destekler.',
  ],

  initialWorkbookFactory: () => createDefaultWorkbook(),
};
