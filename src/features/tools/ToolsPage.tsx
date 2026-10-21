/**
 * Tools Page - Formula and Keyboard Shortcut Cheatsheet
 */

import { useState } from 'react';
import { Card } from '../../components/common/Card.tsx';
import { Code2, Keyboard, Search } from 'lucide-react';

export function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const formulas = [
    {
      name: 'TOPLA / SUM',
      syntax: '=TOPLA(aralık)',
      example: '=TOPLA(B2:B6)',
      desc: 'Belirtilen hücrelerdeki tüm sayısal değerleri toplar.',
      category: 'Matematik',
    },
    {
      name: 'ORTALAMA / AVERAGE',
      syntax: '=ORTALAMA(aralık)',
      example: '=ORTALAMA(B2:B6)',
      desc: 'Hücre aralığındaki sayıların aritmetik ortalamasını hesaplar.',
      category: 'İstatistik',
    },
    {
      name: 'MAK / MAX',
      syntax: '=MAK(aralık)',
      example: '=MAK(B2:B6)',
      desc: 'Aralıktaki en büyük sayısal değeri döndürür.',
      category: 'İstatistik',
    },
    {
      name: 'MİN / MIN',
      syntax: '=MİN(aralık)',
      example: '=MİN(B2:B6)',
      desc: 'Aralıktaki en küçük sayısal değeri döndürür.',
      category: 'İstatistik',
    },
    {
      name: 'SAY / COUNT',
      syntax: '=SAY(aralık)',
      example: '=SAY(B2:B6)',
      desc: 'Aralıktaki sayı içeren hücrelerin adedini sayar.',
      category: 'İstatistik',
    },
  ];

  const shortcuts = [
    { key: 'Enter', action: 'Hücre düzenlemesine başla / Girişi onayla ve aşağı in' },
    { key: 'Tab', action: 'Girişi onayla ve sağdaki hücreye geç' },
    { key: 'Shift + Tab', action: 'Soldaki hücreye geç' },
    { key: 'Yön Okları (↑ ↓ ← →)', action: 'Hücreler arasında serbest gezin' },
    { key: 'Delete / Backspace', action: 'Seçili hücrenin içeriğini temizle' },
    { key: 'Escape (Esc)', action: 'Hücre düzenlemesini iptal et' },
    { key: 'Ctrl + C', action: 'Seçili hücreyi kopyala' },
    { key: 'Ctrl + X', action: 'Seçili hücreyi kes' },
    { key: 'Ctrl + V', action: 'Kopyalanan hücreyi yapıştır' },
    { key: 'Ctrl + B', action: 'Kalın yazı biçimlendirmesi uygula' },
    { key: 'Ctrl + I', action: 'İtalik yazı biçimlendirmesi uygula' },
    { key: 'Sağ Tıklama', action: 'Hücre bağlam menüsünü aç' },
  ];

  const filteredFormulas = formulas.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Formül ve Kısayol Başvuru Rehberi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Excel öğreniminiz sırasında başvurabileceğiniz hazır referans tabloları.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Formül veya açıklama ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Formulas Section */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
          <Code2 className="w-4 h-4 text-[#107c41]" />
          <span>Desteklenen Fonksiyonlar</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFormulas.map((f, i) => (
            <Card key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">
                  {f.name}
                </span>
                <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {f.category}
                </span>
              </div>
              <p className="text-xs text-slate-600">{f.desc}</p>
              <div className="bg-slate-900 text-emerald-400 font-mono text-xs p-2 rounded flex justify-between">
                <span>{f.syntax}</span>
                <span className="text-slate-400">{f.example}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts Section */}
      <div>
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
          <Keyboard className="w-4 h-4 text-[#107c41]" />
          <span>Klavye ve Fare Kısayolları</span>
        </h2>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="py-2.5 px-4 w-1/3">Kısayol</th>
                <th className="py-2.5 px-4">İşlev</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shortcuts.map((sc, i) => (
                <tr key={i} className="hover:bg-slate-50/60">
                  <td className="py-2.5 px-4">
                    <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] text-slate-800 shadow-2xs">
                      {sc.key}
                    </kbd>
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">{sc.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
