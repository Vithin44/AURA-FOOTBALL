/**
 * AURA Football - Componente Reutilizável: StatDisplay
 */

import React from 'react';

interface StatDisplayProps {
  label: string;
  value: string | number;
  subValue?: string;
  highlight?: boolean;
}

export function StatDisplay({ label, value, subValue, highlight = false }: StatDisplayProps) {
  return (
    <div className="flex flex-col p-3 rounded-lg bg-[#191C1C] border border-[#262B2B]">
      <span className="text-[11px] font-medium tracking-wider text-[#8B918E] uppercase">
        {label}
      </span>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span
          className={`font-mono text-xl font-bold tracking-tight ${
            highlight ? 'text-[#B7FF3C]' : 'text-[#F4F5F2]'
          }`}
        >
          {value}
        </span>
        {subValue && (
          <span className="font-mono text-xs text-[#8B918E]">{subValue}</span>
        )}
      </div>
    </div>
  );
}
