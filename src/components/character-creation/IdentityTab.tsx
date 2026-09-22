/**
 * AURA Football - Aba de Identidade do Atleta (IdentityTab)
 * Nome, sobrenome, nome exibido, número da camisa (1–99) e posição oficial.
 */

import React from 'react';
import { PositionId } from '../../types';
import { getPositionName } from '../../utils/formatters';
import { AlertCircle } from 'lucide-react';

interface IdentityTabProps {
  firstName: string;
  lastName: string;
  displayName: string;
  kitNumber: number;
  position: PositionId;
  errors: Record<string, string>;
  onUpdateField: (field: string, value: any) => void;
}

const CLASSIC_NUMBERS = [10, 7, 9, 11, 8, 5, 1];

export function IdentityTab({
  firstName,
  lastName,
  displayName,
  kitNumber,
  position,
  errors,
  onUpdateField,
}: IdentityTabProps) {
  // Posições organizadas por setor de campo
  const positionGroups: { sector: string; ids: PositionId[] }[] = [
    { sector: 'Ataque', ids: ['ATA', 'PE', 'PD'] },
    { sector: 'Meio-Campo', ids: ['MEI', 'MC', 'VOL'] },
    { sector: 'Defesa', ids: ['ZAG', 'LE', 'LD'] },
    { sector: 'Gol', ids: ['GOL'] },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Nome e Sobrenome */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="player-firstname"
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B918E] block"
          >
            Nome <span className="text-[#B7FF3C]">*</span>
          </label>
          <input
            id="player-firstname"
            type="text"
            value={firstName}
            onChange={(e) => onUpdateField('firstName', e.target.value)}
            placeholder="Ex: Gabriel"
            maxLength={20}
            className={`w-full px-3.5 py-2.5 rounded-xl bg-[#111313] border text-[#F4F5F2] text-sm focus:outline-none transition-colors ${
              errors.firstName
                ? 'border-rose-500 focus:border-rose-500 ring-1 ring-rose-500/20'
                : 'border-[#262B2B] focus:border-[#B7FF3C]'
            }`}
          />
          {errors.firstName && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle size={12} /> {errors.firstName}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="player-lastname"
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B918E] block"
          >
            Sobrenome
          </label>
          <input
            id="player-lastname"
            type="text"
            value={lastName}
            onChange={(e) => onUpdateField('lastName', e.target.value)}
            placeholder="Ex: Barbosa"
            maxLength={25}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#111313] border border-[#262B2B] text-[#F4F5F2] text-sm focus:outline-none focus:border-[#B7FF3C] transition-colors"
          />
        </div>
      </div>

      {/* 2. Nome Exibido na Carreira */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="player-displayname"
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B918E] block"
          >
            Nome Exibido na Camisa / Narração
          </label>
          <span className="text-[10px] text-[#8B918E]">Opcional (Ex: apelido ou nome de jogo)</span>
        </div>
        <input
          id="player-displayname"
          type="text"
          value={displayName}
          onChange={(e) => onUpdateField('displayName', e.target.value)}
          placeholder={firstName || 'Ex: Gabi'}
          maxLength={20}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#111313] border border-[#262B2B] text-[#F4F5F2] text-sm focus:outline-none focus:border-[#B7FF3C] transition-colors"
        />
      </div>

      {/* 3. Número da Camisa (1–99) */}
      <div className="space-y-2.5 pt-2 border-t border-[#191C1C]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B918E] block">
            Número da Camisa (1–99) <span className="text-[#B7FF3C]">*</span>
          </label>
          <span className="font-mono text-sm font-black text-[#B7FF3C]">
            #{kitNumber}
          </span>
        </div>

        {/* Atalhos para Números Clássicos do Futebol */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CLASSIC_NUMBERS.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onUpdateField('kitNumber', num)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer border ${
                kitNumber === num
                  ? 'bg-[#B7FF3C] text-[#080909] border-[#B7FF3C]'
                  : 'bg-[#111313] text-[#8B918E] border-[#222626] hover:text-[#F4F5F2]'
              }`}
            >
              #{num}
            </button>
          ))}

          {/* Input Direto para Qualquer Número 1-99 */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-xs font-mono text-[#8B918E]">Outro:</span>
            <input
              type="number"
              min={1}
              max={99}
              value={kitNumber}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) {
                  onUpdateField('kitNumber', Math.max(1, Math.min(99, val)));
                }
              }}
              className="w-16 px-2.5 py-1 rounded-lg bg-[#111313] border border-[#262B2B] text-center font-mono text-xs font-bold text-[#F4F5F2] focus:outline-none focus:border-[#B7FF3C]"
            />
          </div>
        </div>

        {errors.kitNumber && (
          <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
            <AlertCircle size={12} /> {errors.kitNumber}
          </p>
        )}
      </div>

      {/* 4. Posição Oficial (Exatamente as 10 Posições) */}
      <div className="space-y-3 pt-2 border-t border-[#191C1C]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#8B918E] block">
            Posição em Campo <span className="text-[#B7FF3C]">*</span>
          </label>
          <span className="text-xs font-mono font-semibold text-[#B7FF3C]">
            {position} • {getPositionName(position)}
          </span>
        </div>

        <div className="space-y-3">
          {positionGroups.map((group) => (
            <div key={group.sector} className="space-y-1.5">
              <span className="text-[10px] font-mono text-[#8B918E] uppercase tracking-wider block">
                {group.sector}
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {group.ids.map((posId) => {
                  const isSelected = position === posId;
                  return (
                    <button
                      key={posId}
                      type="button"
                      onClick={() => onUpdateField('position', posId)}
                      className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#191C1C] border-[#B7FF3C] text-[#F4F5F2] shadow-sm'
                          : 'bg-[#111313] border-[#222626] text-[#8B918E] hover:text-[#F4F5F2]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-black text-[#B7FF3C]">
                          {posId}
                        </span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF3C]" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#8B918E] block truncate mt-0.5">
                        {getPositionName(posId)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {errors.position && (
          <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
            <AlertCircle size={12} /> {errors.position}
          </p>
        )}
      </div>
    </div>
  );
}
