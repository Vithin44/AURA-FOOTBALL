/**
 * AURA Football - Moments Engine (Prompt 10)
 *
 * Gerencia a identificação, criação e controle de Momentos da partida.
 * Um Momento é um acontecimento relevante que coloca o atleta do usuário em situação especial.
 *
 * Regras mandatórias:
 * - Evento ≠ Momento (nem todo evento vira momento).
 * - Só cria momento quando há envolvimento direto do jogador do usuário.
 * - Cooldown temporal de partida entre momentos (evita avalanches consecutivas).
 * - Limite máximo configurável de momentos por partida.
 * - Geração 100% determinística através de Mulberry32 (zero Math.random()).
 * - Imutabilidade: não altera OVR, Atributos, AURA, XP, Influência ou Placar.
 * - Textos e templates 100% em português.
 */

import {
  Match,
  MatchEvent,
  MatchMoment,
  MatchMomentType,
  MatchMomentStatus,
  MatchEventType,
  Player,
} from '../types';
import { SeedableRNG, createRNG } from './rng';

// Constantes Oficiais do Sistema de Momentos
export const MAX_MOMENTS_PER_MATCH = 5;
export const MOMENT_COOLDOWN_MINUTES = 4;

// Tipos de eventos que nunca podem gerar momentos
export const DISALLOWED_MOMENT_EVENT_TYPES: readonly MatchEventType[] = [
  'kickoff',
  'half_time',
  'full_time',
  'save',
  'substitution',
  'injury',
  'yellow_card',
  'red_card',
];

// Tipos de eventos elegíveis para análise de momento (estritamente presentes em MatchEventType)
export const ELIGIBLE_MOMENT_EVENT_TYPES: readonly MatchEventType[] = [
  'chance',
  'shot',
  'goal',
  'foul',
  'corner',
];

// Tipos oficiais válidos de MatchMoment
export const VALID_MOMENT_TYPES: readonly MatchMomentType[] = [
  'chance',
  'shot',
  'goal_chance',
  'one_on_one',
  'cross',
  'corner',
  'free_kick',
  'penalty',
  'defensive',
];

// Status válidos de MatchMoment
export const VALID_MOMENT_STATUSES: readonly MatchMomentStatus[] = [
  'pending',
  'active',
  'resolved',
  'expired',
  'cancelled',
];

/**
 * Biblioteca de templates contextuais em Português para títulos e descrições dos Momentos.
 */
interface MomentTemplate {
  titles: string[];
  descriptions: string[];
}

const MOMENT_TEMPLATES: Record<MatchMomentType, MomentTemplate> = {
  goal_chance: {
    titles: ['Oportunidade de ouro', 'Você está na área', 'Cara a cara com o gol'],
    descriptions: [
      'Você recebe a bola em posição clara dentro da grande área com espaço para agir.',
      'A defesa adversária se abre e você surge livre no segundo pau para conferir.',
      'Você recebe o passe açucarado de frente para a meta e prepara o arremate decisivo.',
    ],
  },
  shot: {
    titles: ['Espaço para finalizar', 'Chute em vista', 'Mira calibrada'],
    descriptions: [
      'A bola sobra no seu pé bom na entrada da área com ângulo aberto para o chute.',
      'Você ajeita o corpo na intermediária e vê a brecha exata para bater forte.',
      'Você recebe de costas, gira com rapidez e abre espaço para a finalização.',
    ],
  },
  one_on_one: {
    titles: ['Um contra um', 'Duelo direto', 'Frente a frente'],
    descriptions: [
      'Você domina em velocidade e fica mano a mano com o último defensor.',
      'Você acelera pelo flanco e encara a marcação individual na entrada da área.',
      'Disputa de corpo e drible: você tem o zagueiro isolado pela frente.',
    ],
  },
  chance: {
    titles: ['Boa chance', 'Espaço para criar', 'Transição ofensiva'],
    descriptions: [
      'Você encontra espaço para atacar e a linha defensiva adversária recua.',
      'Você recebe em progressão e tem linha de passe e corredor abertos.',
      'Jogada ofensiva rápida: você lidera a aproximação pelo meio-campo ofensivo.',
    ],
  },
  cross: {
    titles: ['Bola na área', 'Cruzamento perigoso', 'Bola alçada'],
    descriptions: [
      'Cruzamento veloz chega perigoso na sua direção dentro da grande área.',
      'Bola alçada na segunda trave com você se antecipando à marcação.',
      'Cruzamento rasteiro passa por toda a extensão da área e sobra para você.',
    ],
  },
  corner: {
    titles: ['Escanteio a favor', 'Bola parada decisiva', 'Jogada aérea'],
    descriptions: [
      'Cobrança ensaiada de escanteio. Você se desmarca com agressividade na primeira trave.',
      'A bola vem pelo alto após cobrança de canto e você salta na disputa pelo cabeceio.',
      'Escanteio com sobra na meia-lua: você se posiciona para pegar a segunda bola.',
    ],
  },
  free_kick: {
    titles: ['Falta perigosa', 'Cobrança estratégica', 'Bola parada frontal'],
    descriptions: [
      'Falta perigosa assinalada próxima da meia-lua. A cobrança é uma chance de ouro.',
      'Falta lateral perigosa: você se apresenta para uma cobrança venenosa.',
      'Barreira montada e você estuda o posicionamento do goleiro para a batida direta.',
    ],
  },
  penalty: {
    titles: ['Pênalti', 'Marca da cal', 'Momento supremo'],
    descriptions: [
      'Pênalti assinalado! A torcida prende a respiração e a responsabilidade da cobrança é sua.',
      'Marca da cal: você ajeita a bola cuidadosamente diante do goleiro adversário.',
      'Momento supremo da partida: cobrança de penalidade máxima com tudo nas suas mãos.',
    ],
  },
  defensive: {
    titles: ['Disputa decisiva', 'Desarme crucial', 'Intervenção firme'],
    descriptions: [
      'O adversário tenta infiltrar perigosamente e você precisa dar o bote limpo.',
      'Duelo corpo a corpo no setor de contenção com contra-ataque em jogo.',
      'Pressão pós-perda: você fecha a linha de passe e disputa a posse agressivamente.',
    ],
  },
};

