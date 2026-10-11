import React from 'react';

export type BadgeVariant = 'emerald' | 'gold' | 'blue' | 'gray' | 'red' | 'purple' | 'amber';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  size = 'md',
  className = '',
  icon,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    gold: 'bg-amber-50 text-amber-900 border-amber-200/80',
    blue: 'bg-sky-50 text-sky-800 border-sky-200/80',
    gray: 'bg-stone-100 text-stone-700 border-stone-200',
    red: 'bg-rose-50 text-rose-800 border-rose-200/80',
    purple: 'bg-purple-50 text-purple-800 border-purple-200/80',
    amber: 'bg-orange-50 text-orange-800 border-orange-200/80',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-xs transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
