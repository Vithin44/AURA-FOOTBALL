/**
 * AURA Football - Definições Centrais de Atributos
 * Fonte única de verdade: exatamente 6 atributos oficiais.
 */

import { AttributeId, AttributeMetadata, PositionId, PositionAttributeProfile } from '../types';

export const ATTRIBUTE_IDS: readonly AttributeId[] = [
  'VEL',
  'FIN',
  'DRI',
  'FOR',
  'PAS',
  'DEF',
] as const;

export const ATTRIBUTES_DATA: Record<AttributeId, AttributeMetadata> = {
  VEL: {
    id: 'VEL',
    name: 'Velocidade',
    label: 'VEL',
    description: 'Capacidade física de deslocamento do jogador.',
    influences: [
      'Arrancadas e piques',
      'Velocidade em perseguições',
      'Vantagem em bolas longas',
      'Recuperação defensiva',
      'Corridas em profundidade',
    ],
  },
  FIN: {
    id: 'FIN',
    name: 'Finalização',
    label: 'FIN',
    description: 'Capacidade do jogador de finalizar lances diante do gol.',
    influences: [
      'Precisão de chutes',
      'Finalizações dentro e fora da área',
      'Eficiência diante do gol',
      'Pênaltis e cobranças decisivas',
      'Situações de bola parada no ataque',
    ],
  },
  DRI: {
    id: 'DRI',
    name: 'Drible',
    label: 'DRI',
    description: 'Capacidade de conduzir e controlar a bola sob pressão.',
    influences: [
      'Dribles desconcertantes',
      'Mudanças rápidas de direção',
      'Condução de bola em velocidade',
      'Escapar de marcações sob pressão',
      'Situações de 1 contra 1',
    ],
  },
  FOR: {
    id: 'FOR',
    name: 'Força',
    label: 'FOR',
    description: 'Capacidade física de disputar situações de contato.',
    influences: [
      'Disputas físicas de corpo',
      'Proteção e retenção da bola',
      'Divididas ríspidas no chão',
      'Resistência ao contato adversário',
      'Duelos atléticos',
    ],
  },
  PAS: {
    id: 'PAS',
    name: 'Passe',
    label: 'PAS',
    description: 'Capacidade de executar passes e distribuir o jogo.',
    influences: [
      'Passes curtos precisos',
      'Passes longos e lançamentos',
      'Assistências para gol',
      'Criação de jogadas e cadência',
      'Bolas enfiadas em profundidade',
    ],
  },
  DEF: {
    id: 'DEF',
    name: 'Defesa',
    label: 'DEF',
    description: 'Capacidade defensiva e posicionamento tático de proteção.',
    influences: [
      'Desarmes precisos',
      'Interceptações de passes',
      'Marcação individual e zonal',
      'Posicionamento defensivo',
      'Bloqueios de chutes e disputas defensivas',
    ],
  },
};

/**
 * Pesos Oficiais de OVR por Posição (Prompt 06, Item 2)
 * Fonte Única de Verdade para o cálculo de OVR no AURA Football.
 * Cada posição totaliza exatamente 100%.
 */
export const POSITION_OVR_WEIGHTS: Record<PositionId, Record<AttributeId, number>> = {
  GOL: { VEL: 10, FIN: 0,  DRI: 0,  FOR: 20, PAS: 15, DEF: 55 },
  ZAG: { VEL: 15, FIN: 0,  DRI: 5,  FOR: 25, PAS: 15, DEF: 40 },
  LE:  { VEL: 25, FIN: 5,  DRI: 15, FOR: 10, PAS: 15, DEF: 30 },
  LD:  { VEL: 25, FIN: 5,  DRI: 15, FOR: 10, PAS: 15, DEF: 30 },
  VOL: { VEL: 10, FIN: 5,  DRI: 10, FOR: 15, PAS: 30, DEF: 30 },
  MC:  { VEL: 10, FIN: 10, DRI: 20, FOR: 10, PAS: 30, DEF: 20 },
  MEI: { VEL: 10, FIN: 15, DRI: 25, FOR: 5,  PAS: 35, DEF: 10 },
  PE:  { VEL: 25, FIN: 15, DRI: 30, FOR: 5,  PAS: 15, DEF: 10 },
  PD:  { VEL: 25, FIN: 15, DRI: 30, FOR: 5,  PAS: 15, DEF: 10 },
  ATA: { VEL: 20, FIN: 35, DRI: 25, FOR: 10, PAS: 8,  DEF: 2 },
};

