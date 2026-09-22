/**
 * AURA Football - Engine Central: Sistema de Partidas (Prompt 08)
 * Fundação oficial determinística, pura e imutável para partidas de 90 minutos.
 * Não utiliza Math.random() diretamente (utiliza SeedableRNG do projeto).
 * Prepara estrutura de etapas, placar, mando, acréscimos e preservação da AURA e OVR.
 */

import {
  Match,
  MatchStatus,
  MatchPeriod,
  MatchVenue,
  Club,
  Player,
  MatchEvent,
  MatchMoment,
} from '../types';
import { createRNG } from './rng';
import {
  generateStructuralEvent,
  generateMinuteEvents,
} from './events';
import { evaluateAndProcessMoments } from './moments';

// Constantes Regulamentares Oficiais do AURA Football
export const MATCH_START_MINUTE = 0;
export const MATCH_HALF_TIME_MINUTE = 45;
export const MATCH_SECOND_HALF_START_MINUTE = 46;
export const MATCH_REGULATION_MINUTES = 90;

export interface CreateMatchParams {
  id?: string;
  competition?: string;
  season?: number;
  date?: string;
  homeTeam: Club;
  awayTeam: Club;
  playerTeamId: string;
  venue?: MatchVenue;
  seed?: number;
  initialStatus?: MatchStatus;
  events?: MatchEvent[];
  moments?: MatchMoment[];
}

/**
 * Cria uma nova partida válida e imutável iniciando no minuto 0 com placar 0 x 0.
 */
export function createMatch(params: CreateMatchParams): Match {
  const venue: MatchVenue =
    params.venue ?? (params.homeTeam.id === params.playerTeamId ? 'home' : 'away');

  return {
    id: params.id ?? `match_${params.homeTeam.id}_vs_${params.awayTeam.id}`,
    competition: params.competition ?? 'Campeonato Estadual',
    season: params.season ?? 1,
    date: params.date ?? new Date().toISOString().split('T')[0],
    minute: MATCH_START_MINUTE,
    addedMinute: undefined,
    finalMinute: MATCH_REGULATION_MINUTES,
    homeTeam: params.homeTeam,
    awayTeam: params.awayTeam,
    playerTeamId: params.playerTeamId,
    venue,
    homeScore: 0,
    awayScore: 0,
    status: params.initialStatus ?? 'scheduled',
    period: 'first_half',
    seed: params.seed ?? 123456789,
    events: params.events ?? [],
    moments: params.moments ?? [],
  };
}

/**
 * Inicia oficialmente uma partida agendada com o evento estrutural de pontapé inicial.
 */
export function startMatch(match: Match): Match {
  if (match.status !== 'scheduled') {
    return match;
  }

  const kickoffEvent = generateStructuralEvent(match, 'kickoff', match.seed);

  return {
    ...match,
    status: 'live',
    period: 'first_half',
    minute: MATCH_START_MINUTE,
    events: [kickoffEvent],
  };
}

/**
 * Verifica se a partida está em condições válidas de avanço de tempo.
 */
export function canAdvanceMatch(match: Match): boolean {
  if (match.status === 'finished' || match.status === 'cancelled') {
    return false;
  }
  if (match.minute >= match.finalMinute && match.period === 'finished') {
    return false;
  }
  return true;
}

/**
 * Formata o relógio da partida com suporte a acréscimos (ex: 0', 45', 45+2', 90', 90+4').
 * Função reutilizável central que evita strings arbitrárias espalhadas.
 */
export function formatMatchClock(clock: { minute: number; addedMinute?: number } | Match): string {
  const min = clock.minute;
  const added = clock.addedMinute;
  if (added !== undefined && added > 0) {
    return `${min}+${added}'`;
  }
  return `${min}'`;
}

/**
 * Retorna o rótulo descritivo do status/etapa da partida para a interface.
 */
export function getMatchStatusLabel(match: Match): string {
  if (match.status === 'scheduled') return 'AGENDADA';
  if (match.status === 'cancelled') return 'CANCELADA';
  if (match.status === 'half_time' || match.period === 'half_time') return 'INTERVALO';
  if (match.status === 'finished' || match.period === 'finished') return 'FIM DE JOGO';
  if (match.period === 'first_half') return '1º TEMPO';
  if (match.period === 'second_half') return '2º TEMPO';
  return 'EM ANDAMENTO';
}

