/**
 * AURA Football - Engine de Eventos da Partida (Prompt 09)
 * Camada intermediária que gera e registra os acontecimentos da simulação.
 * Totalmente determinística via SeedableRNG, sem Math.random().
 * Diferenciação estrita: EVENTO ≠ MOMENTO.
 * Preserva integralmente AURA, OVR, atributos, XP e influência.
 */

import {
  Match,
  MatchEvent,
  MatchEventType,
  MatchEventImportance,
  Club,
  Player,
} from '../types';
import { SeedableRNG, createRNG } from './rng';
import { applyMatchEvent } from './match';

/**
 * Mapeia importância padrão e relevância futura de cada tipo de evento.
 */
export function getEventMetadata(type: MatchEventType): {
  importance: MatchEventImportance;
  isSignificant: boolean;
} {
  switch (type) {
    case 'goal':
    case 'red_card':
      return { importance: 'critical', isSignificant: true };
    case 'chance':
    case 'shot':
      return { importance: 'high', isSignificant: true };
    case 'save':
    case 'yellow_card':
    case 'corner':
      return { importance: 'normal', isSignificant: false };
    case 'foul':
    case 'substitution':
    case 'injury':
    case 'kickoff':
    case 'half_time':
    case 'full_time':
    default:
      return { importance: 'low', isSignificant: false };
  }
}

/**
 * Gera a narrativa oficial de um evento futebolístico de forma padronizada.
 */
export function generateEventDescription(params: {
  type: MatchEventType;
  team: Club;
  opponentTeam?: Club;
  player?: Player | { name: string; nickname?: string };
  isSecondHalf?: boolean;
}): string {
  const { type, team, player, isSecondHalf } = params;
  const teamName = team.name;
  const playerName = player ? (player.nickname || player.name) : undefined;

  switch (type) {
    case 'kickoff':
      return isSecondHalf ? 'Início do segundo tempo.' : 'Início da partida.';
    case 'half_time':
      return 'Intervalo.';
    case 'full_time':
      return 'Fim de jogo.';
    case 'goal':
      return playerName
        ? `GOL! ${playerName} balança as redes para o ${teamName}!`
        : `GOL do ${teamName}! Bola no fundo da rede.`;
    case 'chance':
      return playerName
        ? `Grande chance de perigo criada por ${playerName} para o ${teamName}!`
        : `Jogada de perigo criada pelo ataque do ${teamName}.`;
    case 'shot':
      return playerName
        ? `Finalização perigosa de ${playerName} (${teamName})!`
        : `Finalização com muito perigo da equipe do ${teamName}.`;
    case 'save':
      return `Defesa espetacular do goleiro do ${teamName}, impedindo o gol.`;
    case 'corner':
      return `Escanteio a favor do ${teamName}.`;
    case 'foul':
      return `Falta tática assinalada contra o ${teamName}.`;
    case 'yellow_card':
      return playerName
        ? `Cartão amarelo para ${playerName} (${teamName}).`
        : `Cartão amarelo aplicado à equipe do ${teamName}.`;
    case 'red_card':
      return playerName
        ? `Cartão vermelho direto para ${playerName}! ${teamName} fica com um a menos.`
        : `Cartão vermelho direto para o ${teamName}!`;
    case 'injury':
      return `Atendimento médico solicitado no gramado para jogador do ${teamName}.`;
    case 'substitution':
      return `Alteração tática realizada na equipe do ${teamName}.`;
    default:
      return `Acontecimento de jogo envolvendo o ${teamName}.`;
  }
}

/**
 * Fábrica oficial de eventos para a partida.
 */