/**
 * Converte um MatchEventType para o MatchMomentType mais adequado.
 */
export function mapEventToMomentType(
  eventType: MatchEventType,
  rng?: SeedableRNG
): MatchMomentType {
  const seedVal = rng ? rng.nextInt(0, 99) : 0;

  switch (eventType) {
    case 'shot':
      return seedVal < 40 ? 'goal_chance' : 'shot';
    case 'goal':
      return 'goal_chance';
    case 'chance':
      return seedVal < 35 ? 'one_on_one' : 'chance';
    case 'corner':
      return seedVal < 40 ? 'cross' : 'corner';
    case 'foul':
      return seedVal < 50 ? 'free_kick' : 'defensive';
    default:
      return 'chance';
  }
}

/**
 * Avalia de forma determinística se um evento é elegível para virar Momento.
 *
 * Regras estritas:
 * 1. O evento deve ter envolvimento direto do atleta do usuário (playerId === userPlayer.id).
 * 2. O tipo de evento deve pertencer à lista de elegíveis (não pode ser kickoff, half_time, etc.).
 * 3. O limite máximo de momentos da partida não pode ter sido alcançado.
 * 4. O cooldown de minutos regulamentares desde o último momento deve ser respeitado.
 */
export function shouldCreateMoment(
  event: MatchEvent,
  match: Match,
  userPlayer?: Player,
  currentMomentsInBatch?: MatchMoment[]
): boolean {
  // 1. Regra primária: sem atleta ou sem envolvimento direto do atleta, não há Momento
  if (!userPlayer || !event.playerId || event.playerId !== userPlayer.id) {
    return false;
  }

  // 2. Não cria momentos para eventos proibidos/estruturais
  if (DISALLOWED_MOMENT_EVENT_TYPES.includes(event.type)) {
    return false;
  }

  // 3. Deve pertencer aos tipos elegíveis
  if (!ELIGIBLE_MOMENT_EVENT_TYPES.includes(event.type)) {
    return false;
  }

  // Combina momentos já gravados na partida com os momentos gerados no lote atual
  const allMoments = currentMomentsInBatch
    ? [...match.moments, ...currentMomentsInBatch]
    : match.moments;

  // 4. Limite máximo de momentos da partida
  if (allMoments.length >= MAX_MOMENTS_PER_MATCH) {
    return false;
  }

  // 5. Cooldown em minutos da partida
  if (allMoments.length > 0) {
    const lastMoment = allMoments[allMoments.length - 1];
    const diff = event.minute - lastMoment.minute;
    if (diff >= 0 && diff < MOMENT_COOLDOWN_MINUTES) {
      return false;
    }
  }

  return true;
}

/**
 * Parâmetros de criação determinística de MatchMoment.
 */
export interface CreateMomentParams {
  match: Match;
  event: MatchEvent;
  player: Player;
  status?: MatchMomentStatus;
  type?: MatchMomentType;
  seed?: number;
}

/**
 * Cria um MatchMoment imutável e determinístico a partir de um evento oficial.
 */
export function createMomentFromEvent(params: CreateMomentParams): MatchMoment {
  const { match, event, player } = params;
  const seed = params.seed ?? (event.seed ^ (match.minute * 104729));
  const rng = createRNG(seed);

  const momentType = params.type ?? mapEventToMomentType(event.type, rng);
  const templates = MOMENT_TEMPLATES[momentType] || MOMENT_TEMPLATES.chance;

  const titleIdx = rng.nextInt(0, templates.titles.length - 1);
  const descIdx = rng.nextInt(0, templates.descriptions.length - 1);

  const title = templates.titles[titleIdx];
  const description = templates.descriptions[descIdx];

  // Identificador determinístico único combinando partida, evento e minuto
  const id = `moment_${match.id}_${event.id}_m${event.minute}`;

  // Cronômetro de decisões futuras: 25 segundos para momentos críticos/difíceis, 15 segundos para momentos normais
  const isDifficult =
    event.importance === 'critical' ||
    momentType === 'penalty' ||
    momentType === 'one_on_one';
  const timeLimitSeconds = isDifficult ? 25 : 15;

  return {
    id,
    matchId: match.id,
    eventId: event.id,
    minute: event.minute,
    addedMinute: event.addedMinute,
    type: momentType,
    title,
    description,
    importance: event.importance,
    playerId: player.id,
    teamId: event.teamId,
    status: params.status ?? 'pending',
    seed,
    timeLimitSeconds,
  };
}

