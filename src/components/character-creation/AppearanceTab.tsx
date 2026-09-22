/**
 * AURA Football - Aba de Rosto e Aparência do Atleta
 * Personalização de pele, corte de cabelo, cor do cabelo e feições.
 */

import React from 'react';
import { PlayerAvatar } from '../../types';
import {
  SKIN_TONES,
  HAIR_STYLES,
  HAIR_COLORS,
  FACE_SHAPES,
  EYEBROW_STYLES,
  EYE_STYLES,
  MOUTH_STYLES,
} from '../../data/avatarOptions';
import { Check } from 'lucide-react';

interface AppearanceTabProps {
  avatar: PlayerAvatar;
  onChange: (patch: Partial<PlayerAvatar>) => void;
}

export function AppearanceTab({ avatar, onChange }: AppearanceTabProps) {
  return (
    <div className="space-y-6">
      {/* 1. Tom de Pele */}
      <div className="space-y-2.5">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B918E] block">
          Tom de Pele
        </label>
        <div className="grid grid-cols-6 gap-2 sm:gap-3">
          {SKIN_TONES.map((tone) => {
            const isSelected = avatar.skinTone === tone.id;
            return (
              <button
                key={tone.id}
                type="button"
                onClick={() => onChange({ skinTone: tone.id, skinColor: tone.hex })}
                className={`relative aspect-square rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer border ${
                  isSelected
                    ? 'border-[#B7FF3C] ring-2 ring-[#B7FF3C]/30 scale-105'
                    : 'border-[#262B2B] hover:border-[#8B918E] opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: tone.hex }}
                title={tone.name}
              >
                {isSelected && (
                  <Check
                    size={16}
                    className={tone.id >= 4 ? 'text-white' : 'text-neutral-900'}
                    strokeWidth={3}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Estilo de Cabelo */}
      <div className="space-y-2.5">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B918E] block">
          Corte de Cabelo
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {HAIR_STYLES.map((style) => {
            const isSelected = avatar.hairStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChange({ hairStyle: style.id })}
                className={`p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#191C1C] border-[#B7FF3C] text-[#F4F5F2]'
                    : 'bg-[#111313] border-[#222626] text-[#8B918E] hover:text-[#F4F5F2] hover:border-[#333]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold block">{style.label}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF3C]" />}
                </div>
                <span className="text-[10px] text-[#8B918E] block mt-0.5 line-clamp-1">
                  {style.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Cor do Cabelo */}
      <div className="space-y-2.5">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B918E] block">
          Cor do Cabelo
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {HAIR_COLORS.map((color) => {
            const isSelected = avatar.hairColor === color.hex;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => onChange({ hairColor: color.hex })}
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
                      color.id === 'platinado' || color.id === 'aura_green'
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

      {/* 4. Feições do Rosto (Formato, Sobrancelhas, Olhos, Expressão) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#191C1C]">
        {/* Formato do Rosto */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#8B918E] block">Formato do Rosto</label>
          <div className="grid grid-cols-3 gap-1.5">
            {FACE_SHAPES.map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => onChange({ faceShape: shape.id })}
                className={`py-2 px-2 text-center rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                  avatar.faceShape === shape.id
                    ? 'bg-[#191C1C] border-[#B7FF3C] text-[#B7FF3C]'
                    : 'bg-[#111313] border-[#222626] text-[#8B918E] hover:text-[#F4F5F2]'
                }`}
              >
                {shape.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Sobrancelhas */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#8B918E] block">Sobrancelhas</label>
          <div className="grid grid-cols-3 gap-1.5">
            {EYEBROW_STYLES.map((brow) => (
              <button
                key={brow.id}
                type="button"
                onClick={() => onChange({ eyebrows: brow.id })}
                className={`py-2 px-2 text-center rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                  avatar.eyebrows === brow.id
                    ? 'bg-[#191C1C] border-[#B7FF3C] text-[#B7FF3C]'
                    : 'bg-[#111313] border-[#222626] text-[#8B918E] hover:text-[#F4F5F2]'
                }`}
              >
                {brow.label}
              </button>
            ))}
          </div>
        </div>

        {/* Olhar */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#8B918E] block">Olhar</label>
          <div className="grid grid-cols-3 gap-1.5">
            {EYE_STYLES.map((eye) => (
              <button
                key={eye.id}
                type="button"
                onClick={() => onChange({ eyes: eye.id })}
                className={`py-2 px-2 text-center rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                  avatar.eyes === eye.id
                    ? 'bg-[#191C1C] border-[#B7FF3C] text-[#B7FF3C]'
                    : 'bg-[#111313] border-[#222626] text-[#8B918E] hover:text-[#F4F5F2]'
                }`}
              >
                {eye.label}
              </button>
            ))}
          </div>
        </div>

        {/* Boca / Postura */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#8B918E] block">Expressão</label>
          <div className="grid grid-cols-3 gap-1.5">
            {MOUTH_STYLES.map((mouth) => (
              <button
                key={mouth.id}
                type="button"
                onClick={() => onChange({ mouth: mouth.id })}
                className={`py-2 px-2 text-center rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                  avatar.mouth === mouth.id
                    ? 'bg-[#191C1C] border-[#B7FF3C] text-[#B7FF3C]'
                    : 'bg-[#111313] border-[#222626] text-[#8B918E] hover:text-[#F4F5F2]'
                }`}
              >
                {mouth.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