/**
 * Matriz de Importância e Pesos de Atributos por Posição (Item 4 do Prompt 05 & Prompt 06)
 * Conectada diretamente aos pesos oficiais de OVR.
 */
export const POSITION_ATTRIBUTE_PROFILES: Record<PositionId, PositionAttributeProfile> = {
  GOL: {
    importance: {
      DEF: 'Crítico',
      FOR: 'Alto',
      PAS: 'Médio',
      VEL: 'Médio',
      DRI: 'Baixo',
      FIN: 'Baixo',
    },
    weights: POSITION_OVR_WEIGHTS.GOL,
  },
  ZAG: {
    importance: {
      DEF: 'Crítico',
      FOR: 'Crítico',
      VEL: 'Alto',
      PAS: 'Médio',
      DRI: 'Baixo',
      FIN: 'Baixo',
    },
    weights: POSITION_OVR_WEIGHTS.ZAG,
  },
  LE: {
    importance: {
      DEF: 'Crítico',
      VEL: 'Crítico',
      PAS: 'Alto',
      DRI: 'Médio',
      FOR: 'Médio',
      FIN: 'Baixo',
    },
    weights: POSITION_OVR_WEIGHTS.LE,
  },
  LD: {
    importance: {
      DEF: 'Crítico',
      VEL: 'Crítico',
      PAS: 'Alto',
      DRI: 'Médio',
      FOR: 'Médio',
      FIN: 'Baixo',
    },
    weights: POSITION_OVR_WEIGHTS.LD,
  },
  VOL: {
    importance: {
      DEF: 'Crítico',
      PAS: 'Crítico',
      FOR: 'Alto',
      VEL: 'Médio',
      DRI: 'Médio',
      FIN: 'Baixo',
    },
    weights: POSITION_OVR_WEIGHTS.VOL,
  },
  MC: {
    importance: {
      PAS: 'Crítico',
      DRI: 'Alto',
      DEF: 'Alto',
      FIN: 'Médio',
      FOR: 'Médio',
      VEL: 'Médio',
    },
    weights: POSITION_OVR_WEIGHTS.MC,
  },
  MEI: {
    importance: {
      PAS: 'Crítico',
      DRI: 'Crítico',
      FIN: 'Alto',
      VEL: 'Médio',
      DEF: 'Médio',
      FOR: 'Baixo',
    },
    weights: POSITION_OVR_WEIGHTS.MEI,
  },
  PE: {
    importance: {
      DRI: 'Crítico',
      VEL: 'Crítico',
      FIN: 'Alto',
      PAS: 'Médio',
      DEF: 'Médio',
      FOR: 'Baixo',
    },
    weights: POSITION_OVR_WEIGHTS.PE,
  },
  PD: {
    importance: {
      DRI: 'Crítico',
      VEL: 'Crítico',
      FIN: 'Alto',
      PAS: 'Médio',
      DEF: 'Médio',
      FOR: 'Baixo',
    },
    weights: POSITION_OVR_WEIGHTS.PD,
  },
  ATA: {
    importance: {
      FIN: 'Crítico',
      DRI: 'Crítico',
      VEL: 'Alto',
      FOR: 'Médio',
      PAS: 'Baixo',
      DEF: 'Baixo',
    },
    weights: POSITION_OVR_WEIGHTS.ATA,
  },
};
