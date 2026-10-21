/**
 * Accessible progress bar with tabular percentages
 */

export interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export function ProgressBar({
  value,
  label,
  showPercent = true,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
          {label && <span className="font-medium text-slate-700">{label}</span>}
          {showPercent && (
            <span className="font-mono tabular-nums text-slate-500">%{Math.round(clampedValue)}</span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass}`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="bg-[#107c41] h-full transition-all duration-300 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