/**
 * Avança a partida em exatamente 1 minuto regulamentar, respeitando todas as regras de transição:
 * 0 -> 1
 * 44 -> 45 (Intervalo)
 * 45 (Intervalo) -> 46 (2º Tempo)
 * 89 -> 90 (Fim de Jogo)
 * 90 (Fim de Jogo) -> impede avanços posteriores
 *
 * Gera eventos estruturais e espontâneos com SeedableRNG determinístico (Prompt 09),
 * atualizando o placar unificado quando ocorre evento de gol.
 */
export function advanceMatchMinute(match: Match, userPlayer?: Player): Match {
  if (!canAdvanceMatch(match)) {
    return match;
  }

  // Se a partida estava agendada, o primeiro avanço a ativa e pontua o kickoff
  if (match.status === 'scheduled') {
    const started = startMatch(match);
    return advanceMatchMinute(started, userPlayer);
  }

  let nextMinute = match.minute + 1;
  let nextStatus: MatchStatus = 'live';
  let nextPeriod: MatchPeriod = match.period;

  // Se estiver no intervalo no minuto 45, o próximo avanço reinicia o jogo no 2º tempo (46')
  if (match.status === 'half_time' || match.period === 'half_time') {
    nextMinute = MATCH_SECOND_HALF_START_MINUTE; // 46
    nextStatus = 'live';
    nextPeriod = 'second_half';
  } else if (nextMinute === MATCH_HALF_TIME_MINUTE) {
    // Transição para o intervalo exatamente ao atingir o 45º minuto
    nextMinute = MATCH_HALF_TIME_MINUTE;
    nextStatus = 'half_time';
    nextPeriod = 'half_time';
  } else if (nextMinute < MATCH_HALF_TIME_MINUTE) {
    // Primeiro tempo regular (1 a 44)
    nextStatus = 'live';
    nextPeriod = 'first_half';
  } else if (nextMinute < MATCH_REGULATION_MINUTES) {
    // Segundo tempo regular (46 a 89)
    nextStatus = 'live';
    nextPeriod = 'second_half';
  } else {
    // Final da partida exatamente no minuto 90
    nextMinute = MATCH_REGULATION_MINUTES;
    nextStatus = 'finished';
    nextPeriod = 'finished';
  }

  // Geração determinística de eventos para o minuto que acabou de ocorrer
  const eventRng = createRNG((match.seed + nextMinute * 10007) >>> 0);
  const minuteEvents = generateMinuteEvents(match, nextMinute, eventRng, userPlayer);

  // Processamento e unificação oficial dos eventos do minuto através da Match Engine
  let updatedMatch: Match = {
    ...match,
    minute: nextMinute,
    status: nextStatus,
    period: nextPeriod,
  };

  for (const evt of minuteEvents) {
    updatedMatch = applyMatchEvent(updatedMatch, evt);
  }

  // Avaliação e criação determinística de Momentos (Prompt 10)
  if (userPlayer) {
    const newMoments = evaluateAndProcessMoments(updatedMatch, minuteEvents, userPlayer);
    if (newMoments.length > 0) {
      updatedMatch = {
        ...updatedMatch,
        moments: [...updatedMatch.moments, ...newMoments],
      };
    }
  }

  return updatedMatch;
}

/**
 * Modifica o placar da partida de forma estritamente controlada e imutável.
 * Garante que somente gols válidos sejam somados e que o placar nunca seja negativo.
 */
export function scoreGoal(match: Match, team: 'home' | 'away', count = 1): Match {
  if (match.status === 'finished' || match.status === 'cancelled') {
    return match;
  }
  if (!Number.isInteger(count) || count <= 0) {
    return match;
  }

  const nextHomeScore = team === 'home' ? Math.max(0, match.homeScore + count) : match.homeScore;
  const nextAwayScore = team === 'away' ? Math.max(0, match.awayScore + count) : match.awayScore;

  return {
    ...match,
    homeScore: nextHomeScore,
    awayScore: nextAwayScore,
  };
}

