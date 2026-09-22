/**
 * AURA Football - Utilitários de Formatação
 */

import { PositionId, AttributeId } from '../types';
import { POSITIONS_DATA } from '../data/positions';
import { ATTRIBUTES_DATA } from '../data/attributes';

/**
 * Retorna o nome por extenso da posição
 */
export function getPositionName(pos: PositionId): string {
  return POSITIONS_DATA[pos]?.name || pos;
}

/**
 * Retorna o setor da posição (Defesa, Meio-campo, Ataque, etc.)
 */
export function getPositionSector(pos: PositionId): string {
  return POSITIONS_DATA[pos]?.sector || 'Campo';
}

/**
 * Retorna o nome por extenso do atributo
 */
export function getAttributeName(attr: AttributeId): string {
  return ATTRIBUTES_DATA[attr]?.name || attr;
}

/**
 * Retorna formatação de moeda para Fichas
 */
export function formatFichas(amount: number): string {
  return new Intl.NumberFormat('pt-BR').format(amount);
}
