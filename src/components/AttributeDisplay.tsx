/**
 * AURA Football - Componente Reutilizável: AttributeDisplay (Prompt 05)
 * Apresentação tátil, tipográfica e animada dos 6 atributos oficiais.
 * Segue estritamente a identidade visual do AURA (sem arco-íris, sem cores avulsas).
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AttributeId, AttributeImportance } from '../types';
import { ATTRIBUTES_DATA } from '../data/attributes';
import { clampAttribute } from '../engine/attributes';
import { TrendingUp, TrendingDown, Minus, Plus } from 'lucide-react';

export interface AttributeDisplayProps {
  attributeId: AttributeId;
  value: number;
  previousValue?: number;
  importance?: AttributeImportance;
  showBar?: boolean;
  showDescription?: boolean;
  showInfluences?: boolean;
  compact?: boolean;
  interactive?: boolean;
  onModify?: (delta: number) => void;
  className?: string;
}

export function AttributeDisplay({
  attributeId,
  value,
  previousValue,
  importance,
  showBar = true,
  showDescription = false,
  showInfluences = false,
  compact = false,
  interactive = false,
  onModify,
  className = '',
}: AttributeDisplayProps) {
  const metadata = ATTRIBUTES_DATA[attributeId];
  const safeValue = clampAttribute(value);

  // Rastreia o valor anterior para suportar animação curta de evolução (Prompt 05, Item 9)
  const prevValueRef = useRef<number>(safeValue);
  const [lastDiff, setLastDiff] = useState<number | null>(null);

  useEffect(() => {
    if (previousValue !== undefined && previousValue !== safeValue) {
      setLastDiff(safeValue - previousValue);
      prevValueRef.current = previousValue;
    } else if (prevValueRef.current !== safeValue) {
      setLastDiff(safeValue - prevValueRef.current);
      prevValueRef.current = safeValue;
    }

    // Limpa o indicador de transição após 3 segundos
    const timer = setTimeout(() => {
      setLastDiff(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [safeValue, previousValue]);

  // Se previousValue for passado explicitamente, usamos ele para o texto `prev → current`
  const effectivePrevious = previousValue ?? (lastDiff !== null ? safeValue - lastDiff : null);
  const hasChanged = effectivePrevious !== null && effectivePrevious !== safeValue;

  return (
    <div
      className={`rounded-xl bg-[#111313] border border-[#222626] transition-colors hover:border-[#2E3333] ${
        compact ? 'p-3' : 'p-4'
      } ${className}`}
    >
      {/* Linha Superior: Sigla + Nome à esquerda, Evolução + Valor à direita */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-baseline gap-2">
          {/* Sigla em IBM Plex Mono */}
          <span className="font-mono font-bold text-sm text-[#B7FF3C] tracking-wide">
            {metadata.label}
          </span>

          {/* Nome por extenso */}
          <span className="text-xs text-[#8B918E] font-medium truncate max-w-[130px] sm:max-w-none">
            {metadata.name}
          </span>

          {/* Badge de importância tática (se aplicável para a posição atual) */}
          {importance && (
            <span
              className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                importance === 'Crítico'
                  ? 'bg-[#B7FF3C]/10 text-[#B7FF3C] border-[#B7FF3C]/30'
                  : importance === 'Alto'
                  ? 'bg-[#191C1C] text-[#F4F5F2] border-[#2A2E2E]'
                  : 'bg-[#111313] text-[#555C59] border-[#1D2121]'
              }`}
            >
              {importance}
            </span>
          )}
        </div>

        {/* Valor e Transição de Evolução */}
        <div className="flex items-center gap-2">
          {/* Animação curta de evolução: ex: 78 → 80 (Prompt 05, Item 9) */}
          <AnimatePresence mode="wait">
            {hasChanged && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1 text-[11px] font-mono text-[#8B918E]"
              >
                <span>{effectivePrevious}</span>
                <span>→</span>
                {lastDiff !== null && lastDiff !== 0 && (
                  <span
                    className={`font-bold flex items-center ${
                      lastDiff > 0 ? 'text-[#B7FF3C]' : 'text-rose-400'
                    }`}
                  >
                    {lastDiff > 0 ? <TrendingUp size={11} className="mr-0.5" /> : <TrendingDown size={11} className="mr-0.5" />}
                    {lastDiff > 0 ? `+${lastDiff}` : `${lastDiff}`}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Valor Numérico em Archivo (font-display) */}
          <motion.span
            key={safeValue}
            initial={{ scale: hasChanged ? 1.15 : 1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            className="font-display font-black text-xl text-[#F4F5F2] tracking-tight leading-none"
          >
            {safeValue}
          </motion.span>

          {/* Controles interativos opcionais para modo de teste/laboratório */}
          {interactive && onModify && (
            <div className="flex items-center gap-1 ml-1 pl-2 border-l border-[#222626]">
              <button
                type="button"
                onClick={() => onModify(-1)}
                disabled={safeValue <= 1}
                className="w-6 h-6 rounded flex items-center justify-center bg-[#191C1C] border border-[#262B2B] text-[#8B918E] hover:text-[#F4F5F2] hover:border-[#3A4040] disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs"
                title="Diminuir atributo (-1)"
              >
                <Minus size={11} />
              </button>
              <button
                type="button"
                onClick={() => onModify(1)}
                disabled={safeValue >= 100}
                className="w-6 h-6 rounded flex items-center justify-center bg-[#191C1C] border border-[#262B2B] text-[#8B918E] hover:text-[#B7FF3C] hover:border-[#B7FF3C]/40 disabled:opacity-30 disabled:pointer-events-none cursor-pointer text-xs"
                title="Aumentar atributo (+1)"
              >
                <Plus size={11} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Barra Visual Proporcional (Escala 1–100) */}
      {showBar && (
        <div className="space-y-1">
          <div className="relative h-2 w-full rounded-full bg-[#191C1C] border border-[#262B2B] overflow-hidden">
            {/* Marcadores discretos de escala a 25%, 50%, 75% */}
            <div className="absolute inset-0 flex justify-between pointer-events-none z-10 px-[25%] opacity-30">
              <span className="w-px h-full bg-[#333838]" />
              <span className="w-px h-full bg-[#333838]" />
            </div>

            {/* Preenchimento em AURA Green */}
            <motion.div
              className="h-full rounded-full bg-[#B7FF3C]"
              initial={{ width: 0 }}
              animate={{ width: `${safeValue}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Legenda mínima da escala */}
          <div className="flex justify-between items-center text-[9px] font-mono text-[#555C59] px-0.5">
            <span>1</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      )}

      {/* Descrição conceitual do atributo */}
      {showDescription && (
        <p className="text-[11px] text-[#8B918E] mt-2.5 leading-relaxed">
          {metadata.description}
        </p>
      )}

      {/* Influências no jogo (Prompt 05, Item 5) */}
      {showInfluences && metadata.influences && metadata.influences.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-[#191C1C]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#636B67] block mb-1.5">
            Impactos no Gramado
          </span>
          <div className="flex flex-wrap gap-1.5">
            {metadata.influences.map((inf, i) => (
              <span
                key={i}
                className="text-[10px] font-mono text-[#8B918E] bg-[#191C1C] border border-[#222626] px-2 py-0.5 rounded-md"
              >
                • {inf}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
