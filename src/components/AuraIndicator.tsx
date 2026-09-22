/**
 * AURA Football - Componente Reutilizável: AuraIndicator (Prompt 07)
 * Representação visual, esportiva e minimalista do estado momentâneo de AURA do atleta.
 * Identidade visual própria: AURA Green (#B7FF3C), escala 0–100, sem glow pesado,
 * otimizado para performance fluida em qualquer dispositivo (inclusive Chromebooks).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Zap, TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react';
import { clampAura, getAuraStatus, AURA_MIN, AURA_MAX, AURA_DEFAULT } from '../engine/aura';

export interface AuraIndicatorProps {
  value: number;
  previousValue?: number;
  size?: 'sm' | 'md' | 'lg';
  showBar?: boolean;
  showIntensityBadge?: boolean;
  showLabel?: boolean;
  showDescription?: boolean;
  interactive?: boolean;
  onModify?: (delta: number) => void;
  className?: string;
}

export function AuraIndicator({
  value,
  previousValue,
  size = 'md',
  showBar = true,
  showIntensityBadge = true,
  showLabel = true,
  showDescription = false,
  interactive = false,
  onModify,
  className = '',
}: AuraIndicatorProps) {
  const safeValue = clampAura(value);
  const status = getAuraStatus(safeValue);

  // Detecção de delta para feedback discreto de subida/descida
  const prevValueRef = useRef<number>(safeValue);
  const [deltaFeedback, setDeltaFeedback] = useState<number | null>(null);

  useEffect(() => {
    const prev = previousValue !== undefined ? previousValue : prevValueRef.current;
    if (prev !== safeValue) {
      setDeltaFeedback(safeValue - prev);
      prevValueRef.current = safeValue;

      const timer = setTimeout(() => {
        setDeltaFeedback(null);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [safeValue, previousValue]);

  // Dimensionamento proporcional
  const sizeClasses = {
    sm: {
      container: 'p-2.5 rounded-xl gap-2',
      number: 'text-xl font-bold',
      label: 'text-[10px]',
      badge: 'text-[9px] px-1.5 py-0.5',
      barHeight: 'h-1.5',
    },
    md: {
      container: 'p-4 rounded-2xl gap-3',
      number: 'text-3xl font-black',
      label: 'text-xs',
      badge: 'text-[10px] px-2 py-0.5',
      barHeight: 'h-2',
    },
    lg: {
      container: 'p-5 rounded-2xl gap-4',
      number: 'text-4xl sm:text-5xl font-black',
      label: 'text-xs tracking-wider',
      badge: 'text-xs px-2.5 py-1',
      barHeight: 'h-2.5',
    },
  }[size];

  return (
    <div
      className={`relative bg-[#111313] border border-[#222626] flex flex-col justify-between overflow-hidden transition-colors ${sizeClasses.container} ${className}`}
    >
      {/* Topo: Rótulo e Badge de Intensidade */}
      <div className="flex items-center justify-between gap-2">
        {showLabel && (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-[#B7FF3C]/10 border border-[#B7FF3C]/30 flex items-center justify-center text-[#B7FF3C] shrink-0">
              <Zap size={12} />
            </div>
            <span className={`font-mono uppercase font-bold text-[#8B918E] ${sizeClasses.label}`}>
              AURA
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Feedback discreto de transição (+/- delta) */}
          {deltaFeedback !== null && (
            <div
              className={`flex items-center gap-0.5 text-xs font-mono font-bold transition-opacity ${
                deltaFeedback > 0 ? 'text-[#B7FF3C]' : 'text-rose-400'
              }`}
            >
              {deltaFeedback > 0 ? (
                <>
                  <TrendingUp size={12} />
                  <span>+{deltaFeedback}</span>
                </>
              ) : (
                <>
                  <TrendingDown size={12} />
                  <span>{deltaFeedback}</span>
                </>
              )}
            </div>
          )}

          {showIntensityBadge && (
            <span
              className={`font-mono uppercase rounded border transition-colors ${sizeClasses.badge} ${
                status.level === 'Alta'
                  ? 'bg-[#B7FF3C]/10 text-[#B7FF3C] border-[#B7FF3C]/30'
                  : status.level === 'Estável'
                  ? 'bg-[#191C1C] text-[#F4F5F2] border-[#2A2E2E]'
                  : 'bg-[#191C1C] text-[#8B918E] border-[#262B2B]'
              }`}
            >
              {status.label}
            </span>
          )}
        </div>
      </div>

      {/* Meio: Valor Numérico de Grande Destaque + Controles Interativos (se ativo) */}
      <div className="flex items-baseline justify-between gap-3 my-1">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-display text-[#B7FF3C] tracking-tight leading-none ${sizeClasses.number}`}
          >
            {safeValue}
          </span>
          <span className="text-[11px] font-mono text-[#555C59]">/ 100</span>
        </div>

        {/* Controles manuais para modo interativo/testes */}
        {interactive && onModify && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onModify(-10)}
              disabled={safeValue <= AURA_MIN}
              className="w-7 h-7 rounded-lg bg-[#191C1C] border border-[#2A2E2E] text-[#8B918E] hover:text-[#F4F5F2] hover:border-[#3A4040] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer text-xs"
              title="Diminuir AURA (-10)"
            >
              <Minus size={13} />
            </button>
            <button
              type="button"
              onClick={() => onModify(10)}
              disabled={safeValue >= AURA_MAX}
              className="w-7 h-7 rounded-lg bg-[#191C1C] border border-[#2A2E2E] text-[#8B918E] hover:text-[#B7FF3C] hover:border-[#B7FF3C]/40 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer text-xs"
              title="Aumentar AURA (+10)"
            >
              <Plus size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Base: Barra de Progresso com Marcador de Padrão Inicial (50%) */}
      {showBar && (
        <div className="space-y-1">
          <div
            className={`relative w-full bg-[#191C1C] rounded-full overflow-hidden border border-[#262B2B] ${sizeClasses.barHeight}`}
          >
            {/* Marcador central sutil indicando AURA_DEFAULT (50) */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#3A4040] z-10"
              style={{ left: '50%' }}
              title="Ponto neutro inicial (50)"
            />

            {/* Preenchimento em AURA Green */}
            <div
              className="h-full bg-[#B7FF3C] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${safeValue}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-[#555C59]">
            <span>0</span>
            <span className="text-[#8B918E]">Padrão 50</span>
            <span>100</span>
          </div>
        </div>
      )}

      {/* Descrição contextual opcional */}
      {showDescription && (
        <p className="text-xs text-[#8B918E] mt-1 pt-2 border-t border-[#191C1C]">
          {status.description}
        </p>
      )}
    </div>
  );
}