export function createMatchEvent(params: {
  id?: string;
  matchId: string;
  minute: number;
  addedMinute?: number;
  type: MatchEventType;
  teamId: string;
  playerId?: string;
  description?: string;
  importance?: MatchEventImportance;
  isSignificant?: boolean;
  seed: number;
  team?: Club;
  player?: Player | { name: string; nickname?: string };
  isSecondHalf?: boolean;
}): MatchEvent {
  const meta = getEventMetadata(params.type);
  const importance = params.importance ?? meta.importance;
  const isSignificant = params.isSignificant ?? meta.isSignificant;

  let description = params.description;
  if (!description && params.team) {
    description = generateEventDescription({
      type: params.type,
      team: params.team,
      player: params.player,
      isSecondHalf: params.isSecondHalf,
    });
  } else if (!description) {
    description = `Evento ${params.type} aos ${params.minute}'`;
  }

  return {
    id: params.id ?? `evt_${params.matchId}_${params.minute}_${params.seed}`,
    matchId: params.matchId,
    minute: params.minute,
    addedMinute: params.addedMinute,
    type: params.type,
    teamId: params.teamId,
    playerId: params.playerId,
    description,
    importance,
    isSignificant,
    seed: params.seed,
  };
}

/**
 * Identifica se um evento envolve especificamente o jogador controlado pelo usuário.
 */
export function isUserPlayerEvent(event: MatchEvent, userPlayerId?: string): boolean {
  if (!userPlayerId || !event.playerId) {
    return false;
  }
  return event.playerId === userPlayerId;
}

/**
 * Gera os eventos estruturais obrigatórios da partida:
 * 0' -> kickoff ("Início da partida.")
 * 45' -> half_time ("Intervalo.")
 * 46' -> kickoff ("Início do segundo tempo.")
 * 90' -> full_time ("Fim de jogo.")
 */
export function generateStructuralEvent(
  match: Match,
  kind: 'kickoff' | 'half_time' | 'second_half' | 'full_time',
  seed: number
): MatchEvent {
  switch (kind) {
    case 'kickoff':
      return createMatchEvent({
        matchId: match.id,
        minute: 0,
        type: 'kickoff',
        teamId: match.homeTeam.id,
        team: match.homeTeam,
        description: 'Início da partida.',
        seed,
      });
    case 'half_time':
      return createMatchEvent({
        matchId: match.id,
        minute: 45,
        type: 'half_time',
        teamId: match.homeTeam.id,
        team: match.homeTeam,
        description: 'Intervalo.',
        seed,
      });
    case 'second_half':
      return createMatchEvent({
        matchId: match.id,
        minute: 46,
        type: 'kickoff',
        teamId: match.awayTeam.id,
        team: match.awayTeam,
        description: 'Início do segundo tempo.',
        isSecondHalf: true,
        seed,
      });
    case 'full_time':
      return createMatchEvent({
        matchId: match.id,
        minute: 90,
        type: 'full_time',
        teamId: match.homeTeam.id,
        team: match.homeTeam,
        description: 'Fim de jogo.',
        seed,
      });
  }
}

/**
 * Gera eventos espontâneos controlados para um minuto da partida.
 * Utiliza o SeedableRNG de forma puramente determinística.
 * Não gera eventos em todos os minutos (taxa de ~28% por minuto para cadência realista).
 */
