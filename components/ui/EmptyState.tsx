import React from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { PackageSearch } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon,
  actionText,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-md mx-auto bg-white rounded-2xl border border-border">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4 shadow-sm">
        {icon || <PackageSearch size={32} />}
      </div>
      <h3 className="text-lg font-semibold text-text-main mb-2">{title}</h3>
      <p className="text-sm text-text-muted mb-6">{description}</p>
      {actionText && (
        actionHref ? (
          <Link href={actionHref}>
            <Button variant="primary">{actionText}</Button>
          </Link>
        ) : (
          <Button onClick={onAction} variant="primary">
            {actionText}
          </Button>
        )
      )}
    </div>
  );
}