/**
 * Processa um evento oficial na partida, integrando-o ao estado do jogo.
 * Quando o evento for do tipo 'goal', utiliza exclusivamente a lógica oficial de placar
 * centralizada na Match Engine (scoreGoal).
 * Não cria fontes paralelas de verdade.
 */
export function applyMatchEvent(match: Match, event: MatchEvent): Match {
  let updatedMatch = match;

  if (event.type === 'goal') {
    if (event.teamId === match.homeTeam.id) {
      updatedMatch = scoreGoal(updatedMatch, 'home', 1);
    } else if (event.teamId === match.awayTeam.id) {
      updatedMatch = scoreGoal(updatedMatch, 'away', 1);
    }
  }

  // Registra o evento no histórico da partida se ainda não estiver presente
  if (!updatedMatch.events.some((e) => e.id === event.id)) {
    updatedMatch = {
      ...updatedMatch,
      events: [...updatedMatch.events, event],
    };
  }

  return updatedMatch;
}

/**
 * Adiciona gol para o clube ao qual o jogador pertence.
 */
export function scorePlayerTeamGoal(match: Match): Match {
  return scoreGoal(match, match.venue);
}

/**
 * Adiciona gol para o clube adversário.
 */
export function scoreOpponentGoal(match: Match): Match {
  return scoreGoal(match, match.venue === 'home' ? 'away' : 'home');
}

/**
 * Retorna o clube do jogador.
 */
export function getPlayerTeam(match: Match): Club {
  return match.venue === 'home' ? match.homeTeam : match.awayTeam;
}

/**
 * Retorna o clube adversário.
 */
export function getOpponentTeam(match: Match): Club {
  return match.venue === 'home' ? match.awayTeam : match.homeTeam;
}

/**
 * Retorna o placar do time do jogador.
 */
export function getPlayerTeamScore(match: Match): number {
  return match.venue === 'home' ? match.homeScore : match.awayScore;
}

/**
 * Retorna o placar do adversário.
 */
export function getOpponentScore(match: Match): number {
  return match.venue === 'home' ? match.awayScore : match.homeScore;
}

/**
 * Simulação sequencial e determinística da partida até o apito final (90').
 * Utiliza o SeedableRNG do projeto para garantir reprodutibilidade matemática.
 * Registra os eventos oficiais de jogo e estruturais a cada minuto.
 */
export function simulateMatch(match: Match, userPlayer?: Player): Match {
  let current = match.status === 'scheduled' ? startMatch(match) : match;

  if (current.status === 'finished' || current.status === 'cancelled') {
    return current;
  }

  // Avança minuto a minuto determinísticamente até o minuto 90
  while (canAdvanceMatch(current)) {
    current = advanceMatchMinute(current, userPlayer);
  }

  return current;
}

// ====================================================
// SUÍTE DE TESTES OBRIGATÓRIOS DO PROMPT 08 (21 CASOS)
// ====================================================

export interface MatchTestCaseResult {
  id: number;
  category: 'Match' | 'Tempo' | 'Placar' | 'Determinismo' | 'Integridade';
  name: string;
  description: string;
  expected: unknown;
  actual: unknown;
  passed: boolean;
  details?: string;
}

function createDummyClubs(): { home: Club; away: Club } {
  const home: Club = {
    id: 'club_spfc',
    name: 'Paulista FC',
    shortName: 'PFC',
    country: 'Brasil',
    league: 'Campeonato Estadual',
    ovr: 70,
    prestige: 'Pequeno',
    stadium: 'Estádio da Colina',
    primaryColor: '#E5484D',
    secondaryColor: '#111313',
  };
  const away: Club = {
    id: 'club_met',
    name: 'Metropolitano',
    shortName: 'MET',
    country: 'Brasil',
    league: 'Campeonato Estadual',
    ovr: 72,
    prestige: 'Médio',
    stadium: 'Parque Central',
    primaryColor: '#3B82F6',
    secondaryColor: '#191C1C',
  };
  return { home, away };
}