export function generateMinuteEvents(
  match: Match,
  minute: number,
  rng: SeedableRNG,
  userPlayer?: Player
): MatchEvent[] {
  // Minuto 0: Pontapé inicial estrutural
  if (minute === 0) {
    return [generateStructuralEvent(match, 'kickoff', rng.getSeed())];
  }

  // Minuto 45: Intervalo estrutural
  if (minute === 45) {
    return [generateStructuralEvent(match, 'half_time', rng.getSeed())];
  }

  // Minuto 46: Reinício no segundo tempo
  if (minute === 46) {
    return [generateStructuralEvent(match, 'second_half', rng.getSeed())];
  }

  // Minuto 90: Apito final estrutural
  if (minute === 90) {
    return [generateStructuralEvent(match, 'full_time', rng.getSeed())];
  }

  // Para os demais minutos regulamentares (1..44, 47..89):
  // Frequência controlada de acontecimentos (~28% de chance por minuto)
  const hasEvent = rng.chance(28);
  if (!hasEvent) {
    return [];
  }

  // Determinação determinística da equipe envolvida (balanceada por OVR)
  const homeAdvantage = 0.5 + (match.homeTeam.ovr - match.awayTeam.ovr) * 0.005;
  const clampedAdvantage = Math.min(0.8, Math.max(0.2, homeAdvantage));
  const isHome = rng.nextFloat() < clampedAdvantage;
  const activeTeam = isHome ? match.homeTeam : match.awayTeam;

  // Distribuição controlada dos tipos de evento espontâneos
  const roll = rng.nextFloat() * 100;
  let type: MatchEventType = 'chance';

  if (roll < 30) {
    type = 'chance';
  } else if (roll < 55) {
    type = 'shot';
  } else if (roll < 72) {
    type = 'corner';
  } else if (roll < 84) {
    type = 'foul';
  } else if (roll < 91) {
    type = 'save';
  } else if (roll < 95) {
    type = 'yellow_card';
  } else {
    type = 'goal';
  }

  // Associação opcional ao jogador do usuário se a equipe ativa for a dele
  let actorPlayer: Player | undefined = undefined;
  if (userPlayer && activeTeam.id === match.playerTeamId) {
    // 40% de chance de protagonismo do jogador em chances/finalizações/gols
    const isPlayerInvolved =
      (type === 'shot' || type === 'chance' || type === 'goal') && rng.chance(40);
    if (isPlayerInvolved) {
      actorPlayer = userPlayer;
    }
  }

  const evt = createMatchEvent({
    matchId: match.id,
    minute,
    type,
    teamId: activeTeam.id,
    playerId: actorPlayer?.id,
    team: activeTeam,
    player: actorPlayer,
    seed: rng.getSeed(),
  });

  return [evt];
}

/**
 * Ordena eventos rigorosamente por minuto em ordem cronológica estável.
 */
export function sortEventsChronologically(events: MatchEvent[]): MatchEvent[] {
  return [...events].sort((a, b) => {
    if (a.minute !== b.minute) {
      return a.minute - b.minute;
    }
    // Ordem estável determinística para eventos ocorridos no mesmo minuto
    return a.seed - b.seed;
  });
}

// ====================================================
// SUÍTE OFICIAL DE TESTES DO PROMPT 09 (27 CASOS)
// ====================================================

