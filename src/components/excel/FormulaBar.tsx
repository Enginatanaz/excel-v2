/**
 * Excel Formula Bar with Name Box, fx indicator, and formula editor
 */

import React, { useRef, useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';

interface FormulaBarProps {
  activeCellAddress: string;
  displayAddress?: string;
  rawValue: string;
  isEditing: boolean;
  editValue: string;
  onStartEditing: (val?: string) => void;
  onUpdateEditValue: (val: string) => void;
  onCommitEditing: (moveToNext?: boolean) => void;
  onCancelEditing: () => void;
  onJumpToAddress?: (addr: string) => void;
}

export function FormulaBar({
  activeCellAddress,
  displayAddress,
  rawValue,
  isEditing,
  editValue,
  onStartEditing,
  onUpdateEditValue,
  onCommitEditing,
  onCancelEditing,
  onJumpToAddress,
}: FormulaBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [nameBoxInput, setNameBoxInput] = useState<string>('');
  const [isNameBoxEditing, setIsNameBoxEditing] = useState<boolean>(false);

  const shownAddress = displayAddress || activeCellAddress;

  const displayValue = isEditing ? editValue : rawValue;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleNameBoxKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onJumpToAddress && nameBoxInput.trim()) {
        onJumpToAddress(nameBoxInput.trim());
      }
      setIsNameBoxEditing(false);
    } else if (e.key === 'Escape') {
      setIsNameBoxEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) {
      onStartEditing(e.target.value);
    } else {
      onUpdateEditValue(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onCommitEditing(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancelEditing();
    }
  };

  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-white border-b border-slate-200 text-xs">
      {/* Name Box (Ad Kutusu) */}
      {isNameBoxEditing ? (
        <input
          type="text"
          autoFocus
          value={nameBoxInput}
          onChange={(e) => setNameBoxInput(e.target.value.toUpperCase())}
          onKeyDown={handleNameBoxKeyDown}
          onBlur={() => setIsNameBoxEditing(false)}
          className="w-20 px-1.5 py-0.5 bg-white border-2 border-[#107c41] rounded font-mono font-bold text-slate-900 text-xs text-center outline-none"
        />
      ) : (
        <div
          onClick={() => {
            setNameBoxInput(shownAddress);
            setIsNameBoxEditing(true);
          }}
          title="Ad Kutusu (Tıklayıp hücre adresi yazabilirsiniz)"
          className="w-20 px-1.5 py-1 bg-slate-50 border border-slate-300 rounded font-mono font-semibold text-slate-800 text-center select-none cursor-text hover:bg-white hover:border-slate-400 transition-colors truncate"
        >
          {shownAddress}
        </div>
      )}

      {/* Action buttons (Cancel / Commit) when editing */}
      <div className="flex items-center gap-0.5">
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onCancelEditing()}
          disabled={!isEditing}
          title="Girişi İptal Et (Esc)"
          className={`p-1 rounded transition-colors ${
            isEditing
              ? 'text-rose-600 hover:bg-rose-50 cursor-pointer'
              : 'text-slate-300 pointer-events-none'
          }`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onCommitEditing(false)}
          disabled={!isEditing}
          title="Girişi Onayla (Enter)"
          className={`p-1 rounded transition-colors ${
            isEditing
              ? 'text-emerald-700 hover:bg-emerald-50 cursor-pointer'
              : 'text-slate-300 pointer-events-none'
          }`}
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* fx symbol */}
      <div className="px-1.5 font-serif italic font-semibold text-slate-500 select-none">
        fx
      </div>

      {/* Formula & Text Input */}
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onFocus={() => {
            if (!isEditing) onStartEditing(rawValue);
          }}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => onCommitEditing(false)}
          placeholder="Değer girin veya =TOPLA(B2:B6) gibi formül yazın..."
          className="w-full px-2.5 py-1 text-xs font-mono bg-white border border-slate-300 rounded focus:border-[#107c41] focus:ring-1 focus:ring-[#107c41] focus:outline-none transition-all placeholder:font-sans placeholder:text-slate-400"
        />
      </div>
    </div>
  );
}