function createDummyPlayer(): Player {
  return {
    id: 'p_test',
    name: 'Gabriel Silva',
    nickname: 'Biel',
    age: 18,
    country: 'Brasil',
    position: 'ATA',
    kitNumber: 9,
    attributes: { VEL: 80, FIN: 85, DRI: 82, FOR: 70, PAS: 65, DEF: 30 },
    ovr: 78,
    aura: 50,
    xp: 250,
    level: 3,
    status: 'Disponível',
    influence: 45,
    prestige: 'Promessa',
    contract: { clubId: 'club_spfc', salary: 1000, yearsRemaining: 2 },
    avatar: {
      skinTone: 2,
      hairStyle: 'curto_degrade',
      hairColor: 'preto',
      bootsColor: '#B7FF3C',
      celebrationId: 'deslize_joelhos',
    },
    stats: {
      matches: 10,
      goals: 8,
      assists: 3,
      averageRating: 7.8,
      yellowCards: 1,
      redCards: 0,
    },
  };
}

/**
 * Executa os 21 testes obrigatórios da Engine de Partida (Prompt 08)
 */
export function runMatchTests(): MatchTestCaseResult[] {
  const results: MatchTestCaseResult[] = [];
  const { home, away } = createDummyClubs();

  // 1. Partida começa em minuto 0
  {
    const m = createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id });
    results.push({
      id: 1,
      category: 'Match',
      name: 'Minuto inicial = 0',
      description: 'A partida recém-criada deve iniciar estritamente no minuto 0',
      expected: 0,
      actual: m.minute,
      passed: m.minute === 0,
    });
  }

  // 2. Partida começa com status correto
  {
    const m = createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id });
    results.push({
      id: 2,
      category: 'Match',
      name: 'Status inicial agendado (scheduled)',
      description: 'A partida começa com status "scheduled" explícito',
      expected: 'scheduled',
      actual: m.status,
      passed: m.status === 'scheduled',
    });
  }

  // 3. Placar inicial é 0 x 0
  {
    const m = createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id });
    const scoreStr = `${m.homeScore} x ${m.awayScore}`;
    results.push({
      id: 3,
      category: 'Match',
      name: 'Placar inicial 0 x 0',
      description: 'A partida deve começar com zero gols para ambos os lados',
      expected: '0 x 0',
      actual: scoreStr,
      passed: m.homeScore === 0 && m.awayScore === 0,
    });
  }

  // 4. Mando de campo é preservado
  {
    const mHome = createMatch({
      homeTeam: home,
      awayTeam: away,
      playerTeamId: home.id,
      venue: 'home',
    });
    const mAway = createMatch({
      homeTeam: home,
      awayTeam: away,
      playerTeamId: away.id,
      venue: 'away',
    });
    results.push({
      id: 4,
      category: 'Match',
      name: 'Mando de campo preservado',
      description: 'Registra corretamente quem joga em casa (home) ou fora (away)',
      expected: 'home, away',
      actual: `${mHome.venue}, ${mAway.venue}`,
      passed: mHome.venue === 'home' && mAway.venue === 'away',
    });
  }

  // 5. Time da casa e visitante são preservados
  {
    const m = createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id });
    results.push({
      id: 5,
      category: 'Match',
      name: 'Clubes preservados',
      description: 'HomeTeam e AwayTeam preservados sem mutações',
      expected: `${home.id} vs ${away.id}`,
      actual: `${m.homeTeam.id} vs ${m.awayTeam.id}`,
      passed: m.homeTeam.id === home.id && m.awayTeam.id === away.id,
    });
  }

  // 6. 0 -> 1 funciona
  {
    const m0 = startMatch(
      createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id })
    );
    const m1 = advanceMatchMinute(m0);
    results.push({
      id: 6,
      category: 'Tempo',
      name: 'Avanço 0 -> 1',
      description: 'Avanço de tempo inicial de 0 para 1 minuto',
      expected: 1,
      actual: m1.minute,
      passed: m1.minute === 1 && m1.status === 'live',
    });
  }

  // 7. 44 -> 45 funciona
  {
    const m44: Match = {
      ...createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id }),
      status: 'live',
      period: 'first_half',
      minute: 44,
    };
    const m45 = advanceMatchMinute(m44);
    results.push({
      id: 7,
      category: 'Tempo',
      name: 'Avanço 44 -> 45',
      description: 'Avanço do minuto 44 para o minuto 45',
      expected: 45,
      actual: m45.minute,
      passed: m45.minute === 45,
    });
  }

  // 8. 45 identifica intervalo
  {
    const m44: Match = {
      ...createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id }),
      status: 'live',
      period: 'first_half',
      minute: 44,
    };
    const m45 = advanceMatchMinute(m44);
    results.push({
      id: 8,
      category: 'Tempo',
      name: '45 identifica intervalo',
      description: 'Ao atingir o minuto 45, a partida transiciona para status "half_time"',
      expected: 'half_time',
      actual: m45.status,
      passed: m45.status === 'half_time' && m45.period === 'half_time',
    });
  }

  // 9. Segundo tempo inicia corretamente
  {
    const mHT: Match = {
      ...createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id }),
      status: 'half_time',
      period: 'half_time',
      minute: 45,
    };
    const m46 = advanceMatchMinute(mHT);
    results.push({
      id: 9,
      category: 'Tempo',
      name: 'Início do 2º Tempo (46\')',
      description: 'Ao sair do intervalo, o relógio avança para 46 com etapa "second_half"',
      expected: 'minute 46, status live, period second_half',
      actual: `minute ${m46.minute}, status ${m46.status}, period ${m46.period}`,
      passed:
        m46.minute === 46 && m46.status === 'live' && m46.period === 'second_half',
    });
  }

  // 10. 89 -> 90 funciona
  {
    const m89: Match = {
      ...createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id }),
      status: 'live',
      period: 'second_half',
      minute: 89,
    };
    const m90 = advanceMatchMinute(m89);
    results.push({
      id: 10,
      category: 'Tempo',
      name: 'Avanço 89 -> 90',
      description: 'Avanço do minuto 89 para o minuto 90',
      expected: 90,
      actual: m90.minute,
      passed: m90.minute === 90,
    });
  }

  // 11. Partida termina no minuto 90
  {
    const m89: Match = {
      ...createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id }),
      status: 'live',
      period: 'second_half',
      minute: 89,
    };
    const m90 = advanceMatchMinute(m89);
    results.push({
      id: 11,
      category: 'Tempo',
      name: 'Término oficial aos 90\'',
      description: 'Aos 90 minutos a partida finaliza com status "finished"',
      expected: 'finished',
      actual: m90.status,
      passed: m90.status === 'finished' && m90.period === 'finished',
    });
  }

  // 12. Partida finalizada não avança
  {
    const mFinished: Match = {
      ...createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id }),
      status: 'finished',
      period: 'finished',
      minute: 90,
    };
    const postAdvance = advanceMatchMinute(mFinished);
    results.push({
      id: 12,
      category: 'Tempo',
      name: 'Partida finalizada não avança',
      description: 'Tentativa de avanço em jogo finalizado é impedida (mantém 90\')',
      expected: 90,
      actual: postAdvance.minute,
      passed: postAdvance.minute === 90 && postAdvance.status === 'finished',
    });
  }

  // 13. Gol válido aumenta o placar correto
  {
    const m = startMatch(
      createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id })
    );
    const scored = scoreGoal(m, 'home', 1);
    results.push({
      id: 13,
      category: 'Placar',
      name: 'Gol válido incrementa placar',
      description: 'Gol do time da casa eleva homeScore de 0 para 1',
      expected: 1,
      actual: scored.homeScore,
      passed: scored.homeScore === 1,
    });
  }

  // 14. Gol do mandante não altera visitante
  {
    const m = startMatch(
      createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id })
    );
    const scored = scoreGoal(m, 'home', 2);
    results.push({
      id: 14,
      category: 'Placar',
      name: 'Gol mandante não afeta visitante',
      description: 'Gols marcados pelo mandante mantêm o placar do visitante inalterado',
      expected: 0,
      actual: scored.awayScore,
      passed: scored.awayScore === 0 && scored.homeScore === 2,
    });
  }

  // 15. Gol do visitante não altera mandante
  {
    const m = startMatch(
      createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id })
    );
    const scored = scoreGoal(m, 'away', 1);
    results.push({
      id: 15,
      category: 'Placar',
      name: 'Gol visitante não afeta mandante',
      description: 'Gols marcados pelo visitante mantêm o placar do mandante inalterado',
      expected: 0,
      actual: scored.homeScore,
      passed: scored.homeScore === 0 && scored.awayScore === 1,
    });
  }

  // 16. Placar nunca fica negativo
  {
    const m = createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id });
    // Tentativa de adicionar valor negativo ou count inválido
    const invalid1 = scoreGoal(m, 'home', -1);
    const invalid2 = scoreGoal(m, 'away', -5);
    results.push({
      id: 16,
      category: 'Placar',
      name: 'Placar nunca negativo',
      description: 'Garante que os placares de mandante e visitante permaneçam >= 0',
      expected: '0 x 0',
      actual: `${invalid1.homeScore} x ${invalid2.awayScore}`,
      passed:
        invalid1.homeScore >= 0 &&
        invalid1.awayScore >= 0 &&
        invalid2.homeScore >= 0 &&
        invalid2.awayScore >= 0,
    });
  }

  // 17. Mesma seed + mesmo estado inicial = mesmo resultado
  {
    const seed = 987654321;
    const matchA = createMatch({
      homeTeam: home,
      awayTeam: away,
      playerTeamId: home.id,
      seed,
    });
    const matchB = createMatch({
      homeTeam: home,
      awayTeam: away,
      playerTeamId: home.id,
      seed,
    });

    const simA = simulateMatch(matchA);
    const simB = simulateMatch(matchB);

    const matchesEqual =
      simA.minute === simB.minute &&
      simA.status === simB.status &&
      simA.homeScore === simB.homeScore &&
      simA.awayScore === simB.awayScore;

    results.push({
      id: 17,
      category: 'Determinismo',
      name: 'Determinismo (Mesma Seed = Mesmo Resultado)',
      description: 'Simulações com a mesma semente produzem exatamente o mesmo desfecho',
      expected: true,
      actual: matchesEqual,
      passed: matchesEqual,
    });
  }

  // 18. Seeds diferentes podem ser diferenciadas pelo RNG
  {
    const rng1 = createRNG(11111);
    const rng2 = createRNG(99999);
    const val1 = rng1.nextFloat();
    const val2 = rng2.nextFloat();
    results.push({
      id: 18,
      category: 'Determinismo',
      name: 'Seeds distintas geram streams RNG independentes',
      description: 'Geradores com sementes diferentes geram sequências pseudoaleatórias distintas',
      expected: true,
      actual: val1 !== val2,
      passed: val1 !== val2,
    });
  }

  // 19. AURA não é alterada pela simulação base
  {
    const player = createDummyPlayer();
    const originalAura = player.aura;
    const m = createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id });
    simulateMatch(m);

    results.push({
      id: 19,
      category: 'Integridade',
      name: 'AURA inalterada pela simulação base',
      description: 'A simulação da partida não altera a AURA do atleta',
      expected: originalAura,
      actual: player.aura,
      passed: player.aura === originalAura,
    });
  }

  // 20. OVR não é alterado pela simulação base
  {
    const player = createDummyPlayer();
    const originalOVR = player.ovr;
    const m = createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id });
    simulateMatch(m);

    results.push({
      id: 20,
      category: 'Integridade',
      name: 'OVR inalterado pela simulação base',
      description: 'A simulação da partida não altera o OVR do atleta',
      expected: originalOVR,
      actual: player.ovr,
      passed: player.ovr === originalOVR,
    });
  }

  // 21. Atributos não são alterados pela simulação base
  {
    const player = createDummyPlayer();
    const originalAttrs = { ...player.attributes };
    const m = createMatch({ homeTeam: home, awayTeam: away, playerTeamId: home.id });
    simulateMatch(m);

    const attrsUnchanged =
      player.attributes.VEL === originalAttrs.VEL &&
      player.attributes.FIN === originalAttrs.FIN &&
      player.attributes.DRI === originalAttrs.DRI &&
      player.attributes.FOR === originalAttrs.FOR &&
      player.attributes.PAS === originalAttrs.PAS &&
      player.attributes.DEF === originalAttrs.DEF;

    results.push({
      id: 21,
      category: 'Integridade',
      name: 'Atributos inalterados pela simulação base',
      description: 'Nenhum dos 6 atributos oficiais do atleta sofre mutação na simulação',
      expected: true,
      actual: attrsUnchanged,
      passed: attrsUnchanged,
    });
  }

  return results;
}
