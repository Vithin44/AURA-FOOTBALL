/**
 * AURA Football - Tipos Centrais do Sistema
 * Fonte única de tipagem para todo o simulador de carreira.
 */

// ====================================================
// 1. POSIÇÕES OFICIAIS (Exatamente 10)
// ====================================================
export type PositionId =
  | 'GOL' // Goleiro
  | 'ZAG' // Zagueiro
  | 'LE'  // Lateral-Esquerdo
  | 'LD'  // Lateral-Direito
  | 'VOL' // Volante
  | 'MC'  // Meio-campista
  | 'MEI' // Meia
  | 'PE'  // Ponta-Esquerda
  | 'PD'  // Ponta-Direita
  | 'ATA'; // Atacante

export type PositionSector = 'Goleiro' | 'Defesa' | 'Meio-campo' | 'Ataque';

export interface PositionMetadata {
  id: PositionId;
  name: string;
  fullName: string;
  sector: PositionSector;
  description: string;
}

// ====================================================
// 2. ATRIBUTOS OFICIAIS (Exatamente 6)
// ====================================================
export type AttributeId =
  | 'VEL' // Velocidade
  | 'FIN' // Finalização
  | 'DRI' // Drible
  | 'FOR' // Força
  | 'PAS' // Passe
  | 'DEF'; // Defesa

export interface AttributeMetadata {
  id: AttributeId;
  name: string;
  label: string;
  description: string;
  influences: readonly string[];
}

/**
 * Exatamente os 6 atributos oficiais do AURA Football (Escala 1–100).
 * Tipagem estrita: sem 'any', sem atributos adicionais não oficiais.
 */
export interface PlayerAttributes {
  VEL: number; // Velocidade
  FIN: number; // Finalização
  DRI: number; // Drible
  FOR: number; // Força
  PAS: number; // Passe
  DEF: number; // Defesa
}

export type AttributeImportance = 'Crítico' | 'Alto' | 'Médio' | 'Baixo';

export interface PositionAttributeProfile {
  weights: Record<AttributeId, number>; // Preparado para o Prompt 06 (OVR)
  importance: Record<AttributeId, AttributeImportance>;
}

// ====================================================
// 3. MOEDA CENTRAL (Fichas como fonte única de saldo)
// ====================================================
export interface Currency {
  fichas: number; // Fonte única de saldo virtual do jogo (inclusive Cassino)
}

// ====================================================
// 4. JOGADOR
// ====================================================
export type HairStyleId =
  | 'raspado'
  | 'curto_degrade'
  | 'ondulado'
  | 'moicano'
  | 'dreads'
  | 'topete';

export type FaceShapeId = 'oval' | 'quadrado' | 'alongado';
export type EyebrowsId = 'fina' | 'marcante' | 'arqueada';
export type EyesId = 'focado' | 'amendoado' | 'intenso';
export type MouthId = 'neutra' | 'firme' | 'sorriso_leve';
export type JerseyStyleId = 'solida' | 'listrada' | 'faixa_diagonal' | 'gola_v';

export interface PlayerAvatar {
  skinTone: number;
  skinColor?: string;
  hairStyle: string;
  hairColor: string;
  faceShape?: FaceShapeId;
  eyebrows?: EyebrowsId;
  eyes?: EyesId;
  mouth?: MouthId;
  jerseyStyle?: JerseyStyleId;
  jerseyPrimaryColor?: string;
  jerseySecondaryColor?: string;
  shortsColor?: string;
  socksColor?: string;
  bootsColor: string;
  celebrationId: string;
}

export interface PlayerContract {
  clubId: string;
  salary: number; // Salário simbólico em Fichas por temporada/mês
  yearsRemaining: number;
  releaseClause?: number;
}

export interface PlayerStats {
  matches: number;
  goals: number;
  assists: number;
  cleanSheets?: number;
  averageRating: number;
  yellowCards: number;
  redCards: number;
}

export type PlayerStatus = 'Disponível' | 'Lesionado' | 'Suspenso' | 'Em Seleção';

export interface Player {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  nickname?: string;
  age: number; // Inicial entre 16 e 21
  country: string;
  position: PositionId; // Exatamente uma posição fixa
  kitNumber: number;
  attributes: PlayerAttributes; // 6 atributos principais
  ovr: number; // 0 a 100
  aura: number; // 0 a 100 (inicia cada jogo em 50)
  xp: number;
  level: number;
  status: PlayerStatus;
  influence: number; // 0 a 100 (reputação construída)
  prestige: 'Peladeiro' | 'Promessa' | 'Craque' | 'Ídolo' | 'Lenda';
  contract: PlayerContract;
  avatar: PlayerAvatar;
  stats: PlayerStats;
}

// ====================================================
// 5. CLUBE
// ====================================================
export type ClubPrestige = 'Pequeno' | 'Médio' | 'Grande' | 'Gigante';

export interface Club {
  id: string;
  name: string;
  shortName: string;
  country: string;
  league: string;
  ovr: number;
  prestige: ClubPrestige;
  stadium: string;
  primaryColor: string;
  secondaryColor: string;
}

// ====================================================
// 6. COMPETIÇÃO E TEMPORADA
// ====================================================
export type CompetitionType = 'Liga' | 'Copa Nacional' | 'Continental' | 'Mundial' | 'Amistoso';
export type CompetitionDifficulty = 'Baixa' | 'Média' | 'Alta' | 'Extrema';

export interface Competition {
  id: string;
  name: string;
  type: CompetitionType;
  country?: string;
  difficulty: CompetitionDifficulty;
}

export interface Season {
  year: number;
  seasonNumber: number;
  currentWeek: number;
  totalWeeks: number;
  currentPhase: 'Pré-temporada' | 'Em andamento' | 'Fase Decisiva' | 'Encerrada';
}

// ====================================================
// 7. PARTIDA (ESTRUTURA BASE PREPARADA)
// ====================================================
export interface MatchSummary {
  id: string;
  homeClubId: string;
  awayClubId: string;
  homeScore: number;
  awayScore: number;
  date: string;
  competitionId: string;
  playerMinutesPlayed: number;
  playerRating: number;
}

// ====================================================
// 8. PROGRESSÃO E CARREIRA
// ====================================================
export interface CareerProgress {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  attributePointsAvailable: number;
}

export interface Career {
  id: string;
  saveName: string;
  createdAt: string;
  updatedAt: string;
  player: Player;
  club: Club;
  season: Season;
  currency: Currency; // Fichas
  progress: CareerProgress;
  trophies: string[];
  history: MatchSummary[];
  news: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    category: 'Geral' | 'Transferência' | 'Partida' | 'Conquista';
  }>;
}

// ====================================================
// 9. ARQUITETURA DE SAVE & CONFIGURAÇÕES
// ====================================================
export interface GameSettings {
  language: 'pt-BR';
  simulationSpeed: 'normal' | 'rapida' | 'instantanea';
  decisionTimerDuration: number; // padrão 15s / crucial 25s
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export interface SaveMetadata {
  saveVersion: number;
  engineVersion: string;
  timestamp: number;
  checksum?: string;
}

export interface SaveData {
  metadata: SaveMetadata;
  career: Career;
  settings: GameSettings;
}

// ====================================================
// 10. NAVEGAÇÃO
// ====================================================
export type PageId =
  | 'home'
  | 'diagnostics'
  | 'character_creation'
  | 'hub'
  | 'player'
  | 'matches'
  | 'club'
  | 'calendar'
  | 'training'
  | 'transfers'
  | 'news'
  | 'trophies'
  | 'store'
  | 'casino'
  | 'settings';
