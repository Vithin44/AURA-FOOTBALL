/**
 * AURA Football - HubPage (Central Principal da Carreira)
 * Visão cinematográfica do estádio, atleta, próximo compromisso e notícias.
 */

import React from 'react';
import { useCareer } from '../state/careerState';
import { useNavigation } from '../state/navigationState';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { StatDisplay } from '../components/StatDisplay';
import { formatFichas, getPositionName } from '../utils/formatters';
import {
  Swords,
  Dumbbell,
  User,
  Sparkles,
  ChevronRight,
  Flame,
  Calendar,
  Shield,
  Newspaper,
  Terminal,
  Edit3,
} from 'lucide-react';
import { PlayerAvatar2D } from '../components/avatar/PlayerAvatar2D';
import { AttributeDisplay } from '../components/AttributeDisplay';
import { ATTRIBUTE_IDS, POSITION_ATTRIBUTE_PROFILES } from '../data/attributes';

export function HubPage() {
  const { career } = useCareer();
  const { navigateTo } = useNavigation();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24">
      {/* Banner Principal / Boas-Vindas ao Clube */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#111313] via-[#141818] to-[#111313] border border-[#222626] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B7FF3C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar 2D em Destaque */}
            <div
              onClick={() => navigateTo('character_creation')}
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#080909] border-2 border-[#B7FF3C] overflow-hidden flex items-center justify-center cursor-pointer group shrink-0 shadow-lg"
              title="Clique para editar o atleta"
            >
              <PlayerAvatar2D
                avatar={career.player.avatar}
                kitNumber={career.player.kitNumber}
                mode="bust"
                className="w-28 h-28 scale-125 translate-y-2 group-hover:scale-130 transition-transform duration-300"
                showGlow={false}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Edit3 size={16} className="text-[#B7FF3C]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="green">{career.player.prestige}</Badge>
                <span className="text-xs font-mono text-[#8B918E]">
                  {career.season.currentPhase} • Ano {career.season.year}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#F4F5F2] tracking-tight">
                {career.player.name}
                {career.player.nickname && (
                  <span className="text-[#8B918E] font-normal text-xl ml-2">
                    "{career.player.nickname}"
                  </span>
                )}
              </h1>
              <p className="text-sm text-[#8B918E] max-w-xl">
                Camisa #{career.player.kitNumber} •{' '}
                <strong className="text-[#F4F5F2] font-medium">
                  {getPositionName(career.player.position)} ({career.player.position})
                </strong>{' '}
                no <span className="text-[#F4F5F2] font-semibold">{career.club.name}</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#080909]/70 backdrop-blur-sm p-4 rounded-xl border border-[#262B2B]">
            <div className="text-center px-2">
              <span className="text-[10px] font-mono uppercase text-[#8B918E] block">OVR</span>
              <span className="font-mono text-3xl font-black text-[#F4F5F2]">
                {career.player.ovr}
              </span>
            </div>
            <div className="w-px h-10 bg-[#262B2B]" />
            <div className="text-center px-2">
              <span className="text-[10px] font-mono uppercase text-[#8B918E] block">AURA</span>
              <span className="font-mono text-3xl font-black text-[#B7FF3C]">
                {career.player.aura}
              </span>
            </div>
            <div className="w-px h-10 bg-[#262B2B]" />
            <div className="text-center px-2">
              <span className="text-[10px] font-mono uppercase text-[#8B918E] block">Fichas</span>
              <span className="font-mono text-2xl font-black text-[#D9B65D]">
                {formatFichas(career.currency.fichas)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Central: Próxima Partida & Ações Rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Próximo Confronto e Resumo */}
        <div className="lg:col-span-2 space-y-6">
          {/* Próximo Jogo */}
          <Card variant="dark" className="relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#191C1C] mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-[#B7FF3C]" />
                <span className="text-xs font-mono font-bold text-[#F4F5F2] uppercase tracking-wider">
                  Próximo Confronto • Semana {career.season.currentWeek}
                </span>
              </div>
              <Badge variant="dark">{career.club.league}</Badge>
            </div>

            <div className="grid grid-cols-3 items-center py-4 text-center">
              {/* Mandante */}
              <div className="space-y-2">
                <div
                  className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center font-display font-black text-xl border border-white/20 shadow-lg"
                  style={{
                    backgroundColor: career.club.primaryColor,
                    color: career.club.secondaryColor,
                  }}
                >
                  {career.club.shortName}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F4F5F2]">{career.club.name}</h3>
                  <span className="text-[11px] font-mono text-[#8B918E]">OVR {career.club.ovr}</span>
                </div>
              </div>

              {/* Versus */}
              <div className="space-y-1">
                <span className="font-mono text-2xl font-black text-[#B7FF3C] tracking-widest">
                  VS
                </span>
                <span className="text-[11px] font-mono text-[#8B918E] block">
                  {career.club.stadium}
                </span>
                <span className="text-[10px] text-[#8B918E] block">Arbitragem Oficial</span>
              </div>

              {/* Adversário */}
              <div className="space-y-2">
                <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center font-display font-black text-xl bg-[#3B82F6] text-[#F4F5F2] border border-white/20 shadow-lg">
                  MET
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F4F5F2]">Metropolitano</h3>
                  <span className="text-[11px] font-mono text-[#8B918E]">OVR 74</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#191C1C] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-[#8B918E]">
                Status do Atleta: <strong className="text-[#B7FF3C]">Titular Confirmado</strong>
              </span>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigateTo('matches')}
                  className="flex-1 sm:flex-initial"
                >
                  <Swords size={16} />
                  Entrar em Campo
                </Button>
              </div>
            </div>
          </Card>

          {/* Atributos Principais Rápidos */}
          <Card variant="dark">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#F4F5F2]">6 Atributos Oficiais</h3>
                <span className="text-[10px] font-mono text-[#8B918E]">Escala 1–100 • {career.player.position}</span>
              </div>
              <button
                onClick={() => navigateTo('player')}
                className="text-xs text-[#B7FF3C] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                Ficha Completa <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {ATTRIBUTE_IDS.map((attrId) => {
                const val = career.player.attributes[attrId];
                const importance = POSITION_ATTRIBUTE_PROFILES[career.player.position]?.importance[attrId];
                return (
                  <AttributeDisplay
                    key={attrId}
                    attributeId={attrId}
                    value={val}
                    importance={importance}
                    compact={true}
                    showBar={true}
                    showDescription={false}
                  />
                );
              })}
            </div>
          </Card>
        </div>

        {/* Coluna 3: Ações Rápidas & Notícias da Semana */}
        <div className="space-y-6">
          {/* Menu Rápido de Ações */}
          <Card variant="dark" className="space-y-2">
            <h3 className="text-sm font-bold text-[#F4F5F2] mb-3">Atividades da Semana</h3>

            <button
              onClick={() => navigateTo('training')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#191C1C] hover:bg-[#222626] border border-[#262B2B] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#B7FF3C]/10 flex items-center justify-center text-[#B7FF3C]">
                  <Dumbbell size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#F4F5F2] block group-hover:text-[#B7FF3C] transition-colors">
                    Treinamento Focado
                  </span>
                  <span className="text-[10px] text-[#8B918E]">Evolua atributos antes do jogo</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#8B918E]" />
            </button>

            <button
              onClick={() => navigateTo('casino')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#191C1C] hover:bg-[#222626] border border-[#262B2B] text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D9B65D]/10 flex items-center justify-center text-[#D9B65D]">
                  <Sparkles size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#F4F5F2] block group-hover:text-[#D9B65D] transition-colors">
                    Cassino VIP (Fictício)
                  </span>
                  <span className="text-[10px] text-[#8B918E]">Aposte Fichas nos minigames</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#8B918E]" />
            </button>

            <button
              onClick={() => navigateTo('diagnostics')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#191C1C] hover:bg-[#222626] border border-[#B7FF3C]/30 text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#B7FF3C]/20 flex items-center justify-center text-[#B7FF3C]">
                  <Terminal size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#F4F5F2] block group-hover:text-[#B7FF3C] transition-colors">
                    Diagnóstico da Engine
                  </span>
                  <span className="text-[10px] text-[#B7FF3C] font-mono">Página separada de testes</span>
                </div>
              </div>
              <ChevronRight size={14} className="text-[#8B918E]" />
            </button>
          </Card>

          {/* Notícia Recente */}
          <Card variant="dark">
            <div className="flex items-center gap-2 mb-3">
              <Newspaper size={15} className="text-[#B7FF3C]" />
              <h3 className="text-sm font-bold text-[#F4F5F2]">Última da Imprensa</h3>
            </div>

            {career.news && career.news.length > 0 ? (
              <div className="space-y-2">
                <div className="p-3 bg-[#191C1C] rounded-xl border border-[#262B2B]">
                  <span className="text-[10px] font-mono text-[#8B918E] block">
                    {career.news[0].date} • {career.news[0].category}
                  </span>
                  <h4 className="text-xs font-bold text-[#F4F5F2] mt-1">
                    {career.news[0].title}
                  </h4>
                  <p className="text-[11px] text-[#8B918E] mt-1 leading-relaxed">
                    {career.news[0].description}
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('news')}
                  className="w-full text-center text-xs text-[#8B918E] hover:text-[#F4F5F2] pt-1 cursor-pointer"
                >
                  Ver todas as notícias
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#8B918E]">Nenhuma notícia no momento.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
