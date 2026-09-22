/**
 * AURA Football - Aba de Uniforme e Chuteira (KitTab)
 * Personalização de estilo da camisa, cores do uniforme e chuteiras.
 * Nota de regra: 100% cosmético.
 */

import React from 'react';
import { PlayerAvatar } from '../../types';
import {
  JERSEY_STYLES,
  KIT_COLORS,
  BOOT_COLORS,
} from '../../data/avatarOptions';
import { Check, Sparkles } from 'lucide-react';

interface KitTabProps {
  avatar: PlayerAvatar;
  onChange: (patch: Partial<PlayerAvatar>) => void;
}

export function KitTab({ avatar, onChange }: KitTabProps) {
  const currentPrimary = avatar.jerseyPrimaryColor || '#B7FF3C';
  const currentSecondary = avatar.jerseySecondaryColor || '#111313';
  const currentShorts = avatar.shortsColor || '#111313';
  const currentSocks = avatar.socksColor || '#111313';
  const currentBoots = avatar.bootsColor || '#B7FF3C';
  const currentStyle = avatar.jerseyStyle || 'solida';

  return (
    <div className="space-y-6">
      {/* Selo Informativo de Regra */}
      <div className="p-3 bg-[#111313] border border-[#222626] rounded-xl flex items-center gap-2.5 text-xs text-[#8B918E]">
        <Sparkles size={15} className="text-[#B7FF3C] shrink-0" />
        <span>
          O uniforme e chuteiras são exclusivamente estéticos e não afetam atributos ou desempenho.
        </span>
      </div>

      {/* 1. Estilo da Camisa */}
      <div className="space-y-2.5">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B918E] block">
          Estilo da Camisa
        </label>
        <div className="grid grid-cols-2 gap-2">
          {JERSEY_STYLES.map((style) => {
            const isSelected = currentStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChange({ jerseyStyle: style.id })}
                className={`p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#191C1C] border-[#B7FF3C] text-[#F4F5F2]'
                    : 'bg-[#111313] border-[#222626] text-[#8B918E] hover:text-[#F4F5F2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold block">{style.label}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF3C]" />}
                </div>
                <span className="text-[10px] text-[#8B918E] block mt-0.5">
                  {style.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Cores da Camisa (Primária e Secundária) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cor Principal da Camisa */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#8B918E] block">Cor Principal da Camisa</label>
          <div className="grid grid-cols-4 gap-2">
            {KIT_COLORS.map((color) => {
              const isSelected = currentPrimary === color.hex;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => onChange({ jerseyPrimaryColor: color.hex })}
                  className={`relative aspect-square rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer border ${
                    isSelected
                      ? 'border-[#B7FF3C] ring-2 ring-[#B7FF3C]/30 scale-105'
                      : 'border-[#262B2B] hover:border-[#8B918E]'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {isSelected && (
                    <Check
                      size={14}
                      className={
                        color.hex === '#F4F5F2' || color.hex === '#B7FF3C'
                          ? 'text-neutral-950'
                          : 'text-white'
                      }
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalhes / Cor Secundária */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#8B918E] block">Detalhes / Gola & Número</label>
          <div className="grid grid-cols-4 gap-2">
            {KIT_COLORS.map((color) => {
              const isSelected = currentSecondary === color.hex;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => onChange({ jerseySecondaryColor: color.hex })}
                  className={`relative aspect-square rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer border ${
                    isSelected
                      ? 'border-[#B7FF3C] ring-2 ring-[#B7FF3C]/30 scale-105'
                      : 'border-[#262B2B] hover:border-[#8B918E]'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {isSelected && (
                    <Check
                      size={14}
                      className={
                        color.hex === '#F4F5F2' || color.hex === '#B7FF3C'
                          ? 'text-neutral-950'
                          : 'text-white'
                      }
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Shorts & Meiões */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#191C1C]">
        {/* Calção / Shorts */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#8B918E] block">Calção (Shorts)</label>
          <div className="grid grid-cols-4 gap-2">
            {KIT_COLORS.map((color) => {
              const isSelected = currentShorts === color.hex;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => onChange({ shortsColor: color.hex })}
                  className={`relative aspect-square rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer border ${
                    isSelected
                      ? 'border-[#B7FF3C] ring-2 ring-[#B7FF3C]/30 scale-105'
                      : 'border-[#262B2B] hover:border-[#8B918E]'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {isSelected && (
                    <Check
                      size={14}
                      className={
                        color.hex === '#F4F5F2' || color.hex === '#B7FF3C'
                          ? 'text-neutral-950'
                          : 'text-white'
                      }
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Meiões */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#8B918E] block">Meiões</label>
          <div className="grid grid-cols-4 gap-2">
            {KIT_COLORS.map((color) => {
              const isSelected = currentSocks === color.hex;
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => onChange({ socksColor: color.hex })}
                  className={`relative aspect-square rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer border ${
                    isSelected
                      ? 'border-[#B7FF3C] ring-2 ring-[#B7FF3C]/30 scale-105'
                      : 'border-[#262B2B] hover:border-[#8B918E]'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {isSelected && (
                    <Check
                      size={14}
                      className={
                        color.hex === '#F4F5F2' || color.hex === '#B7FF3C'
                          ? 'text-neutral-950'
                          : 'text-white'
                      }
                      strokeWidth={3}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Chuteira */}
      <div className="space-y-2.5 pt-2 border-t border-[#191C1C]">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B918E] block">
          Chuteira de Campo
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BOOT_COLORS.map((boot) => {
            const isSelected = currentBoots === boot.hex;
            return (
              <button
                key={boot.id}
                type="button"
                onClick={() => onChange({ bootsColor: boot.hex })}
                className={`p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#191C1C] border-[#B7FF3C] text-[#F4F5F2]'
                    : 'bg-[#111313] border-[#222626] text-[#8B918E] hover:text-[#F4F5F2]'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-lg shrink-0 border border-white/20 shadow-sm"
                  style={{ backgroundColor: boot.hex }}
                />
                <span className="text-xs font-bold block truncate">{boot.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
