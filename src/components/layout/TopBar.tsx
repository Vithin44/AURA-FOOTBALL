/**
 * AURA Football - Layout: TopBar Contextual
 * Barra superior elegante com dados em tempo real da Carreira e do Jogador.
 */

import React from 'react';
import { useCareer } from '../../state/careerState';
import { useNavigation } from '../../state/navigationState';
import { formatFichas } from '../../utils/formatters';
import { Coins, Zap, Shield, Terminal } from 'lucide-react';

export function TopBar() {
  const { career } = useCareer();
  const { activePage, navigateTo } = useNavigation();

  return (
    <header className="sticky top-0 z-40 bg-[#080909]/90 backdrop-blur-md border-b border-[#191C1C] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Marca / Identidade AURA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('hub')}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            title="Ir para o HUB da Carreira"
          >
            <div className="w-8 h-8 rounded-lg bg-[#B7FF3C] flex items-center justify-center font-display font-black text-[#080909] text-base shadow-sm group-hover:scale-105 transition-transform">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black tracking-wider text-sm text-[#F4F5F2]">
                  AURA
                </span>
                <span className="text-[10px] font-mono tracking-widest text-[#B7FF3C] uppercase font-bold">
                  FC
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#8B918E] block -mt-0.5">
                S{career.season.seasonNumber} • Sem {career.season.currentWeek}/{career.season.totalWeeks}
              </span>
            </div>
          </button>

          {/* Clube Atual */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#191C1C]">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-white/20 shadow-sm"
              style={{
                backgroundColor: career.club.primaryColor,
                color: career.club.secondaryColor,
              }}
            >
              {career.club.shortName.slice(0, 2)}
            </div>
            <div className="text-left">
              <span className="text-xs font-semibold text-[#F4F5F2] block leading-tight">
                {career.club.name}
              </span>
              <span className="text-[10px] text-[#8B918E] block leading-tight">
                {career.club.league}
              </span>
            </div>
          </div>
        </div>

        {/* Recursos: Fichas, AURA, Atleta e Botão de Diagnóstico */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Fichas - Moeda Única Oficial */}
          <button
            onClick={() => navigateTo('store')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111313] border border-[#222626] hover:border-[#D9B65D]/50 transition-colors cursor-pointer"
            title="Saldo único de Fichas (Carreira & Cassino)"
          >
            <div className="w-5 h-5 rounded-full bg-[#D9B65D]/20 flex items-center justify-center text-[#D9B65D]">
              <Coins size={12} />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-mono uppercase text-[#8B918E] block -mb-0.5 leading-none">
                Fichas
              </span>
              <span className="font-mono text-xs font-bold text-[#D9B65D] leading-tight">
                {formatFichas(career.currency.fichas)}
              </span>
            </div>
          </button>

          {/* Medidor de AURA */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#111313] border border-[#222626]"
            title="Medidor de AURA do Atleta"
          >
            <div className="w-5 h-5 rounded-full bg-[#B7FF3C]/10 flex items-center justify-center text-[#B7FF3C]">
              <Zap size={12} />
            </div>
            <div className="text-left">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase text-[#8B918E] leading-none">
                  AURA
                </span>
                <span className="font-mono text-xs font-bold text-[#B7FF3C] leading-none">
                  {career.player.aura}%
                </span>
              </div>
              <div className="w-16 h-1.5 bg-[#191C1C] rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[#B7FF3C] rounded-full transition-all duration-300"
                  style={{ width: `${career.player.aura}%` }}
                />
              </div>
            </div>
          </div>

          {/* Jogador Ativo (Resumo com Avatar 2D, OVR e Posição) */}
          <button
            onClick={() => navigateTo('player')}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#111313] border border-[#222626] hover:border-[#B7FF3C]/40 transition-colors cursor-pointer"
            title="Ficha Completa do Atleta"
          >
            <div className="w-7 h-7 rounded-lg bg-[#191C1C] border border-[#2A2E2E] overflow-hidden flex items-center justify-center">
              <span className="font-mono text-[10px] font-black text-[#B7FF3C]">
                #{career.player.kitNumber}
              </span>
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-xs font-semibold text-[#F4F5F2] leading-tight truncate max-w-[90px]">
                {career.player.nickname || career.player.name}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold text-[#B7FF3C]">
                  {career.player.position}
                </span>
                <span className="text-[10px] font-mono text-[#8B918E]">
                  OVR {career.player.ovr}
                </span>
              </div>
            </div>
          </button>

          {/* Atalho para Criação de Jogador */}
          <button
            onClick={() => navigateTo('character_creation')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              activePage === 'character_creation'
                ? 'bg-[#B7FF3C] text-[#080909] font-bold border-[#B7FF3C]'
                : 'bg-[#111313] text-[#8B918E] border-[#222626] hover:text-[#F4F5F2] hover:border-[#333]'
            }`}
            title="Criar novo atleta e avatar 2D"
          >
            <span className="hidden sm:inline">Criar Atleta</span>
            <span className="sm:hidden">+</span>
          </button>

          {/* Botão de Atalho para a Tela Separada de Diagnóstico da Engine */}
          <button
            onClick={() => navigateTo('diagnostics')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              activePage === 'diagnostics'
                ? 'bg-[#B7FF3C] text-[#080909] font-bold border-[#B7FF3C]'
                : 'bg-[#111313] text-[#8B918E] border-[#222626] hover:text-[#F4F5F2] hover:border-[#333]'
            }`}
            title="Abrir página separada com diagnóstico técnico da Engine"
          >
            <Terminal size={13} />
            <span className="hidden md:inline">Engine Dev</span>
          </button>
        </div>
      </div>
    </header>
  );
}
