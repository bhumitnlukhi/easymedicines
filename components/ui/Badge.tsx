import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, FileText, Sparkles } from 'lucide-react';

export interface BadgeProps {
  variant?: 'brand' | 'prescription' | 'success' | 'warning' | 'neutral' | 'demo';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: boolean;
  className?: string;
}

export function Badge({
  variant = 'neutral',
  size = 'sm',
  children,
  icon = true,
  className,
}: BadgeProps) {
  const base = 'inline-flex items-center font-medium rounded-full';

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
  };

  const variants = {
    brand: 'bg-brand-100 text-brand-800 border border-brand-200',
    prescription: 'bg-amber-50 text-amber-900 border border-amber-200/90 font-semibold',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    warning: 'bg-orange-50 text-orange-800 border border-orange-200',
    neutral: 'bg-surface-subtle text-text-muted border border-border',
    demo: 'bg-purple-50 text-purple-700 border border-purple-200',
  };

  const renderIcon = () => {
    if (!icon) return null;
    const iconSize = size === 'sm' ? 12 : 14;
    switch (variant) {
      case 'prescription':
        return <FileText size={iconSize} className="text-amber-700 shrink-0" />;
      case 'success':
        return <CheckCircle2 size={iconSize} className="text-emerald-600 shrink-0" />;
      case 'warning':
        return <AlertCircle size={iconSize} className="text-orange-600 shrink-0" />;
      case 'demo':
        return <Sparkles size={iconSize} className="text-purple-600 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <span className={cn(base, sizes[size], variants[variant], className)}>
      {renderIcon()}
      <span>{children}</span>
    </span>
  );
}
