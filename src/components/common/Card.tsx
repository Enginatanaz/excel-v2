/**
 * Common Card component with single-elevation depth and clean border
 */

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'muted' | 'interactive';
}

export function Card({
  children,
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-white border border-slate-200',
    muted: 'bg-slate-50 border border-slate-200/80',
    interactive:
      'bg-white border border-slate-200 hover:border-emerald-600/50 hover:shadow-xs transition-all cursor-pointer',
  };

  return (
    <div
      className={`rounded-lg p-5 sm:p-6 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
