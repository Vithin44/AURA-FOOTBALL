/**
 * AURA Football - Componente Reutilizável: Button
 */

import React, { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-display font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B7FF3C] disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer whitespace-nowrap';

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  const variants = {
    primary:
      'bg-[#B7FF3C] text-[#080909] font-bold hover:bg-[#a5eb2e] shadow-sm',
    secondary:
      'bg-[#191C1C] text-[#F4F5F2] hover:bg-[#252A2A] border border-[#2A2E2E]',
    outline:
      'bg-transparent text-[#8B918E] hover:text-[#F4F5F2] hover:bg-[#111313] border border-[#222626]',
    danger:
      'bg-[#E5484D] text-white hover:bg-[#cb3e43]',
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
