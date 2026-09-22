/**
 * AURA Football - Componente Reutilizável: Card / Panel
 */

import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'base' | 'dark' | 'soft';
  bordered?: boolean;
}

export function Card({
  children,
  variant = 'dark',
  bordered = true,
  className = '',
  ...props
}: CardProps) {
  const backgrounds = {
    base: 'bg-[#080909]',
    dark: 'bg-[#111313]',
    soft: 'bg-[#191C1C]',
  };

  const border = bordered ? 'border border-[#222626]' : '';

  return (
    <div
      className={`rounded-xl p-5 ${backgrounds[variant]} ${border} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
