/**
 * AURA Football - Engine: Validação de Regras e Integridade de Dados
 */

import { POSITION_IDS } from '../data/positions';
import { ATTRIBUTE_IDS } from '../data/attributes';
import { PositionId, AttributeId, PlayerAttributes, Career } from '../types';
import { AURA_MIN, AURA_MAX } from './aura';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valida se uma posição é exatamente uma das 10 oficiais
 */
export function isValidPosition(value: unknown): value is PositionId {
  return typeof value === 'string' && POSITION_IDS.includes(value as PositionId);
}

/**
 * Valida se um atributo é um dos 6 oficiais
 */
export function isValidAttribute(value: unknown): value is AttributeId {
  return typeof value === 'string' && ATTRIBUTE_IDS.includes(value as AttributeId);
}

/**
 * Valida se o valor de atributo está no limite oficial (1 a 100) do AURA Football
 */
export function isValidAttributeValue(val: unknown): boolean {
  return typeof val === 'number' && !isNaN(val) && val >= 1 && val <= 100;
}

/**
 * Valida se o saldo de Fichas é válido (inteiro não negativo)
 */
export function isValidFichas(val: unknown): boolean {
  return typeof val === 'number' && !isNaN(val) && val >= 0 && Number.isInteger(val);
}

/**
 * Valida se o valor de AURA é válido (escala oficial 0 a 100)
 */
export function isValidAura(val: unknown): boolean {
  return typeof val === 'number' && !isNaN(val) && val >= AURA_MIN && val <= AURA_MAX;
}

/**
 * Valida a integridade do objeto de atributos do jogador
 */
export function validatePlayerAttributes(attrs: unknown): attrs is PlayerAttributes {
  if (!attrs || typeof attrs !== 'object') return false;
  const typed = attrs as Record<string, unknown>;

  for (const attr of ATTRIBUTE_IDS) {
    if (!isValidAttributeValue(typed[attr])) {
      return false;
    }
  }
  return true;
}

/**
 * Valida um objeto de Carreira completo
 */
export function validateCareer(career: unknown): ValidationResult {
  const errors: string[] = [];
  if (!career || typeof career !== 'object') {
    return { isValid: false, errors: ['Carreira inválida ou vazia'] };
  }

  const c = career as Partial<Career>;

  if (!c.id || typeof c.id !== 'string') errors.push('ID da carreira ausente ou inválido');
  if (!c.player) errors.push('Dados do jogador ausentes');
  if (!c.club) errors.push('Dados do clube ausentes');
  if (!c.season) errors.push('Dados da temporada ausentes');
  if (!c.currency) errors.push('Dados de moeda (Fichas) ausentes');

  if (c.player) {
    if (!c.player.name || c.player.name.trim().length === 0) {
      errors.push('Nome do jogador não pode ser vazio');
    }
    if (!isValidPosition(c.player.position)) {
      errors.push(`Posição '${c.player.position}' inválida`);
    }
    if (!validatePlayerAttributes(c.player.attributes)) {
      errors.push('Atributos do jogador contêm valores fora da faixa 1-99');
    }
    if (typeof c.player.ovr !== 'number' || c.player.ovr < 1 || c.player.ovr > 100) {
      errors.push('OVR do jogador deve estar entre 1 e 100');
    }
    if (typeof c.player.aura !== 'number' || c.player.aura < 0 || c.player.aura > 100) {
      errors.push('AURA deve estar entre 0 e 100');
    }
  }

  if (c.currency && !isValidFichas(c.currency.fichas)) {
    errors.push('Saldo de Fichas inválido ou negativo');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