export interface EventTestCaseResult {
  id: number;
  category: 'Tipagem' | 'Estrutural' | 'Jogo' | 'Determinismo' | 'Placar' | 'Integridade' | 'Ordem';
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
 * Executa os 27 testes obrigatórios da Engine de Eventos (Prompt 09)
 */
export function runEventTests(): EventTestCaseResult[] {
  const results: EventTestCaseResult[] = [];
  const { home, away } = createDummyClubs();
  const player = createDummyPlayer();

  // Partida base de teste
  const baseMatch: Match = {
    id: 'match_test_01',
    competition: 'Campeonato Estadual',
    season: 1,
    date: '2026-05-10',
    minute: 0,
    finalMinute: 90,
    homeTeam: home,
    awayTeam: away,
    playerTeamId: home.id,
    venue: 'home',
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    period: 'first_half',
    seed: 42091,
    events: [],
  };

  // Simulação completa de 90 minutos para inspeção de eventos
  const simulateTestMatch = (seed: number, p?: Player): Match => {
    let m: Match = { ...baseMatch, seed, events: [] };
    const kickoff = generateStructuralEvent(m, 'kickoff', seed);
    m = { ...m, status: 'live', events: [kickoff] };

    for (let min = 1; min <= 90; min++) {
      let nextStatus = m.status;
      let nextPeriod = m.period;

      if (min === 45) {
        nextStatus = 'half_time';
        nextPeriod = 'half_time';
      } else if (min === 46) {
        nextStatus = 'live';
        nextPeriod = 'second_half';
      } else if (min === 90) {
        nextStatus = 'finished';
        nextPeriod = 'finished';
      }

      const rng = createRNG((seed + min * 10007) >>> 0);
      const minEvents = generateMinuteEvents(m, min, rng, p);

      m = {
        ...m,
        minute: min,
        status: nextStatus,
        period: nextPeriod,
      };

      for (const e of minEvents) {
        m = applyMatchEvent(m, e);
      }
    }
    return m;
  };

  const simMatch = simulateTestMatch(42091, player);
  const allEvents = simMatch.events;

  // 1. evento possui tipo válido
  {
    const validTypes: MatchEventType[] = [
      'kickoff',
      'chance',
      'shot',
      'goal',
      'save',
      'corner',
      'foul',
      'yellow_card',
      'red_card',
      'injury',
      'substitution',
      'half_time',
      'full_time',
    ];
    const allValid = allEvents.length > 0 && allEvents.every((e) => validTypes.includes(e.type));
    results.push({
      id: 1,
      category: 'Tipagem',
      name: 'Tipo de evento válido',
      description: 'Todos os eventos gerados possuem tipo catalogado no MatchEventType oficial',
      expected: true,
      actual: allValid,
      passed: allValid,
    });
  }

  // 2. evento possui minuto válido
  {
    const allMinutesValid =
      allEvents.length > 0 && allEvents.every((e) => e.minute >= 0 && e.minute <= 90);
    results.push({
      id: 2,
      category: 'Tipagem',
      name: 'Minuto válido',
      description: 'Todos os eventos ocorrem estritamente entre os minutos 0 e 90',
      expected: true,
      actual: allMinutesValid,
      passed: allMinutesValid,
    });
  }

  // 3. evento possui matchId
  {
    const allMatchIdValid =
      allEvents.length > 0 && allEvents.every((e) => e.matchId === baseMatch.id);
    results.push({
      id: 3,
      category: 'Tipagem',
      name: 'matchId presente',
      description: 'Todos os eventos contêm o ID da partida vinculada',
      expected: true,
      actual: allMatchIdValid,
      passed: allMatchIdValid,
    });
  }

  // 4. teamId pode ser identificado
  {
    const allTeamIdValid =
      allEvents.length > 0 &&
      allEvents.every((e) => e.teamId === home.id || e.teamId === away.id);
    results.push({
      id: 4,
      category: 'Tipagem',
      name: 'teamId identificável',
      description: 'Cada evento identifica o clube ao qual a ação pertence',
      expected: true,
      actual: allTeamIdValid,
      passed: allTeamIdValid,
    });
  }

  // 5. playerId pode ser opcional
  {
    const someWithPlayer = allEvents.some((e) => e.playerId !== undefined);
    const someWithoutPlayer = allEvents.some((e) => e.playerId === undefined);
    const optionalPassed = someWithPlayer && someWithoutPlayer;
    results.push({
      id: 5,
      category: 'Tipagem',
      name: 'playerId opcional',
      description: 'Eventos suportam tanto ações individuais (com playerId) quanto coletivas (sem playerId)',
      expected: true,
      actual: optionalPassed,
      passed: optionalPassed,
    });
  }

  // 6. kickoff ocorre no início
  {
    const firstEvent = allEvents[0];
    const passed = firstEvent && firstEvent.minute === 0 && firstEvent.type === 'kickoff';
    results.push({
      id: 6,
      category: 'Estrutural',
      name: 'Kickoff inicial aos 0\'',
      description: 'A partida inicia com o evento oficial de pontapé inicial no minuto 0',
      expected: 'minute 0, type kickoff',
      actual: firstEvent ? `minute ${firstEvent.minute}, type ${firstEvent.type}` : 'nenhum',
      passed: Boolean(passed),
    });
  }

  // 7. half_time ocorre aos 45'
  {
    const htEvent = allEvents.find((e) => e.minute === 45 && e.type === 'half_time');
    results.push({
      id: 7,
      category: 'Estrutural',
      name: 'Intervalo aos 45\'',
      description: 'O evento de intervalo ocorre exatamente aos 45 minutos',
      expected: 'type half_time aos 45\'',
      actual: htEvent ? `type ${htEvent.type} aos ${htEvent.minute}'` : 'não encontrado',
      passed: Boolean(htEvent),
    });
  }

  // 8. second_half ocorre aos 46'
  {
    const shEvent = allEvents.find(
      (e) => e.minute === 46 && e.description.includes('segundo tempo')
    );
    results.push({
      id: 8,
      category: 'Estrutural',
      name: 'Segundo tempo aos 46\'',
      description: 'O reinício da partida ocorre exatamente no minuto 46',
      expected: 'evento aos 46\' indicando segundo tempo',
      actual: shEvent ? `${shEvent.description} aos ${shEvent.minute}'` : 'não encontrado',
      passed: Boolean(shEvent),
    });
  }

  // 9. full_time ocorre aos 90'
  {
    const ftEvent = allEvents.find((e) => e.minute === 90 && e.type === 'full_time');
    results.push({
      id: 9,
      category: 'Estrutural',
      name: 'Fim de jogo aos 90\'',
      description: 'O evento de encerramento da partida ocorre exatamente aos 90 minutos',
      expected: 'type full_time aos 90\'',
      actual: ftEvent ? `type ${ftEvent.type} aos ${ftEvent.minute}'` : 'não encontrado',
      passed: Boolean(ftEvent),
    });
  }

  // 10. engine consegue gerar eventos espontâneos
  {
    const spontaneous = allEvents.filter(
      (e) => !['kickoff', 'half_time', 'full_time'].includes(e.type)
    );
    const passed = spontaneous.length >= 5; // Em 90 minutos com ~28% de chance gera múltiplos eventos
    results.push({
      id: 10,
      category: 'Jogo',
      name: 'Geração de eventos espontâneos',
      description: 'A simulação gera lances e acontecimentos dinâmicos ao longo dos 90 minutos',
      expected: '>= 5 eventos espontâneos',
      actual: `${spontaneous.length} eventos espontâneos gerados`,
      passed,
    });
  }

  // 11. eventos pertencem a um dos times válidos
  {
    const allBelong = allEvents.every(
      (e) => e.teamId === baseMatch.homeTeam.id || e.teamId === baseMatch.awayTeam.id
    );
    results.push({
      id: 11,
      category: 'Jogo',
      name: 'Clube dos eventos validado',
      description: 'Todo evento espontâneo referencia exclusivamente mandante ou visitante',
      expected: true,
      actual: allBelong,
      passed: allBelong,
    });
  }

  // 12. eventos possuem descrição
  {
    const allHaveDesc = allEvents.every(
      (e) => typeof e.description === 'string' && e.description.trim().length > 0
    );
    results.push({
      id: 12,
      category: 'Jogo',
      name: 'Descrição textual obrigatória',
      description: 'Cada evento gerado possui texto narrativo estruturado',
      expected: true,
      actual: allHaveDesc,
      passed: allHaveDesc,
    });
  }

  // 13. eventos possuem importância
  {
    const validImportances: MatchEventImportance[] = ['low', 'normal', 'high', 'critical'];
    const allHaveImportance = allEvents.every((e) => validImportances.includes(e.importance));
    results.push({
      id: 13,
      category: 'Jogo',
      name: 'Classificação de importância',
      description: 'Todo evento é classificado como low, normal, high ou critical',
      expected: true,
      actual: allHaveImportance,
      passed: allHaveImportance,
    });
  }

  // 14. eventos possuem minuto válido
  {
    const minutesOk = allEvents.every((e) => Number.isInteger(e.minute) && e.minute >= 0 && e.minute <= 90);
    results.push({
      id: 14,
      category: 'Jogo',
      name: 'Minutos inteiros e limitados',
      description: 'Os minutos de todos os eventos registrados são inteiros regulamentares',
      expected: true,
      actual: minutesOk,
      passed: minutesOk,
    });
  }

  // 15. mesma seed produz mesma sequência
  {
    const simA = simulateTestMatch(77777);
    const simB = simulateTestMatch(77777);
    const seqA = simA.events.map((e) => `${e.minute}:${e.type}:${e.teamId}`).join('|');
    const seqB = simB.events.map((e) => `${e.minute}:${e.type}:${e.teamId}`).join('|');
    const passed = seqA === seqB;
    results.push({
      id: 15,
      category: 'Determinismo',
      name: 'Determinismo de sequência de eventos',
      description: 'A mesma semente produz exatamente a mesma sequência de eventos minuto a minuto',
      expected: true,
      actual: passed,
      passed,
    });
  }

  // 16. mesma partida simulada duas vezes produz mesma sequência
  {
    const run1 = simulateTestMatch(88888, player);
    const run2 = simulateTestMatch(88888, player);
    const identical =
      run1.events.length === run2.events.length &&
      run1.homeScore === run2.homeScore &&
      run1.awayScore === run2.awayScore &&
      run1.events.every((e, i) => e.description === run2.events[i].description);
    results.push({
      id: 16,
      category: 'Determinismo',
      name: 'Reprodutibilidade completa da partida',
      description: 'Duas execuções completas com os mesmos parâmetros geram registros idênticos',
      expected: true,
      actual: identical,
      passed: identical,
    });
  }

  // 17. seed diferente pode produzir sequência diferente
  {
    const sim1 = simulateTestMatch(11111);
    const sim2 = simulateTestMatch(99999);
    const seq1 = sim1.events.map((e) => `${e.minute}:${e.type}`).join('|');
    const seq2 = sim2.events.map((e) => `${e.minute}:${e.type}`).join('|');
    const different = seq1 !== seq2;
    results.push({
      id: 17,
      category: 'Determinismo',
      name: 'Seeds distintas geram desfechos distintos',
      description: 'A engine não ignora a semente e produz acontecimentos variados para seeds diferentes',
      expected: true,
      actual: different,
      passed: different,
    });
  }

  // 18. gol atualiza o placar
  {
    const matchBefore: Match = {
      ...baseMatch,
      status: 'live',
      homeScore: 0,
      awayScore: 0,
    };
    const evtGoal = createMatchEvent({
      matchId: matchBefore.id,
      minute: 23,
      type: 'goal',
      teamId: home.id,
      team: home,
      seed: 123,
    });
    // Fluxo real: EVENTO GOAL -> ENGINE DA PARTIDA (applyMatchEvent -> scoreGoal) -> ATUALIZAÇÃO DO PLACAR
    const matchAfter = applyMatchEvent(matchBefore, evtGoal);
    const passed =
      matchAfter.homeScore === matchBefore.homeScore + 1 &&
      matchAfter.events.some((e) => e.id === evtGoal.id);
    results.push({
      id: 18,
      category: 'Placar',
      name: 'Gol atualiza o placar oficial',
      description: 'Evento de gol processado pela engine de partida atualiza o placar via scoreGoal',
      expected: matchBefore.homeScore + 1,
      actual: matchAfter.homeScore,
      passed,
    });
  }

  // 19. gol do mandante não altera visitante
  {
    const matchBefore: Match = {
      ...baseMatch,
      status: 'live',
      homeScore: 0,
      awayScore: 0,
    };
    const evtGoalHome = createMatchEvent({
      matchId: matchBefore.id,
      minute: 34,
      type: 'goal',
      teamId: home.id,
      team: home,
      seed: 124,
    });
    // Cenário real: processamento de evento de gol do mandante via Match Engine
    const matchAfter = applyMatchEvent(matchBefore, evtGoalHome);
    const passed =
      matchAfter.homeScore === matchBefore.homeScore + 1 &&
      matchAfter.awayScore === matchBefore.awayScore;
    results.push({
      id: 19,
      category: 'Placar',
      name: 'Gol do mandante preserva visitante',
      description: 'Evento de gol do mandante processado pela engine eleva homeScore e mantém awayScore estritamente igual',
      expected: { homeScore: matchBefore.homeScore + 1, awayScore: matchBefore.awayScore },
      actual: { homeScore: matchAfter.homeScore, awayScore: matchAfter.awayScore },
      passed,
    });
  }

  // 20. gol do visitante não altera mandante
  {
    const matchBefore: Match = {
      ...baseMatch,
      status: 'live',
      homeScore: 1,
      awayScore: 0,
    };
    const evtGoalAway = createMatchEvent({
      matchId: matchBefore.id,
      minute: 58,
      type: 'goal',
      teamId: away.id,
      team: away,
      seed: 125,
    });
    // Cenário real: processamento de evento de gol do visitante via Match Engine
    const matchAfter = applyMatchEvent(matchBefore, evtGoalAway);
    const passed =
      matchAfter.awayScore === matchBefore.awayScore + 1 &&
      matchAfter.homeScore === matchBefore.homeScore;
    results.push({
      id: 20,
      category: 'Placar',
      name: 'Gol do visitante preserva mandante',
      description: 'Evento de gol do visitante processado pela engine eleva awayScore e mantém homeScore estritamente igual',
      expected: { homeScore: matchBefore.homeScore, awayScore: matchBefore.awayScore + 1 },
      actual: { homeScore: matchAfter.homeScore, awayScore: matchAfter.awayScore },
      passed,
    });
  }

  // 21. eventos não alteram OVR
  {
    const origOVR = player.ovr;
    simulateTestMatch(42091, player);
    results.push({
      id: 21,
      category: 'Integridade',
      name: 'OVR do atleta inalterado',
      description: 'A geração e processamento de eventos não modifica o OVR do atleta',
      expected: origOVR,
      actual: player.ovr,
      passed: player.ovr === origOVR,
    });
  }

  // 22. eventos não alteram atributos
  {
    const origAttrs = { ...player.attributes };
    simulateTestMatch(42091, player);
    const unchanged =
      player.attributes.VEL === origAttrs.VEL &&
      player.attributes.FIN === origAttrs.FIN &&
      player.attributes.DRI === origAttrs.DRI &&
      player.attributes.FOR === origAttrs.FOR &&
      player.attributes.PAS === origAttrs.PAS &&
      player.attributes.DEF === origAttrs.DEF;
    results.push({
      id: 22,
      category: 'Integridade',
      name: 'Atributos inalterados por eventos',
      description: 'Nenhum dos 6 atributos oficiais sofre mutação durante os eventos da partida',
      expected: true,
      actual: unchanged,
      passed: unchanged,
    });
  }

  // 23. eventos não alteram AURA
  {
    const origAura = player.aura;
    simulateTestMatch(42091, player);
    results.push({
      id: 23,
      category: 'Integridade',
      name: 'AURA inalterada por eventos',
      description: 'Gols, faltas ou cartões não alteram a AURA automaticamente neste prompt',
      expected: origAura,
      actual: player.aura,
      passed: player.aura === origAura,
    });
  }

  // 24. eventos não alteram XP
  {
    const origXP = player.xp;
    simulateTestMatch(42091, player);
    results.push({
      id: 24,
      category: 'Integridade',
      name: 'XP inalterado por eventos',
      description: 'Eventos de jogo não adicionam nem subtraem XP do atleta',
      expected: origXP,
      actual: player.xp,
      passed: player.xp === origXP,
    });
  }

  // 25. eventos não alteram influência
  {
    const origInf = player.influence;
    simulateTestMatch(42091, player);
    results.push({
      id: 25,
      category: 'Integridade',
      name: 'Influência inalterada por eventos',
      description: 'Eventos de jogo não modificam a influência de vestiário do atleta',
      expected: origInf,
      actual: player.influence,
      passed: player.influence === origInf,
    });
  }

  // 26. eventos são cronológicos
  {
    let chronological = true;
    for (let i = 0; i < allEvents.length - 1; i++) {
      if (allEvents[i].minute > allEvents[i + 1].minute) {
        chronological = false;
        break;
      }
    }
    results.push({
      id: 26,
      category: 'Ordem',
      name: 'Eventos estritamente cronológicos',
      description: 'O log da partida mantém ordem temporal crescente em toda a extensão',
      expected: true,
      actual: chronological,
      passed: chronological,
    });
  }

  // 27. eventos do mesmo minuto possuem ordem determinística
  {
    const sorted = sortEventsChronologically([
      { ...allEvents[0], minute: 70, seed: 50 },
      { ...allEvents[0], minute: 70, seed: 20 },
      { ...allEvents[0], minute: 70, seed: 80 },
    ]);
    const deterministicOrder = sorted[0].seed === 20 && sorted[1].seed === 50 && sorted[2].seed === 80;
    results.push({
      id: 27,
      category: 'Ordem',
      name: 'Ordem determinística no mesmo minuto',
      description: 'Múltiplos acontecimentos no mesmo minuto mantêm sequência determinística fixa',
      expected: true,
      actual: deterministicOrder,
      passed: deterministicOrder,
    });
  }

  return results;
}
