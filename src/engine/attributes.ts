/**
 * AURA Football - Engine Central de Atributos (Prompt 05)
 * Regras estritas: exatamente 6 atributos, escala 1–100, validação e funções puras.
 */

import {
  AttributeId,
  PlayerAttributes,
  Player,
  PositionId,
} from '../types';
import { ATTRIBUTE_IDS, ATTRIBUTES_DATA, POSITION_ATTRIBUTE_PROFILES } from '../data/attributes';

/**
 * Limita e sanitiza qualquer valor de atributo para a escala estrita [1, 100].
 * Garante que:
 * - Mínimo = 1
 * - Máximo = 100
 * - Valores não-numéricos, NaN ou infinitos são corrigidos para 1
 * - Decimais são arredondados para números inteiros
 */
export function clampAttribute(value: number): number {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return 1;
  }
  const rounded = Math.round(value);
  if (rounded < 1) return 1;
  if (rounded > 100) return 100;
  return rounded;
}

/**
 * Verifica em tempo de execução se uma string é um dos 6 IDs oficiais de atributo.
 */
export function isAttributeId(key: string): key is AttributeId {
  return (ATTRIBUTE_IDS as readonly string[]).includes(key);
}

/**
 * Obtém o valor atual de um atributo do jogador com garantia de clamp.
 */
export function getAttribute(player: Player, attribute: AttributeId): number {
  if (!player || !player.attributes) {
    return 1;
  }
  const val = player.attributes[attribute];
  return clampAttribute(val);
}

/**
 * Atualiza um atributo específico do jogador de forma pura e imutável.
 * O valor atribuído passa obrigatoriamente pela validação clampAttribute (1–100).
 */
export function setAttribute(
  player: Player,
  attribute: AttributeId,
  value: number
): Player {
  const safeValue = clampAttribute(value);
  return {
    ...player,
    attributes: {
      ...player.attributes,
      [attribute]: safeValue,
    },
  };
}

/**
 * Incrementa ou decrementa um atributo em delta pontos (positivo ou negativo).
 * O resultado final é sempre limitado entre 1 e 100.
 */
export function modifyAttribute(
  player: Player,
  attribute: AttributeId,
  delta: number
): Player {
  const current = getAttribute(player, attribute);
  return setAttribute(player, attribute, current + delta);
}

/**
 * Distribuição inicial de atributos equilibrada para atleta jovem em desenvolvimento (Prompt 05, Item 3).
 * Os valores refletem o perfil da posição de partida sem valores extremos.
 * Todos os valores passam pela garantia de clamp (1–100).
 */
export function createInitialAttributes(
  position: PositionId,
  modifiers?: Partial<PlayerAttributes>
): PlayerAttributes {
  // Valores base de atleta em formação (faixa 40–72)
  const baseByPosition: Record<PositionId, PlayerAttributes> = {
    GOL: { VEL: 54, FIN: 20, DRI: 35, FOR: 64, PAS: 55, DEF: 68 },
    ZAG: { VEL: 58, FIN: 32, DRI: 48, FOR: 70, PAS: 58, DEF: 72 },
    LE:  { VEL: 72, FIN: 48, DRI: 64, FOR: 58, PAS: 66, DEF: 64 },
    LD:  { VEL: 72, FIN: 48, DRI: 64, FOR: 58, PAS: 66, DEF: 64 },
    VOL: { VEL: 60, FIN: 48, DRI: 60, FOR: 68, PAS: 68, DEF: 70 },
    MC:  { VEL: 62, FIN: 56, DRI: 66, FOR: 60, PAS: 72, DEF: 58 },
    MEI: { VEL: 66, FIN: 64, DRI: 72, FOR: 54, PAS: 74, DEF: 44 },
    PE:  { VEL: 74, FIN: 66, DRI: 72, FOR: 52, PAS: 62, DEF: 38 },
    PD:  { VEL: 74, FIN: 66, DRI: 72, FOR: 52, PAS: 62, DEF: 38 },
    ATA: { VEL: 68, FIN: 72, DRI: 65, FOR: 66, PAS: 56, DEF: 34 },
  };

  const template = baseByPosition[position] || baseByPosition.ATA;

  const result: PlayerAttributes = {
    VEL: clampAttribute(modifiers?.VEL ?? template.VEL),
    FIN: clampAttribute(modifiers?.FIN ?? template.FIN),
    DRI: clampAttribute(modifiers?.DRI ?? template.DRI),
    FOR: clampAttribute(modifiers?.FOR ?? template.FOR),
    PAS: clampAttribute(modifiers?.PAS ?? template.PAS),
    DEF: clampAttribute(modifiers?.DEF ?? template.DEF),
  };

  return result;
}

/**
 * Validação profunda de um objeto de atributos (Item 12: Segurança dos Dados).
 * Rejeita objetos com campos extras, valores fora do padrão ou ausentes,
 * e gera um objeto sanitizado estritamente contendo apenas os 6 atributos oficiais.
 */
