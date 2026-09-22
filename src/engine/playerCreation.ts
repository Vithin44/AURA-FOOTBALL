/**
 * AURA Football - Engine de Criação e Validação de Jogador (Prompt 04)
 * Validações rigorosas na lógica e fábrica do objeto Player.
 */

import {
  Player,
  PositionId,
  PlayerAvatar,
  Club,
} from '../types';
import { createInitialAttributes } from './attributes';

export interface PlayerCreationInput {
  firstName: string;
  lastName: string;
  displayName?: string;
  kitNumber: number;
  position: PositionId;
  avatar: PlayerAvatar;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validação rigorosa na camada lógica do formulário de criação
 */
export function validatePlayerCreation(input: PlayerCreationInput): ValidationResult {
  const errors: Record<string, string> = {};

  // 1. Validação de Nome
  const trimmedFirst = (input.firstName || '').trim();
  if (!trimmedFirst) {
    errors.firstName = 'O nome do atleta é obrigatório.';
  } else if (trimmedFirst.length < 2) {
    errors.firstName = 'O nome deve ter pelo menos 2 caracteres.';
  } else if (trimmedFirst.length > 20) {
    errors.firstName = 'O nome não pode ter mais de 20 caracteres.';
  }

  // Sobrenome
  const trimmedLast = (input.lastName || '').trim();
  if (trimmedLast.length > 25) {
    errors.lastName = 'O sobrenome não pode ter mais de 25 caracteres.';
  }

  // 2. Validação do Número da Camisa (1–99)
  const num = input.kitNumber;
  if (!Number.isInteger(num)) {
    errors.kitNumber = 'O número deve ser um número inteiro.';
  } else if (num < 1 || num > 99) {
    errors.kitNumber = 'O número da camisa deve estar entre 1 e 99.';
  }

  // 3. Validação de Posição
  const validPositions: PositionId[] = [
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
  ];

  if (!input.position || !validPositions.includes(input.position)) {
    errors.position = 'Posição inválida. Escolha uma das 10 posições oficiais.';
  }

  // 4. Validação de Avatar
  if (!input.avatar) {
    errors.avatar = 'Dados do avatar são obrigatórios.';
  } else {
    if (!input.avatar.skinTone || input.avatar.skinTone < 1 || input.avatar.skinTone > 6) {
      errors.avatarSkin = 'Tom de pele inválido.';
    }
    if (!input.avatar.hairStyle) {
      errors.avatarHair = 'Estilo de cabelo é obrigatório.';
    }
    if (!input.avatar.bootsColor) {
      errors.avatarBoots = 'Cor da chuteira é obrigatória.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Clube inicial provisório para teste de fluxo (conforme item 10 da especificação)
 */
export const PROVISIONAL_CLUB: Club = {
  id: 'club_paulista_fc',
  name: 'Paulista FC',
  shortName: 'PFC',
  country: 'Brasil',
  league: 'Série B Nacional',
  primaryColor: '#B7FF3C',
  secondaryColor: '#111313',
  ovr: 72,
  stadium: 'Arena Colina',
  prestige: 'Médio',
};

/**
 * Fábrica de criação de novo Player compatível com a arquitetura
 */
export function createNewPlayer(input: PlayerCreationInput): Player {
  const validation = validatePlayerCreation(input);
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0];
    throw new Error(`Falha na validação de criação: ${firstError}`);
  }

  const firstName = input.firstName.trim();
  const lastName = (input.lastName || '').trim();
  const fullName = lastName ? `${firstName} ${lastName}` : firstName;
  const displayName = (input.displayName || '').trim() || firstName;

  // Atributos base equilibrados e calculados estritamente pela Engine oficial (Prompt 05)
  const baseAttributes = createInitialAttributes(input.position);

  return {
    id: `player_${Date.now()}`,
    name: fullName,
    firstName,
    lastName,
    displayName,
    nickname: displayName !== fullName ? displayName : undefined,
    age: 18,
    country: 'Brasil',
    position: input.position,
    kitNumber: input.kitNumber,
    attributes: baseAttributes,
    ovr: 65, // OVR provisório neutro até o Prompt 06
    aura: 50, // AURA inicial padrão
    xp: 0,
    level: 1,
    status: 'Disponível',
    influence: 10,
    prestige: 'Promessa',
    contract: {
      clubId: PROVISIONAL_CLUB.id,
      salary: 50,
      yearsRemaining: 2,
    },
    avatar: {
      ...input.avatar,
    },
    stats: {
      matches: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      averageRating: 0,
      yellowCards: 0,
      redCards: 0,
    },
  };
}