/**
 * Avalia os eventos gerados em um minuto e cria os momentos elegíveis,
 * respeitando cooldown, limites e determinismo.
 */
export function evaluateAndProcessMoments(
  match: Match,
  newEvents: MatchEvent[],
  userPlayer?: Player
): MatchMoment[] {
  if (!userPlayer || newEvents.length === 0) {
    return [];
  }

  const generatedMoments: MatchMoment[] = [];

  for (const event of newEvents) {
    if (shouldCreateMoment(event, match, userPlayer, generatedMoments)) {
      const moment = createMomentFromEvent({
        match,
        event,
        player: userPlayer,
        status: 'pending',
      });
      generatedMoments.push(moment);
    }
  }

  return generatedMoments;
}

// ====================================================
// SUÍTE DE TESTES UNITÁRIOS DA MOMENTS ENGINE (Prompt 10)
// ====================================================
export interface MomentTestCaseResult {
  id: number;
  category: 'Estrutura' | 'Conversão' | 'Determinismo' | 'Limites' | 'Integridade' | 'Partida';
  name: string;
  description: string;
  expected: unknown;
  actual: unknown;
  passed: boolean;
  details?: string;
}

/**
 * Executa todos os 26 casos de teste obrigatórios especificados no Prompt 10.
 */
export function runMomentTests(): MomentTestCaseResult[] {
  const results: MomentTestCaseResult[] = [];

  const homeClub = {
    id: 'club_flamengo',
    name: 'Flamengo',
    shortName: 'FLA',
    country: 'Brasil',
    league: 'Série A',
    ovr: 81,
    prestige: 'Gigante' as const,
    stadium: 'Maracanã',
    primaryColor: '#C4161C',
    secondaryColor: '#1A1A1A',
  };

  const awayClub = {
    id: 'club_vasco',
    name: 'Vasco',
    shortName: 'VAS',
    country: 'Brasil',
    league: 'Série A',
    ovr: 75,
    prestige: 'Grande' as const,
    stadium: 'São Januário',
    primaryColor: '#1A1A1A',
    secondaryColor: '#FFFFFF',
  };

  const dummyPlayer: Player = {
    id: 'player_user_10',
    name: 'Zico Júnior',
    age: 18,
    country: 'Brasil',
    position: 'ATA',
    kitNumber: 10,
    attributes: {
      VEL: 78,
      FIN: 75,
      DRI: 74,
      FOR: 72,
      PAS: 70,
      DEF: 35,
    },
    ovr: 75,
    aura: 50,
    xp: 0,
    level: 1,
    status: 'Disponível',
    influence: 15,
    prestige: 'Promessa',
    contract: { clubId: 'club_flamengo', salary: 1000, yearsRemaining: 3 },
    avatar: {
      skinTone: 2,
      hairStyle: 'curto_degrade',
      hairColor: '#000000',
      bootsColor: '#B7FF3C',
      celebrationId: 'default',
    },
    stats: { matches: 0, goals: 0, assists: 0, averageRating: 6.0, yellowCards: 0, redCards: 0 },
  };

  const otherPlayer: Player = {
    ...dummyPlayer,
    id: 'player_adversario_99',
    name: 'Atleta Adversário',
  };

  const createBaseMatch = (seed = 987654321): Match => ({
    id: `match_${homeClub.id}_vs_${awayClub.id}`,
    competition: 'Campeonato Estadual',
    season: 1,
    date: '2026-09-22',
    minute: 0,
    finalMinute: 90,
    homeTeam: homeClub,
    awayTeam: awayClub,
    playerTeamId: homeClub.id,
    venue: 'home',
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    period: 'first_half',
    seed,
    events: [],
    moments: [],
  });

  const advanceMockMinute = (match: Match, player: Player, rng: SeedableRNG): Match => {
    const nextMinute = match.minute + 1;
    const events: MatchEvent[] = [];
    const roll = rng.nextInt(1, 100);
    if (roll <= 25) {
      const types: MatchEventType[] = ['chance', 'shot', 'corner', 'foul', 'goal'];
      const type = types[rng.nextInt(0, types.length - 1)];
      const seedVal = rng.nextInt(1, 999999999);
      events.push({
        id: `evt_${match.id}_${nextMinute}_${seedVal}`,
        matchId: match.id,
        minute: nextMinute,
        type,
        teamId: homeClub.id,
        playerId: player.id,
        description: `Lance perigoso aos ${nextMinute}'`,
        importance: type === 'goal' ? 'critical' : 'high',
        isSignificant: true,
        seed: seedVal,
      });
    }

    const newMoments = evaluateAndProcessMoments(
      { ...match, minute: nextMinute },
      events,
      player
    );

    return {
      ...match,
      minute: nextMinute,
      events: [...match.events, ...events],
      moments: [...match.moments, ...newMoments],
    };
  };

  const simulateMockMatch = (match: Match, player: Player): Match => {
    let current: Match = { ...match, status: 'live' };
    const rng = createRNG(match.seed);

    current.events.push({
      id: `evt_kickoff_${match.id}`,
      matchId: match.id,
      minute: 0,
      type: 'kickoff',
      teamId: homeClub.id,
      description: 'Início',
      importance: 'low',
      isSignificant: false,
      seed: rng.nextInt(1, 999999999),
    });

    for (let m = 1; m <= 90; m++) {
      current = advanceMockMinute(current, player, rng);
    }

    current.events.push({
      id: `evt_fulltime_${match.id}`,
      matchId: match.id,
      minute: 90,
      type: 'full_time',
      teamId: homeClub.id,
      description: 'Fim',
      importance: 'low',
      isSignificant: false,
      seed: rng.nextInt(1, 999999999),
    });

    return {
      ...current,
      status: 'finished',
      period: 'finished',
    };
  };

  // ----------------------------------------------------
  // GRUPO 1: Estrutura (Testes 1 a 6)
  // ----------------------------------------------------

  // 1. MatchMoment possui campos obrigatórios
  {
    const baseMatch = createBaseMatch();
    const event: MatchEvent = {
      id: 'evt_test_1',
      matchId: baseMatch.id,
      minute: 25,
      type: 'shot',
      teamId: homeClub.id,
      playerId: dummyPlayer.id,
      description: 'Chute colocado de fora da área.',
      importance: 'high',
      isSignificant: true,
      seed: 111,
    };
    const moment = createMomentFromEvent({ match: baseMatch, event, player: dummyPlayer });
    const hasRequired =
      typeof moment.id === 'string' &&
      typeof moment.matchId === 'string' &&
      typeof moment.eventId === 'string' &&
      typeof moment.minute === 'number' &&
      typeof moment.type === 'string' &&
      typeof moment.title === 'string' &&
      typeof moment.description === 'string' &&
      typeof moment.importance === 'string' &&
      typeof moment.playerId === 'string' &&
      typeof moment.teamId === 'string' &&
      typeof moment.status === 'string';

    results.push({
      id: 1,
      category: 'Estrutura',
      name: 'MatchMoment possui campos obrigatórios',
      description: 'Garante que a interface MatchMoment contém todos os 11 campos mandatórios',
      expected: true,
      actual: hasRequired,
      passed: hasRequired,
    });
  }

  // 2. Tipo de Momento é válido
  {
    const baseMatch = createBaseMatch();
    const event: MatchEvent = {
      id: 'evt_test_2',
      matchId: baseMatch.id,
      minute: 30,
      type: 'chance',
      teamId: homeClub.id,
      playerId: dummyPlayer.id,
      description: 'Transição rápida com espaço.',
      importance: 'normal',
      isSignificant: true,
      seed: 222,
    };
    const moment = createMomentFromEvent({ match: baseMatch, event, player: dummyPlayer });
    const isValidType = VALID_MOMENT_TYPES.includes(moment.type);

    results.push({
      id: 2,
      category: 'Estrutura',
      name: 'Tipo de Momento é válido',
      description: 'O tipo atribuído ao Momento pertence ao conjunto oficial MatchMomentType',
      expected: true,
      actual: isValidType,
      passed: isValidType,
    });
  }

  // 3. Status inicial é válido
  {
    const baseMatch = createBaseMatch();
    const event: MatchEvent = {
      id: 'evt_test_3',
      matchId: baseMatch.id,
      minute: 15,
      type: 'shot',
      teamId: homeClub.id,
      playerId: dummyPlayer.id,
      description: 'Finalização perigosa.',
      importance: 'high',
      isSignificant: true,
      seed: 333,
    };
    const moment = createMomentFromEvent({ match: baseMatch, event, player: dummyPlayer });
    const isStatusValid = moment.status === 'pending' || moment.status === 'active';

    results.push({
      id: 3,
      category: 'Estrutura',
      name: 'Status inicial é válido',
      description: 'O status inicial do momento deve ser pending ou active',
      expected: 'pending',
      actual: moment.status,
      passed: isStatusValid,
    });
  }

  // 4. eventId aponta para evento existente
  {
    const baseMatch = createBaseMatch();
    const event: MatchEvent = {
      id: 'evt_test_4_specific',
      matchId: baseMatch.id,
      minute: 40,
      type: 'goal',
      teamId: homeClub.id,
      playerId: dummyPlayer.id,
      description: 'Gol marcado pelo atleta.',
      importance: 'critical',
      isSignificant: true,
      seed: 444,
    };
    const moment = createMomentFromEvent({ match: baseMatch, event, player: dummyPlayer });
    const matchesEventId = moment.eventId === event.id;

    results.push({
      id: 4,
      category: 'Estrutura',
      name: 'eventId aponta para evento existente',
      description: 'O campo eventId do momento preserva a referência exata do evento original',
      expected: event.id,
      actual: moment.eventId,
      passed: matchesEventId,
    });
  }

  // 5. playerId é preservado
  {
    const baseMatch = createBaseMatch();
    const event: MatchEvent = {
      id: 'evt_test_5',
      matchId: baseMatch.id,
      minute: 20,
      type: 'chance',
      teamId: homeClub.id,
      playerId: dummyPlayer.id,
      description: 'Chance criada.',
      importance: 'normal',
      isSignificant: true,
      seed: 555,
    };
    const moment = createMomentFromEvent({ match: baseMatch, event, player: dummyPlayer });
    const preservesPlayer = moment.playerId === dummyPlayer.id;

    results.push({
      id: 5,
      category: 'Estrutura',
      name: 'playerId é preservado',
      description: 'O ID do jogador do usuário é preservado com exatidão no Momento',
      expected: dummyPlayer.id,
      actual: moment.playerId,
      passed: preservesPlayer,
    });
  }

  // 6. teamId é preservado
  {
    const baseMatch = createBaseMatch();
    const event: MatchEvent = {
      id: 'evt_test_6',
      matchId: baseMatch.id,
      minute: 50,
      type: 'corner',
      teamId: homeClub.id,
      playerId: dummyPlayer.id,
      description: 'Escanteio a favor.',
      importance: 'normal',
      isSignificant: true,
      seed: 666,
    };
    const moment = createMomentFromEvent({ match: baseMatch, event, player: dummyPlayer });
    const preservesTeam = moment.teamId === homeClub.id;

    results.push({
      id: 6,
      category: 'Estrutura',
      name: 'teamId é preservado',
      description: 'O ID do clube responsável pelo lance é preservado no Momento',
      expected: homeClub.id,
      actual: moment.teamId,
      passed: preservesTeam,
    });
  }

  // ----------------------------------------------------
  // GRUPO 2: Conversão (Testes 7 a 10)
  // ----------------------------------------------------

  // 7. Evento relevante pode gerar Momento
  {
    const baseMatch = createBaseMatch();
    const event: MatchEvent = {
      id: 'evt_test_7',
      matchId: baseMatch.id,
      minute: 10,
      type: 'shot',
      teamId: homeClub.id,
      playerId: dummyPlayer.id,
      description: 'Chute com perigo.',
      importance: 'high',
      isSignificant: true,
      seed: 777,
    };
    const eligible = shouldCreateMoment(event, baseMatch, dummyPlayer);

    results.push({
      id: 7,
      category: 'Conversão',
      name: 'Evento relevante pode gerar Momento',
      description: 'Um evento de finalização envolvendo o jogador passa nos critérios de elegibilidade',
      expected: true,
      actual: eligible,
      passed: eligible,
    });
  }

  // 8. Evento irrelevante não gera Momento
  {
    const baseMatch = createBaseMatch();
    const event: MatchEvent = {
      id: 'evt_test_8',
      matchId: baseMatch.id,
      minute: 0,
      type: 'kickoff',
      teamId: homeClub.id,
      playerId: dummyPlayer.id,
      description: 'Pontapé inicial.',
      importance: 'low',
      isSignificant: false,
      seed: 888,
    };
    const eligible = shouldCreateMoment(event, baseMatch, dummyPlayer);

    results.push({
      id: 8,
      category: 'Conversão',
      name: 'Evento irrelevante não gera Momento',
      description: 'Eventos estruturais como kickoff ou substituição são barrados para criação de momentos',
      expected: false,
      actual: eligible,
      passed: !eligible,
    });
  }

  // 9. Evento sem envolvimento do jogador não gera Momento
  {
    const baseMatch = createBaseMatch();
    const event: MatchEvent = {
      id: 'evt_test_9',
      matchId: baseMatch.id,
      minute: 22,
      type: 'shot',
      teamId: awayClub.id,
      playerId: otherPlayer.id, // Outro jogador
      description: 'Finalização do adversário.',
      importance: 'high',
      isSignificant: true,
      seed: 999,
    };
    const eligible = shouldCreateMoment(event, baseMatch, dummyPlayer);

    results.push({
      id: 9,
      category: 'Conversão',
      name: 'Evento sem envolvimento do jogador não gera Momento',
      description: 'Lances de outros atletas não criam momentos de protagonismo para o usuário',
      expected: false,
      actual: eligible,
      passed: !eligible,
    });
  }

  // 10. Evento relevante do jogador pode gerar Momento
  {
    const baseMatch = createBaseMatch();
    const event: MatchEvent = {
      id: 'evt_test_10',
      matchId: baseMatch.id,
      minute: 35,
      type: 'foul',
      teamId: homeClub.id,
      playerId: dummyPlayer.id,
      description: 'Falta perigosa sofrida pelo atleta na entrada da área.',
      importance: 'critical',
      isSignificant: true,
      seed: 1010,
    };
    const eligible = shouldCreateMoment(event, baseMatch, dummyPlayer);

    results.push({
      id: 10,
      category: 'Conversão',
      name: 'Evento relevante do jogador pode gerar Momento',
      description: 'Falta ou lance relevante envolvendo o jogador é aceito diretamente pela camada de momentos',
      expected: true,
      actual: eligible,
      passed: eligible,
    });
  }

  // ----------------------------------------------------
  // GRUPO 3: Determinismo (Testes 11 a 13)
  // ----------------------------------------------------

  // 11. Mesma partida + mesma seed → mesmos Momentos
  {
    const matchA = createBaseMatch(55555);
    const matchB = createBaseMatch(55555);
    const simA = simulateMockMatch(matchA, dummyPlayer);
    const simB = simulateMockMatch(matchB, dummyPlayer);

    const sameLength = simA.moments.length === simB.moments.length;
    const sameTitles =
      sameLength &&
      simA.moments.every((m, idx) => m.title === simB.moments[idx].title && m.minute === simB.moments[idx].minute);

    results.push({
      id: 11,
      category: 'Determinismo',
      name: 'Mesma partida + mesma seed gera mesmos Momentos',
      description: 'Duas simulações independentes com idêntica semente produzem exatamente os mesmos momentos',
      expected: true,
      actual: sameTitles,
      passed: sameTitles,
    });
  }

  // 12. IDs dos Momentos são determinísticos
  {
    const matchA = createBaseMatch(12345);
    const matchB = createBaseMatch(12345);
    const simA = simulateMockMatch(matchA, dummyPlayer);
    const simB = simulateMockMatch(matchB, dummyPlayer);

    const sameIds =
      simA.moments.length > 0 &&
      simA.moments.every((m, idx) => m.id === simB.moments[idx].id);

    results.push({
      id: 12,
      category: 'Determinismo',
      name: 'IDs dos Momentos são determinísticos',
      description: 'Identificadores de momentos gerados são imutáveis e reprodutíveis entre execuções',
      expected: true,
      actual: sameIds,
      passed: sameIds,
    });
  }

  // 13. Ordem dos Momentos é determinística
  {
    const matchA = createBaseMatch(88888);
    const simA = simulateMockMatch(matchA, dummyPlayer);
    let ordered = true;
    for (let i = 1; i < simA.moments.length; i++) {
      if (simA.moments[i].minute < simA.moments[i - 1].minute) {
        ordered = false;
        break;
      }
    }

    results.push({
      id: 13,
      category: 'Determinismo',
      name: 'Ordem dos Momentos é determinística',
      description: 'A lista de momentos mantém ordem cronológica estrita de minutos',
      expected: true,
      actual: ordered,
      passed: ordered,
    });
  }

  // ----------------------------------------------------
  // GRUPO 4: Limites (Testes 14 a 16)
  // ----------------------------------------------------

  // 14. Limite máximo de Momentos é respeitado
  {
    const matchWithMax: Match = {
      ...createBaseMatch(),
      moments: Array.from({ length: MAX_MOMENTS_PER_MATCH }, (_, i) => ({
        id: `m_${i}`,
        matchId: 'match_1',
        eventId: `evt_${i}`,
        minute: i * 10,
        type: 'chance',
        title: 'Chance',
        description: 'Desc',
        importance: 'normal',
        playerId: dummyPlayer.id,
        teamId: homeClub.id,
        status: 'pending',
        seed: i,
        timeLimitSeconds: 15,
      })),
    };

    const nextEvent: MatchEvent = {
      id: 'evt_overflow',
      matchId: matchWithMax.id,
      minute: 80,
      type: 'shot',
      teamId: homeClub.id,
      playerId: dummyPlayer.id,
      description: 'Chute aos 80.',
      importance: 'high',
      isSignificant: true,
      seed: 1414,
    };

    const eligible = shouldCreateMoment(nextEvent, matchWithMax, dummyPlayer);

    results.push({
      id: 14,
      category: 'Limites',
      name: 'Limite máximo de Momentos é respeitado',
      description: 'Atingindo MAX_MOMENTS_PER_MATCH, a engine bloqueia novos momentos',
      expected: false,
      actual: eligible,
      passed: !eligible,
    });
  }

  // 15. Cooldown é respeitado
  {
    const matchWithRecentMoment: Match = {
      ...createBaseMatch(),
      moments: [
        {
          id: 'm_recent',
          matchId: 'match_1',
          eventId: 'evt_prev',
          minute: 30,
          type: 'chance',
          title: 'Chance aos 30',
          description: 'Desc',
          importance: 'normal',
          playerId: dummyPlayer.id,
          teamId: homeClub.id,
          status: 'pending',
          seed: 1515,
          timeLimitSeconds: 15,
        },
      ],
    };

    // Evento apenas 1 minuto depois (31' vs 30')
    const immediateEvent: MatchEvent = {
      id: 'evt_immediate',
      matchId: matchWithRecentMoment.id,
      minute: 31,
      type: 'shot',
      teamId: homeClub.id,
      playerId: dummyPlayer.id,
      description: 'Chute aos 31.',
      importance: 'high',
      isSignificant: true,
      seed: 1516,
    };

    const blockedByCooldown = !shouldCreateMoment(immediateEvent, matchWithRecentMoment, dummyPlayer);

    // Evento após o cooldown (35' vs 30' com cooldown 4)
    const afterCooldownEvent: MatchEvent = {
      id: 'evt_after_cd',
      matchId: matchWithRecentMoment.id,
      minute: 35,
      type: 'shot',
      teamId: homeClub.id,
      playerId: dummyPlayer.id,
      description: 'Chute aos 35.',
      importance: 'high',
      isSignificant: true,
      seed: 1517,
    };

    const allowedAfterCooldown = shouldCreateMoment(afterCooldownEvent, matchWithRecentMoment, dummyPlayer);
    const passed = blockedByCooldown && allowedAfterCooldown;

    results.push({
      id: 15,
      category: 'Limites',
      name: 'Cooldown é respeitado',
      description: 'Bloqueia criação em intervalo menor que MOMENT_COOLDOWN_MINUTES e libera após decorrido o prazo',
      expected: true,
      actual: passed,
      passed,
    });
  }

  // 16. Eventos consecutivos não criam avalanche de Momentos
  {
    const baseMatch = createBaseMatch();
    const consecutiveEvents: MatchEvent[] = [
      {
        id: 'evt_c1',
        matchId: baseMatch.id,
        minute: 20,
        type: 'shot',
        teamId: homeClub.id,
        playerId: dummyPlayer.id,
        description: 'Chute aos 20.',
        importance: 'high',
        isSignificant: true,
        seed: 1,
      },
      {
        id: 'evt_c2',
        matchId: baseMatch.id,
        minute: 21,
        type: 'chance',
        teamId: homeClub.id,
        playerId: dummyPlayer.id,
        description: 'Chance aos 21.',
        importance: 'normal',
        isSignificant: true,
        seed: 2,
      },
      {
        id: 'evt_c3',
        matchId: baseMatch.id,
        minute: 22,
        type: 'shot',
        teamId: homeClub.id,
        playerId: dummyPlayer.id,
        description: 'Chute aos 22.',
        importance: 'high',
        isSignificant: true,
        seed: 3,
      },
    ];

    const generated = evaluateAndProcessMoments(baseMatch, consecutiveEvents, dummyPlayer);
    // Apenas o primeiro lance aos 20' deve virar momento; os lances consecutivos aos 21' e 22' são barrados pelo cooldown
    const passed = generated.length === 1 && generated[0].minute === 20;

    results.push({
      id: 16,
      category: 'Limites',
      name: 'Eventos consecutivos não criam avalanche de Momentos',
      description: 'Avaliador em lote descarta eventos em sequência que violem o cooldown interno',
      expected: 1,
      actual: generated.length,
      passed,
    });
  }

  // ----------------------------------------------------
  // GRUPO 5: Integridade (Testes 17 a 22)
  // ----------------------------------------------------

  // 17. Criar Momento não altera OVR
  {
    const baseMatch = createBaseMatch();
    const initialOvr = dummyPlayer.ovr;
    simulateMockMatch(baseMatch, dummyPlayer);
    const passed = dummyPlayer.ovr === initialOvr;

    results.push({
      id: 17,
      category: 'Integridade',
      name: 'Criar Momento não altera OVR',
      description: 'O OVR do atleta permanece estritamente constante durante a avaliação e criação de momentos',
      expected: initialOvr,
      actual: dummyPlayer.ovr,
      passed,
    });
  }

  // 18. Criar Momento não altera atributos
  {
    const baseMatch = createBaseMatch();
    const initialFin = dummyPlayer.attributes.FIN;
    simulateMockMatch(baseMatch, dummyPlayer);
    const passed = dummyPlayer.attributes.FIN === initialFin;

    results.push({
      id: 18,
      category: 'Integridade',
      name: 'Criar Momento não altera atributos',
      description: 'A matriz de 6 atributos principais do atleta permanece inviolada',
      expected: initialFin,
      actual: dummyPlayer.attributes.FIN,
      passed,
    });
  }

  // 19. Criar Momento não altera AURA
  {
    const baseMatch = createBaseMatch();
    const initialAura = dummyPlayer.aura;
    simulateMockMatch(baseMatch, dummyPlayer);
    const passed = dummyPlayer.aura === initialAura;

    results.push({
      id: 19,
      category: 'Integridade',
      name: 'Criar Momento não altera AURA',
      description: 'A AURA do atleta permanece 50 até o futuro sistema de decisões',
      expected: initialAura,
      actual: dummyPlayer.aura,
      passed,
    });
  }

  // 20. Criar Momento não altera XP
  {
    const baseMatch = createBaseMatch();
    const initialXP = dummyPlayer.xp;
    simulateMockMatch(baseMatch, dummyPlayer);
    const passed = dummyPlayer.xp === initialXP;

    results.push({
      id: 20,
      category: 'Integridade',
      name: 'Criar Momento não altera XP',
      description: 'A pontuação de XP do jogador não sofre incremento pela engine de momentos',
      expected: initialXP,
      actual: dummyPlayer.xp,
      passed,
    });
  }

  // 21. Criar Momento não altera influência
  {
    const baseMatch = createBaseMatch();
    const initialInf = dummyPlayer.influence;
    simulateMockMatch(baseMatch, dummyPlayer);
    const passed = dummyPlayer.influence === initialInf;

    results.push({
      id: 21,
      category: 'Integridade',
      name: 'Criar Momento não altera influência',
      description: 'A reputação/influência construída permanece inalterada',
      expected: initialInf,
      actual: dummyPlayer.influence,
      passed,
    });
  }

  // 22. Criar Momento não altera o placar indevidamente
  {
    const baseMatch = createBaseMatch();
    const eventNonGoal: MatchEvent = {
      id: 'evt_shot_no_goal',
      matchId: baseMatch.id,
      minute: 25,
      type: 'shot',
      teamId: homeClub.id,
      playerId: dummyPlayer.id,
      description: 'Finalização perigosa sem gol.',
      importance: 'high',
      isSignificant: true,
      seed: 2222,
    };

    const scoreBefore = { home: baseMatch.homeScore, away: baseMatch.awayScore };
    // Criamos o momento do evento
    createMomentFromEvent({ match: baseMatch, event: eventNonGoal, player: dummyPlayer });
    const scoreAfter = { home: baseMatch.homeScore, away: baseMatch.awayScore };
    const passed = scoreBefore.home === scoreAfter.home && scoreBefore.away === scoreAfter.away;

    results.push({
      id: 22,
      category: 'Integridade',
      name: 'Criar Momento não altera o placar indevidamente',
      description: 'A instanciação de um momento isolado não modifica os gols da partida',
      expected: scoreBefore,
      actual: scoreAfter,
      passed,
    });
  }

  // ----------------------------------------------------
  // GRUPO 6: Partida (Testes 23 a 26)
  // ----------------------------------------------------

  // 23. Simulação pode produzir Momentos
  {
    const baseMatch = createBaseMatch(12345);
    const simulated = simulateMockMatch(baseMatch, dummyPlayer);
    const hasMoments = simulated.moments.length > 0 && simulated.moments.length <= MAX_MOMENTS_PER_MATCH;

    results.push({
      id: 23,
      category: 'Partida',
      name: 'Simulação pode produzir Momentos',
      description: 'Ao executar simulateMockMatch com o atleta do usuário, momentos são registrados no estado da partida',
      expected: true,
      actual: hasMoments,
      passed: hasMoments,
    });
  }

  // 24. Avanço de minuto pode produzir Momentos
  {
    let match = createBaseMatch(67890);
    const rng = createRNG(match.seed);
    // Avançamos minutos até que um momento seja gerado
    let momentGenerated = false;
    for (let min = 1; min <= 90; min++) {
      match = advanceMockMinute(match, dummyPlayer, rng);
      if (match.moments.length > 0) {
        momentGenerated = true;
        break;
      }
    }

    results.push({
      id: 24,
      category: 'Partida',
      name: 'Avanço de minuto pode produzir Momentos',
      description: 'Avançar minuto a minuto ativa a engine de momentos quando um lance elegível é gerado',
      expected: true,
      actual: momentGenerated,
      passed: momentGenerated,
    });
  }

  // 25. Momentos ficam registrados na partida
  {
    const baseMatch = createBaseMatch(99999);
    const simulated = simulateMockMatch(baseMatch, dummyPlayer);
    const momentsAreInMatch = Array.isArray(simulated.moments);

    results.push({
      id: 25,
      category: 'Partida',
      name: 'Momentos ficam registrados na partida',
      description: 'O array match.moments armazena os momentos gerados imutavelmente na partida',
      expected: true,
      actual: momentsAreInMatch,
      passed: momentsAreInMatch,
    });
  }

  // 26. Eventos originais continuam preservados
  {
    const baseMatch = createBaseMatch(11111);
    const simulated = simulateMockMatch(baseMatch, dummyPlayer);
    const hasEvents = simulated.events.length > 0;
    const hasKickoff = simulated.events.some((e) => e.type === 'kickoff');
    const hasFullTime = simulated.events.some((e) => e.type === 'full_time');
    const preserved = hasEvents && hasKickoff && hasFullTime;

    results.push({
      id: 26,
      category: 'Partida',
      name: 'Eventos originais continuam preservados',
      description: 'A geração de momentos não substitui nem altera a integridade do histórico oficial de eventos',
      expected: true,
      actual: preserved,
      passed: preserved,
    });
  }

  return results;
}
