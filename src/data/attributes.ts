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
 * Matriz de Importância e Pesos de Atributos por Posição (Item 4 do Prompt 05)
 * Dados estruturados para alimentar o próximo sistema de cálculo de OVR (Prompt 06).
 */
export const POSITION_ATTRIBUTE_PROFILES: Record<PositionId, PositionAttributeProfile> = {
  GOL: {
    importance: {
      DEF: 'Crítico',
      FOR: 'Alto',
      VEL: 'Médio',
      PAS: 'Médio',
      DRI: 'Baixo',
      FIN: 'Baixo',
    },
    weights: { DEF: 0.40, FOR: 0.25, VEL: 0.15, PAS: 0.10, DRI: 0.05, FIN: 0.05 },
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
    weights: { DEF: 0.40, FOR: 0.25, VEL: 0.15, PAS: 0.10, DRI: 0.05, FIN: 0.05 },
  },
  LE: {
    importance: {
      VEL: 'Crítico',
      DEF: 'Alto',
      PAS: 'Alto',
      DRI: 'Médio',
      FOR: 'Médio',
      FIN: 'Baixo',
    },
    weights: { VEL: 0.28, DEF: 0.25, PAS: 0.20, DRI: 0.12, FOR: 0.10, FIN: 0.05 },
  },
  LD: {
    importance: {
      VEL: 'Crítico',
      DEF: 'Alto',
      PAS: 'Alto',
      DRI: 'Médio',
      FOR: 'Médio',
      FIN: 'Baixo',
    },
    weights: { VEL: 0.28, DEF: 0.25, PAS: 0.20, DRI: 0.12, FOR: 0.10, FIN: 0.05 },
  },
  VOL: {
    importance: {
      DEF: 'Crítico',
      FOR: 'Alto',
      PAS: 'Alto',
      VEL: 'Médio',
      DRI: 'Médio',
      FIN: 'Baixo',
    },
    weights: { DEF: 0.32, FOR: 0.22, PAS: 0.20, VEL: 0.12, DRI: 0.10, FIN: 0.04 },
  },
  MC: {
    importance: {
      PAS: 'Crítico',
      DRI: 'Alto',
      DEF: 'Médio',
      FOR: 'Médio',
      VEL: 'Médio',
      FIN: 'Médio',
    },
    weights: { PAS: 0.30, DRI: 0.20, VEL: 0.15, DEF: 0.15, FOR: 0.10, FIN: 0.10 },
  },
  MEI: {
    importance: {
      PAS: 'Crítico',
      DRI: 'Crítico',
      FIN: 'Alto',
      VEL: 'Alto',
      FOR: 'Baixo',
      DEF: 'Baixo',
    },
    weights: { PAS: 0.30, DRI: 0.28, FIN: 0.18, VEL: 0.14, FOR: 0.05, DEF: 0.05 },
  },
  PE: {
    importance: {
      VEL: 'Crítico',
      DRI: 'Crítico',
      FIN: 'Alto',
      PAS: 'Médio',
      FOR: 'Baixo',
      DEF: 'Baixo',
    },
    weights: { VEL: 0.32, DRI: 0.30, FIN: 0.20, PAS: 0.10, FOR: 0.04, DEF: 0.04 },
  },
  PD: {
    importance: {
      VEL: 'Crítico',
      DRI: 'Crítico',
      FIN: 'Alto',
      PAS: 'Médio',
      FOR: 'Baixo',
      DEF: 'Baixo',
    },
    weights: { VEL: 0.32, DRI: 0.30, FIN: 0.20, PAS: 0.10, FOR: 0.04, DEF: 0.04 },
  },
  ATA: {
    importance: {
      FIN: 'Crítico',
      FOR: 'Alto',
      VEL: 'Alto',
      DRI: 'Médio',
      PAS: 'Baixo',
      DEF: 'Baixo',
    },
    weights: { FIN: 0.38, VEL: 0.22, FOR: 0.18, DRI: 0.12, PAS: 0.06, DEF: 0.04 },
  },
};