export function validateAttributes(raw: unknown): {
  isValid: boolean;
  errors: string[];
  sanitized: PlayerAttributes;
} {
  const errors: string[] = [];

  if (!raw || typeof raw !== 'object') {
    return {
      isValid: false,
      errors: ['O objeto de atributos é nulo ou inválido.'],
      sanitized: { VEL: 50, FIN: 50, DRI: 50, FOR: 50, PAS: 50, DEF: 50 },
    };
  }

  const record = raw as Record<string, unknown>;

  // Verifica se todos os 6 atributos oficiais existem
  for (const id of ATTRIBUTE_IDS) {
    if (!(id in record)) {
      errors.push(`Atributo obrigatório ausente: ${id}`);
    } else {
      const val = record[id];
      if (typeof val !== 'number' || Number.isNaN(val)) {
        errors.push(`Atributo ${id} deve ser um número válido.`);
      } else if (val < 1 || val > 100) {
        errors.push(`Atributo ${id} (${val}) está fora da escala 1–100.`);
      }
    }
  }

  // Verifica se nenhum atributo adicional não-oficial foi adicionado acidentalmente
  const keys = Object.keys(record);
  for (const key of keys) {
    if (!isAttributeId(key)) {
      errors.push(`Atributo não-oficial detectado e proibido: "${key}".`);
    }
  }

  // Objeto sanitizado: estritamente os 6 atributos com clamp garantido
  const sanitized: PlayerAttributes = {
    VEL: clampAttribute(typeof record.VEL === 'number' ? record.VEL : 50),
    FIN: clampAttribute(typeof record.FIN === 'number' ? record.FIN : 50),
    DRI: clampAttribute(typeof record.DRI === 'number' ? record.DRI : 50),
    FOR: clampAttribute(typeof record.FOR === 'number' ? record.FOR : 50),
    PAS: clampAttribute(typeof record.PAS === 'number' ? record.PAS : 50),
    DEF: clampAttribute(typeof record.DEF === 'number' ? record.DEF : 50),
  };

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * ====================================================
 * SUÍTE DE TESTES UNITÁRIOS DO PROMPT 05 (Item 13)
 * ====================================================
 * Executa os 7 casos de teste obrigatórios e retorna o relatório detalhado.
 */
export interface AttributeTestCaseResult {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
  details?: string;
}

export function runAttributeTests(): AttributeTestCaseResult[] {
  const results: AttributeTestCaseResult[] = [];

  // Caso 1: Atributo 50 permanece 50
  const c1 = clampAttribute(50);
  results.push({
    id: 'case_1',
    name: 'Caso 1: Valor Médio',
    description: 'Atributo 50 permanece 50',
    passed: c1 === 50,
    expected: 50,
    actual: c1,
  });

  // Caso 2: Atributo 100 permanece 100
  const c2 = clampAttribute(100);
  results.push({
    id: 'case_2',
    name: 'Caso 2: Limite Máximo Exato',
    description: 'Atributo 100 permanece 100',
    passed: c2 === 100,
    expected: 100,
    actual: c2,
  });

  // Caso 3: Atributo 101 é limitado para 100
  const c3 = clampAttribute(101);
  results.push({
    id: 'case_3',
    name: 'Caso 3: Overflow Superior',
    description: 'Atributo 101 é limitado para 100',
    passed: c3 === 100,
    expected: 100,
    actual: c3,
  });

  // Caso 4: Atributo 0 é corrigido para 1
  const c4 = clampAttribute(0);
  results.push({
    id: 'case_4',
    name: 'Caso 4: Zero Proibido',
    description: 'Atributo 0 é corrigido para 1',
    passed: c4 === 1,
    expected: 1,
    actual: c4,
  });

  // Caso 5: Atributo negativo é corrigido/rejeitado
  const c5a = clampAttribute(-10);
  const c5b = clampAttribute(-20);
  const passed5 = c5a === 1 && c5b === 1;
  results.push({
    id: 'case_5',
    name: 'Caso 5: Valor Negativo',
    description: 'Atributo negativo (-10 e -20) é corrigido para 1',
    passed: passed5,
    expected: 1,
    actual: `c(-10)=${c5a}, c(-20)=${c5b}`,
  });

  // Caso 6: Todos os seis atributos existem
  const initial = createInitialAttributes('ATA');
  const initialKeys = Object.keys(initial);
  const hasAllSix =
    initialKeys.length === 6 &&
    ATTRIBUTE_IDS.every((id) => typeof initial[id] === 'number');
  results.push({
    id: 'case_6',
    name: 'Caso 6: Existência dos 6 Atributos',
    description: 'Todos os seis atributos oficiais (VEL, FIN, DRI, FOR, PAS, DEF) existem',
    passed: hasAllSix,
    expected: ['VEL', 'FIN', 'DRI', 'FOR', 'PAS', 'DEF'].sort(),
    actual: initialKeys.sort(),
  });

  // Caso 7: Nenhum atributo adicional é criado acidentalmente
  const invalidPayload = {
    VEL: 70,
    FIN: 65,
    DRI: 68,
    FOR: 60,
    PAS: 70,
    DEF: 50,
    resistencia: 80, // Proibido!
    aceleracao: 90,  // Proibido!
  };
  const validation = validateAttributes(invalidPayload);
  const sanitizedKeys = Object.keys(validation.sanitized);
  const noExtraKeys =
    sanitizedKeys.length === 6 &&
    !sanitizedKeys.includes('resistencia') &&
    !sanitizedKeys.includes('aceleracao') &&
    !validation.isValid && // A validação deve rejeitar o payload que tem extras
    validation.errors.some((e) => e.includes('resistencia'));

  results.push({
    id: 'case_7',
    name: 'Caso 7: Rejeição de Atributos Não Oficiais',
    description: 'Nenhum atributo adicional (ex: resistência, aceleração) é aceito',
    passed: noExtraKeys,
    expected: 'Rejeitado com erro e sanitizado para exatamente 6 atributos',
    actual: validation.isValid ? 'Aceito incorretamente' : 'Rejeitado e sanitizado com sucesso',
    details: validation.errors.join('; '),
  });

  return results;
}
