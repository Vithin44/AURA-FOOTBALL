/**
 * AURA Football - Definições Centrais de Posições
 * Fonte única de verdade: exatamente 10 posições oficiais.
 */

import { PositionId, PositionMetadata } from '../types';

export const POSITION_IDS: readonly PositionId[] = [
  'GOL',
  'ZAG',
  'LE',
  'LD',
  'VOL',
  'MC',
  'MEI',
  'PE',
  'PD',
  'ATA',
] as const;

export const POSITIONS_DATA: Record<PositionId, PositionMetadata> = {
  GOL: {
    id: 'GOL',
    name: 'Goleiro',
    fullName: 'Goleiro',
    sector: 'Goleiro',
    description: 'Segurança nas redes, reflexos rápidos, posicionamento e saída de bola.',
  },
  ZAG: {
    id: 'ZAG',
    name: 'Zagueiro',
    fullName: 'Zagueiro Central',
    sector: 'Defesa',
    description: 'Imposição física, jogo aéreo, desarmes e liderança defensiva.',
  },
  LE: {
    id: 'LE',
    name: 'Lateral-Esquerdo',
    fullName: 'Lateral-Esquerdo',
    sector: 'Defesa',
    description: 'Apoio pela ala esquerda, cruzamentos pontuais e cobertura defensiva.',
  },
  LD: {
    id: 'LD',
    name: 'Lateral-Direito',
    fullName: 'Lateral-Direito',
    sector: 'Defesa',
    description: 'Profundidade pelo flanco direito, recomposição e velocidade.',
  },
  VOL: {
    id: 'VOL',
    name: 'Volante',
    fullName: 'Volante Defensivo',
    sector: 'Meio-campo',
    description: 'Combate no meio-campo, interceptações e início da transição ofensiva.',
  },
  MC: {
    id: 'MC',
    name: 'Meio-campista',
    fullName: 'Meio-campista Central',
    sector: 'Meio-campo',
    description: 'Dinamismo, distribuição de passes e articulação campo a campo.',
  },
  MEI: {
    id: 'MEI',
    name: 'Meia-Atacante',
    fullName: 'Meia de Criação',
    sector: 'Meio-campo',
    description: 'Criatividade, passes em profundidade e chegada perigosa ao ataque.',
  },
  PE: {
    id: 'PE',
    name: 'Ponta-Esquerda',
    fullName: 'Ponta-Esquerda',
    sector: 'Ataque',
    description: 'Aceleração pelo corredor esquerdo, fintas para o meio e chutes colocados.',
  },
  PD: {
    id: 'PD',
    name: 'Ponta-Direita',
    fullName: 'Ponta-Direita',
    sector: 'Ataque',
    description: 'Velocidade pela ponta direita, amplitude tática e assistências precisas.',
  },
  ATA: {
    id: 'ATA',
    name: 'Atacante',
    fullName: 'Centroavante / Atacante',
    sector: 'Ataque',
    description: 'Poder de fogo, presença na área adversária e finalizações decisivas.',
  },
};
