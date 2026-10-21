/**
 * Bottom Sheet Tabs for switching, adding, renaming, and deleting worksheets
 */

import React, { useState } from 'react';
import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { Worksheet } from '../../modules/spreadsheet/types.ts';

interface SheetTabsProps {
  sheets: Worksheet[];
  activeSheetId: string;
  onSwitchSheet: (id: string) => void;
  onAddSheet: () => void;
  onRenameSheet?: (sheetId: string, newName: string) => boolean;
  onDeleteSheet?: (sheetId: string) => boolean;
}

export function SheetTabs({
  sheets,
  activeSheetId,
  onSwitchSheet,
  onAddSheet,
  onRenameSheet,
  onDeleteSheet,
}: SheetTabsProps) {
  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState<string>('');
  const [menuOpenSheetId, setMenuOpenSheetId] = useState<string | null>(null);
  const [deleteConfirmSheetId, setDeleteConfirmSheetId] = useState<string | null>(null);

  const startRenaming = (sheet: Worksheet) => {
    setEditingSheetId(sheet.id);
    setEditNameValue(sheet.name);
    setMenuOpenSheetId(null);
  };

  const commitRenaming = () => {
    if (editingSheetId && onRenameSheet && editNameValue.trim()) {
      onRenameSheet(editingSheetId, editNameValue.trim());
    }
    setEditingSheetId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitRenaming();
    } else if (e.key === 'Escape') {
      setEditingSheetId(null);
    }
  };

  const handleDelete = (sheetId: string) => {
    if (onDeleteSheet) {
      onDeleteSheet(sheetId);
    }
    setDeleteConfirmSheetId(null);
    setMenuOpenSheetId(null);
  };

  return (
    <div className="relative flex items-center bg-slate-100 border-t border-slate-200 px-2 py-1 text-xs overflow-x-auto select-none">
      <div className="flex items-center gap-1">
        {sheets.map((sheet) => {
          const isActive = sheet.id === activeSheetId;
          const isEditing = editingSheetId === sheet.id;

          return (
            <div key={sheet.id} className="relative group flex items-center">
              {isEditing ? (
                <input
                  type="text"
                  autoFocus
                  value={editNameValue}
                  onChange={(e) => setEditNameValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={commitRenaming}
                  className="px-2 py-0.5 text-xs font-semibold bg-white border border-[#107c41] rounded-t text-slate-900 outline-none w-28"
                />
              ) : (
                <button
                  onClick={() => onSwitchSheet(sheet.id)}
                  onDoubleClick={() => startRenaming(sheet)}
                  title="Çift tıklayarak yeniden adlandırabilirsiniz"
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-t border-t border-l border-r transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#107c41] border-slate-300 font-semibold shadow-xs'
                      : 'bg-slate-200/60 text-slate-600 border-transparent hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <span>{sheet.name}</span>
                  {/* Options button */}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenSheetId(menuOpenSheetId === sheet.id ? null : sheet.id);
                    }}
                    className="p-0.5 hover:bg-slate-300/60 rounded text-slate-400 hover:text-slate-700 opacity-60 hover:opacity-100"
                  >
                    <MoreVertical className="w-3 h-3" />
                  </span>
                </button>
              )}

              {/* Sheet Action Dropdown */}
              {menuOpenSheetId === sheet.id && (
                <div className="absolute bottom-7 left-0 z-50 bg-white border border-slate-200 rounded shadow-md py-1 w-36 text-xs text-slate-700 animate-in fade-in">
                  <button
                    onClick={() => startRenaming(sheet)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 text-left cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-slate-500" />
                    <span>Yeniden Adlandır</span>
                  </button>
                  {sheets.length > 1 && (
                    <button
                      onClick={() => {
                        setDeleteConfirmSheetId(sheet.id);
                        setMenuOpenSheetId(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-rose-50 text-rose-600 text-left cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Sayfayı Sil</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Sheet button */}
      <button
        onClick={onAddSheet}
        title="Yeni Çalışma Sayfası Ekle"
        className="ml-2 p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      <div className="ml-auto text-[11px] text-slate-400 font-mono hidden sm:inline">
        Sayfa: {sheets.find((s) => s.id === activeSheetId)?.name} ({sheets.length} Sayfa)
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmSheetId && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-5 max-w-sm w-full space-y-3 text-xs border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Çalışma Sayfasını Sil</h3>
            <p className="text-slate-600 leading-relaxed">
              Bu sayfadaki tüm hücre verileri silinecektir. Devam etmek istediğinize emin misiniz?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmSheetId(null)}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmSheetId)}
                className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-medium cursor-pointer"
              >
                Evet, Sayfayı Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
