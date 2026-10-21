/**
 * Context menu definitions and action types for spreadsheet cells
 */

export type ContextMenuActionId = 'cut' | 'copy' | 'paste' | 'clear' | 'edit';

export interface ContextMenuItem {
  id: ContextMenuActionId;
  label: string;
  shortcut?: string;
  icon?: string;
  disabled?: boolean;
}

export const BASE_CONTEXT_MENU_ITEMS: ContextMenuItem[] = [
  { id: 'edit', label: 'Düzenle', shortcut: 'Enter' },
  { id: 'copy', label: 'Kopyala', shortcut: 'Ctrl+C' },
  { id: 'cut', label: 'Kes', shortcut: 'Ctrl+X' },
  { id: 'paste', label: 'Yapıştır', shortcut: 'Ctrl+V' },
  { id: 'clear', label: 'İçeriği Temizle', shortcut: 'Delete' },
];
