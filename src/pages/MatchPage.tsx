/**
 * AURA Football - Tela Oficial: Partida de Teste (Prompt 08)
 * Interface de desenvolvimento e teste da Engine de Partida.
 * Simulação narrativa/interativa baseada em minutos regulamentares (0 a 90).
 * Identidade visual oficial: Dark canvas (#080909), superfícies escuras,
 * AURA Green (#B7FF3C), IBM Plex Mono e tipografia Archivo.
 */

import React, { useState } from 'react';
import { useCareer } from '../state/careerState';
import { useNavigation } from '../state/navigationState';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { INITIAL_CLUBS } from '../data/clubs';
import {
  Match,
  MatchStatus,
  MatchPeriod,
  Club,
} from '../types';
import {
  createMatch,
  startMatch,
  advanceMatchMinute,
  simulateMatch,
  scoreGoal,
  formatMatchClock,
  getMatchStatusLabel,
  canAdvanceMatch,
  MATCH_REGULATION_MINUTES,
  MATCH_HALF_TIME_MINUTE,
} from '../engine/match';
import {
  Swords,
  Play,
  FastForward,
  RotateCcw,
  Zap,
  Info,
  Shield,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  Radio,
  Activity,
  Filter,
  Flame,
} from 'lucide-react';

export function MatchPage() {
  const { career } = useCareer();
  const { navigateTo } = useNavigation();

  // Adversário padrão: Metropolitano ou Esperança (diferente do clube atual do jogador)
  const opponentClub =
    INITIAL_CLUBS.find((c) => c.id !== career.club.id) || INITIAL_CLUBS[2];

  // Estado da partida de teste (usando o clube da carreira como Mandante por padrão)
  const [match, setMatch] = useState<Match>(() =>
    createMatch({
      homeTeam: career.club,
      awayTeam: opponentClub,
      playerTeamId: career.club.id,
      competition: career.club.league,
      season: career.season.seasonNumber,
      venue: 'home',
      seed: 42091,
      initialStatus: 'scheduled',
    })
  );

  // Histórico de lances da partida de teste
  const [log, setLog] = useState<string[]>([
    'Partida de teste criada e pronta para o pontapé inicial.',
  ]);

  // Filtro de eventos do log
  const [eventFilter, setEventFilter] = useState<'all' | 'significant' | 'player'>('all');

  // Avança 1 minuto na engine
  const handleAdvanceMinute = () => {
    if (!canAdvanceMatch(match)) return;

    setMatch((prev) => {
      const next = advanceMatchMinute(prev, career.player);
      let eventMsg = `Minuto ${formatMatchClock(next)}: partida em andamento.`;

      if (next.status === 'half_time') {
        eventMsg = `Minuto 45': Fim do primeiro tempo! Equipes vão para o INTERVALO.`;
      } else if (next.status === 'finished') {
        eventMsg = `Minuto 90': Apito final! FIM DE JOGO. Placar final: ${next.homeTeam.shortName} ${next.homeScore} x ${next.awayScore} ${next.awayTeam.shortName}.`;
      } else if (prev.status === 'half_time' && next.minute === 46) {
        eventMsg = `Minuto 46': Começa o 2º tempo da partida.`;
      } else if (prev.status === 'scheduled') {
        eventMsg = `Minuto 1': Bola rolando! Início do confronto.`;
      }

      setLog((l) => [eventMsg, ...l.slice(0, 19)]);
      return next;
    });
  };

  // Simula a partida integralmente até os 90'
  const handleSimulateFull = () => {
    if (match.status === 'finished') return;

    setMatch((prev) => {
      const simulated = simulateMatch(prev, career.player);
      setLog((l) => [
        `Simulação completa concluída: Partida finalizada aos 90 minutos. Placar: ${simulated.homeTeam.shortName} ${simulated.homeScore} x ${simulated.awayScore} ${simulated.awayTeam.shortName}.`,
        ...l.slice(0, 19),
      ]);
      return simulated;
    });
  };

  // Reinicia a partida de teste
  const handleResetMatch = (venue: 'home' | 'away' = 'home') => {
    const isHome = venue === 'home';
    const newSeed = Math.floor(Math.random() * 900000) + 10000;
    const fresh = createMatch({
      homeTeam: isHome ? career.club : opponentClub,
      awayTeam: isHome ? opponentClub : career.club,
      playerTeamId: career.club.id,
      competition: career.club.league,
      season: career.season.seasonNumber,
      venue,
      seed: newSeed,
      initialStatus: 'scheduled',
    });
    setMatch(fresh);
    setLog([
      `Nova partida reiniciada com semente ${newSeed}. Mando: ${isHome ? 'CASA' : 'FORA'}. Minuto 0'.`,
    ]);
  };

  // Adiciona gol para testes do motor
  const handleAddGoal = (team: 'home' | 'away') => {
    setMatch((prev) => {
      const updated = scoreGoal(prev, team, 1);
      const teamName = team === 'home' ? updated.homeTeam.name : updated.awayTeam.name;
      setLog((l) => [
        `GOL! ${teamName} balança as redes aos ${formatMatchClock(updated)}! (${updated.homeScore} x ${updated.awayScore})`,
        ...l.slice(0, 19),
      ]);
      return updated;
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-28">
      {/* Header da Tela com Contexto Técnico e Identidade Visual */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#191C1C]">
        <div>
          <div className="flex items-center gap-2">
            <Swords size={20} className="text-[#B7FF3C]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#F4F5F2] tracking-tight font-display">
              PARTIDA DE TESTE
            </h1>
          </div>
          <p className="text-xs text-[#8B918E] mt-0.5 font-mono">
            {match.competition} • Temporada {match.season} • Seed: {match.seed}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={
              match.status === 'live'
                ? 'green'
                : match.status === 'finished'
                ? 'dark'
                : 'gold'
            }
            className="py-1 px-3 font-mono font-bold uppercase text-xs"
          >
            {getMatchStatusLabel(match)}
          </Badge>
          <span className="text-xs font-mono text-[#8B918E]">
            Mando: {match.venue === 'home' ? 'CASA' : 'FORA'}
          </span>
        </div>
      </div>

      {/* Cartão Central do Duelo: TIME A x TIME B com Placar e Minuto */}
      <div className="relative rounded-2xl bg-[#111313] border border-[#222626] p-6 sm:p-8 overflow-hidden shadow-2xl">
        {/* Efeito sutil de iluminação lateral esportiva */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#B7FF3C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-6 relative z-10">
          {/* TIME A (MANDANTE) */}
          <div className="md:col-span-4 flex flex-col items-center md:items-end text-center md:text-right space-y-2">
            <div className="flex items-center gap-3 flex-col md:flex-row-reverse">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-black text-xl border-2 border-white/20 shadow-lg"
                style={{
                  backgroundColor: match.homeTeam.primaryColor,
                  color: match.homeTeam.secondaryColor,
                }}
              >
                {match.homeTeam.shortName}
              </div>
              <div>
                <div className="flex items-center gap-1.5 justify-center md:justify-end">
                  {match.homeTeam.id === career.club.id && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#B7FF3C]/20 text-[#B7FF3C] border border-[#B7FF3C]/30 font-bold uppercase">
                      SEU CLUBE
                    </span>
                  )}
                  <span className="text-[10px] font-mono uppercase text-[#8B918E]">MANDANTE</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#F4F5F2] tracking-tight font-display mt-0.5">
                  {match.homeTeam.name}
                </h2>
                <span className="text-xs font-mono text-[#8B918E]">OVR {match.homeTeam.ovr}</span>
              </div>
            </div>

            {/* Botão de Teste para Gol do Mandante */}
            <button
              type="button"
              disabled={match.status === 'finished'}
              onClick={() => handleAddGoal('home')}
              className="text-[11px] font-mono text-[#8B918E] hover:text-[#B7FF3C] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed pt-1"
            >
              <Plus size={12} />
              +1 Gol para {match.homeTeam.shortName}
            </button>
          </div>

          {/* CENTRO: PLACAR E RELÓGIO DA PARTIDA */}
          <div className="md:col-span-3 flex flex-col items-center justify-center text-center py-2 px-4 rounded-xl bg-[#080909]/80 border border-[#222626]">
            {/* Rótulo de Minuto / Etapa */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#8B918E] mb-1">
              <Clock size={13} className="text-[#B7FF3C]" />
              <span className="uppercase font-bold tracking-wider">
                {formatMatchClock(match)}
              </span>
            </div>

            {/* Placar em Destaque Oficial */}
            <div className="flex items-center gap-3 my-1">
              <span className="font-display text-4xl sm:text-5xl font-black text-[#F4F5F2] tracking-tight min-w-[36px] text-right">
                {match.homeScore}
              </span>
              <span className="text-2xl font-light text-[#555C59]">×</span>
              <span className="font-display text-4xl sm:text-5xl font-black text-[#F4F5F2] tracking-tight min-w-[36px] text-left">
                {match.awayScore}
              </span>
            </div>

            {/* Status Visual com Estilo AURA Football */}
            <span
              className={`text-[10px] font-mono uppercase tracking-widest font-black px-2 py-0.5 rounded mt-1 ${
                match.status === 'live'
                  ? 'text-[#B7FF3C] bg-[#B7FF3C]/10 border border-[#B7FF3C]/30 animate-pulse'
                  : match.status === 'half_time'
                  ? 'text-amber-300 bg-amber-400/10 border border-amber-400/30'
                  : match.status === 'finished'
                  ? 'text-[#8B918E] bg-[#191C1C] border border-[#2A2E2E]'
                  : 'text-[#8B918E] bg-[#191C1C]'
              }`}
            >
              {match.status === 'half_time'
                ? 'INTERVALO'
                : match.status === 'finished'
                ? 'FIM DE JOGO'
                : match.status === 'live'
                ? 'AO VIVO'
                : 'AGENDADA'}
            </span>

            {/* Barra de Progresso dos 90 Minutos */}
            <div className="w-full bg-[#191C1C] h-1.5 rounded-full overflow-hidden mt-3 border border-[#262B2B]">
              <div
                className="h-full bg-[#B7FF3C] transition-all duration-200"
                style={{
                  width: `${Math.min(100, (match.minute / MATCH_REGULATION_MINUTES) * 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between w-full text-[9px] font-mono text-[#555C59] mt-1">
              <span>0'</span>
              <span>45' (INT)</span>
              <span>90'</span>
            </div>
          </div>

          {/* TIME B (VISITANTE) */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left space-y-2">
            <div className="flex items-center gap-3 flex-col md:flex-row">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-black text-xl border-2 border-white/20 shadow-lg"
                style={{
                  backgroundColor: match.awayTeam.primaryColor,
                  color: match.awayTeam.secondaryColor,
                }}
              >
                {match.awayTeam.shortName}
              </div>
              <div>
                <div className="flex items-center gap-1.5 justify-center md:justify-start">
                  <span className="text-[10px] font-mono uppercase text-[#8B918E]">VISITANTE</span>
                  {match.awayTeam.id === career.club.id && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#B7FF3C]/20 text-[#B7FF3C] border border-[#B7FF3C]/30 font-bold uppercase">
                      SEU CLUBE
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#F4F5F2] tracking-tight font-display mt-0.5">
                  {match.awayTeam.name}
                </h2>
                <span className="text-xs font-mono text-[#8B918E]">OVR {match.awayTeam.ovr}</span>
              </div>
            </div>

            {/* Botão de Teste para Gol do Visitante */}
            <button
              type="button"
              disabled={match.status === 'finished'}
              onClick={() => handleAddGoal('away')}
              className="text-[11px] font-mono text-[#8B918E] hover:text-[#B7FF3C] transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed pt-1"
            >
              <Plus size={12} />
              +1 Gol para {match.awayTeam.shortName}
            </button>
          </div>
        </div>

        {/* Barra de Controles da Partida (Prompt 08, Itens 13 e 18) */}
        <div className="mt-8 pt-5 border-t border-[#191C1C] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#8B918E]">Atleta:</span>
            <span className="text-xs font-bold text-[#F4F5F2]">{career.player.name}</span>
            <Badge variant="dark" className="text-[10px] font-mono">
              OVR {career.player.ovr}
            </Badge>
            <Badge variant="green" className="text-[10px] font-mono">
              AURA {career.player.aura}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Botão Principal: AVANÇAR 1 MINUTO */}
            <Button
              variant="primary"
              size="md"
              disabled={!canAdvanceMatch(match)}
              onClick={handleAdvanceMinute}
              className="font-mono text-xs uppercase"
            >
              <Play size={14} />
              {match.status === 'scheduled'
                ? 'INICIAR PARTIDA (0\' → 1\')'
                : match.status === 'half_time'
                ? 'INICIAR 2º TEMPO (45\' → 46\')'
                : match.minute === 89
                ? 'APITO FINAL (89\' → 90\')'
                : match.status === 'finished'
                ? 'PARTIDA FINALIZADA'
                : 'AVANÇAR 1 MINUTO'}
            </Button>

            {/* Botão: SIMULAR PARTIDA (Leva direto ao 90') */}
            <Button
              variant="outline"
              size="md"
              disabled={match.status === 'finished'}
              onClick={handleSimulateFull}
              className="font-mono text-xs"
            >
              <FastForward size={14} />
              Simular Partida (Direto aos 90')
            </Button>

            {/* Botão de Reiniciar Partida de Teste */}
            <Button
              variant="secondary"
              size="md"
              onClick={() => handleResetMatch('home')}
              className="text-xs"
            >
              <RotateCcw size={13} />
              Reiniciar (Casa)
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={() => handleResetMatch('away')}
              className="text-xs"
            >
              <RotateCcw size={13} />
              Reiniciar (Fora)
            </Button>
          </div>
        </div>
      </div>

      {/* Banner de Destaque: MOMENTO DISPONÍVEL / ATIVO (Prompt 10, Seções 29 e 30) */}
      {match.moments.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl border border-[#B7FF3C]/40 bg-[#121A14] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-[#B7FF3C] text-[#080909]">
                MOMENTO DISPONÍVEL
              </span>
              <span className="text-xs font-mono font-bold text-[#B7FF3C]">
                {match.moments[match.moments.length - 1].minute}'
              </span>
              <span className="text-xs font-mono uppercase text-[#8B918E]">
                [{match.moments[match.moments.length - 1].status === 'pending' ? 'ATIVO' : match.moments[match.moments.length - 1].status.toUpperCase()}]
              </span>
            </div>
            <h3 className="text-lg font-black text-[#F4F5F2] font-display uppercase tracking-tight">
              {match.moments[match.moments.length - 1].title}
            </h3>
            <p className="text-xs text-[#D8DDD9]">
              {match.moments[match.moments.length - 1].description}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-[#8B918E] bg-[#191C1C] px-2.5 py-1 rounded-lg border border-[#262B2B]">
              Decisões estarão disponíveis em breve
            </span>
          </div>
        </div>
      )}

      {/* Grid Informativo: Momentos, Regras Centrais e Feed de Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna da Esquerda: Momentos e Regras da Engine */}
        <div className="lg:col-span-6 space-y-4">
          {/* Card Oficial de Momentos (Prompt 10) */}
          <Card variant="dark" className="border-[#262B2B]">
            <div className="flex items-center justify-between pb-3 border-b border-[#191C1C] mb-3">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-[#B7FF3C]" />
                <h3 className="text-sm font-bold text-[#F4F5F2] uppercase tracking-wider font-mono">
                  MOMENTOS
                </h3>
              </div>
              <Badge variant={match.moments.length > 0 ? 'green' : 'dark'} className="text-[10px] font-mono">
                {match.moments.length} {match.moments.length === 1 ? 'MOMENTO' : 'MOMENTOS'}
              </Badge>
            </div>

            {/* Lista dos Momentos da Partida */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {match.moments.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-[#555C59]">
                  Nenhum momento gerado ainda. Momentos surgem em lances especiais do seu atleta.
                </div>
              ) : (
                match.moments
                  .slice()
                  .reverse()
                  .map((moment, idx) => (
                    <div
                      key={moment.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        idx === 0
                          ? 'bg-[#152014] border-[#B7FF3C]/50 shadow-sm shadow-[#B7FF3C]/5'
                          : 'bg-[#111313] border-[#222626]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-sm text-[#B7FF3C] bg-[#191C1C] px-2 py-0.5 rounded border border-[#2A2E2E]">
                            {moment.minute}'
                          </span>
                          <span className="font-display font-black text-xs uppercase tracking-wider text-[#F4F5F2]">
                            {moment.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-mono uppercase font-black px-2 py-0.5 rounded ${
                              idx === 0
                                ? 'bg-[#B7FF3C] text-[#080909]'
                                : 'bg-[#191C1C] text-[#8B918E] border border-[#2A2E2E]'
                            }`}
                          >
                            {moment.status === 'pending' ? (idx === 0 ? 'ATIVO' : 'PENDENTE') : moment.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[#D8DDD9] leading-relaxed pl-0.5">
                        {moment.description}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-[#1C2220] flex items-center justify-between text-[10px] font-mono text-[#8B918E]">
                        <span>TIPO: {moment.type.toUpperCase()}</span>
                        <span className="text-[#555C59]">ESTADO: {moment.status.toUpperCase()}</span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </Card>

          {/* Painel de Regras da Engine (Prompt 08) */}
          <Card variant="dark" className="border-[#262B2B]">
            <div className="flex items-center gap-2 pb-3 border-b border-[#191C1C] mb-3">
              <Info size={16} className="text-[#B7FF3C]" />
              <h3 className="text-sm font-bold text-[#F4F5F2] uppercase tracking-wider font-mono">
                Regras Oficiais da Engine de Partidas
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-[#8B918E]">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#B7FF3C] shrink-0 mt-0.5" />
                <p>
                  <strong>Tempo Regulamentar:</strong> A partida compreende de 0 a 90 minutos inteiros, divididos em 1º tempo (0 a 45) e 2º tempo (46 a 90).
                </p>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#B7FF3C] shrink-0 mt-0.5" />
                <p>
                  <strong>Intervalo Obrigatório:</strong> Ao atingir exatamente 45', a partida entra em status de intervalo (half_time) antes de retornar ao live no minuto 46'.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#B7FF3C] shrink-0 mt-0.5" />
                <p>
                  <strong>Determinismo RNG:</strong> Toda a simulação utiliza semente determinística (Mulberry32), sem Math.random() na engine.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-[#B7FF3C] shrink-0 mt-0.5" />
                <p>
                  <strong>Preservação Integral:</strong> A simulação base não altera AURA ({career.player.aura}), OVR ({career.player.ovr}) nem os 6 atributos oficiais.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Feed de Eventos da Partida (Prompt 09 - Engine de Eventos) */}
        <div className="lg:col-span-6 space-y-4">
          <Card variant="dark" className="border-[#262B2B]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#191C1C] mb-3 gap-2">
              <div className="flex items-center gap-2">
                <Radio size={16} className="text-[#B7FF3C]" />
                <h3 className="text-sm font-bold text-[#F4F5F2] uppercase tracking-wider font-mono">
                  Feed de Eventos da Partida
                </h3>
              </div>
              
              {/* Filtros rápidos de eventos */}
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setEventFilter('all')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    eventFilter === 'all'
                      ? 'bg-[#B7FF3C] text-[#080909] font-bold'
                      : 'bg-[#191C1C] text-[#8B918E] hover:text-[#F4F5F2]'
                  }`}
                >
                  Todos ({match.events.length})
                </button>
                <button
                  type="button"
                  onClick={() => setEventFilter('significant')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    eventFilter === 'significant'
                      ? 'bg-[#B7FF3C] text-[#080909] font-bold'
                      : 'bg-[#191C1C] text-[#8B918E] hover:text-[#F4F5F2]'
                  }`}
                >
                  Relevantes ({match.events.filter((e) => e.isSignificant).length})
                </button>
                <button
                  type="button"
                  onClick={() => setEventFilter('player')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    eventFilter === 'player'
                      ? 'bg-[#B7FF3C] text-[#080909] font-bold'
                      : 'bg-[#191C1C] text-[#8B918E] hover:text-[#F4F5F2]'
                  }`}
                >
                  Meu Atleta ({match.events.filter((e) => e.playerId === career.player.id).length})
                </button>
              </div>
            </div>

            {/* Lista com scroll cronológico dos eventos gerados */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {match.events.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-[#555C59]">
                  Nenhum evento registrado. Clique em AVANÇAR 1 MINUTO ou SIMULAR PARTIDA.
                </div>
              ) : (
                match.events
                  .filter((e) => {
                    if (eventFilter === 'significant') return e.isSignificant;
                    if (eventFilter === 'player') return e.playerId === career.player.id;
                    return true;
                  })
                  .slice()
                  .reverse()
                  .map((evt) => {
                    const isUserPlayer = evt.playerId === career.player.id;
                    const isHomeTeam = evt.teamId === match.homeTeam.id;
                    const teamShort = isHomeTeam ? match.homeTeam.shortName : match.awayTeam.shortName;

                    return (
                      <div
                        key={evt.id}
                        className={`p-2.5 rounded-xl border transition-all text-xs ${
                          evt.type === 'goal'
                            ? 'bg-[#142010] border-[#B7FF3C]/40'
                            : evt.importance === 'high'
                            ? 'bg-[#1A1812] border-amber-500/30'
                            : isUserPlayer
                            ? 'bg-[#161C19] border-[#B7FF3C]/30'
                            : 'bg-[#111313] border-[#222626]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                            <span className="font-bold text-[#B7FF3C] bg-[#191C1C] px-1.5 py-0.5 rounded border border-[#2A2E2E]">
                              {evt.minute}'
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                                evt.type === 'goal'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : evt.type === 'shot' || evt.type === 'chance'
                                  ? 'bg-amber-400/20 text-amber-300'
                                  : evt.type === 'yellow_card'
                                  ? 'bg-yellow-400/20 text-yellow-300'
                                  : evt.type === 'red_card'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : 'bg-[#191C1C] text-[#8B918E]'
                              }`}
                            >
                              {evt.type}
                            </span>
                            <span className="text-[#8B918E]">[{teamShort}]</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {isUserPlayer && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#B7FF3C]/20 text-[#B7FF3C] font-bold uppercase border border-[#B7FF3C]/30">
                                SEU ATLETA
                              </span>
                            )}
                            <span
                              className={`text-[9px] font-mono uppercase px-1 rounded ${
                                evt.importance === 'critical'
                                  ? 'text-rose-400 font-bold'
                                  : evt.importance === 'high'
                                  ? 'text-amber-400'
                                  : 'text-[#555C59]'
                              }`}
                            >
                              {evt.importance}
                            </span>
                          </div>
                        </div>

                        <p className="text-[#D8DDD9] text-xs leading-relaxed font-sans pl-1">
                          {evt.description}
                        </p>
                      </div>
                    );
                  })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
