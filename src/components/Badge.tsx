/**
 * AURA Football - Componente Reutilizável: Badge
 */

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'dark' | 'gold' | 'red';
  className?: string;
}

export function Badge({ children, variant = 'dark', className = '' }: BadgeProps) {
  const styles = {
    green: 'bg-[#B7FF3C]/10 text-[#B7FF3C] border-[#B7FF3C]/30',
    dark: 'bg-[#191C1C] text-[#F4F5F2] border-[#2A2E2E]',
    gold: 'bg-[#D9B65D]/10 text-[#D9B65D] border-[#D9B65D]/30',
    red: 'bg-[#E5484D]/10 text-[#E5484D] border-[#E5484D]/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-semibold border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
