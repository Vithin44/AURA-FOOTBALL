/**
 * AURA Football - Engine Central de AURA do Jogador (Prompt 07)
 * Representa o estado momentâneo de desempenho e confiança do atleta.
 * Escala estrita: 0 até 100. Valor inicial neutro: 50.
 *
 * REGRAS INVIOLÁVEIS:
 * - A AURA NUNCA altera o OVR do atleta.
 * - A AURA NUNCA altera os 6 atributos oficiais (VEL, FIN, DRI, FOR, PAS, DEF).
 * - A AURA NUNCA altera XP, Nível, Influência, Prestígio ou Contrato.
 * - Termo oficial: "AURA do jogador" (nunca "Momentum").
 */

import { Player } from '../types';

// ====================================================
// CONSTANTES OFICIAIS CENTRALIZADAS (Prompt 07, Item 2)
// ====================================================
export const AURA_MIN = 0;
export const AURA_MAX = 100;
export const AURA_DEFAULT = 50;

/**
 * Estrutura simples para representar o registro/origem de uma alteração de AURA.
 * Preparada para o futuro motor de partidas e decisões (Prompt 07, Item 9).
 */
export interface AuraModificationRecord {
  delta: number;
  reason?: string;
  previousAura: number;
  newAura: number;
  timestamp: number;
}

/**
 * Níveis de intensidade momentânea da AURA.
 */
export type AuraIntensity = 'Baixa' | 'Estável' | 'Alta';

export interface AuraStatusInfo {
  level: AuraIntensity;
  label: string;
  description: string;
  color: string;
}

/**
 * Limita e sanitiza qualquer valor de AURA para a escala oficial [0, 100].
 * - Impede valores abaixo de 0 (clamp para 0).
 * - Impede valores acima de 100 (clamp para 100).
 * - Arredonda decimais para inteiros (Math.round).
 * - Valores não-numéricos, NaN ou infinitos são corrigidos para AURA_DEFAULT.
 */
export function clampAura(value: number): number {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return AURA_DEFAULT;
  }
  const rounded = Math.round(value);
  return Math.max(AURA_MIN, Math.min(AURA_MAX, rounded));
}

/**
 * Altera exclusivamente a AURA do jogador de forma pura e imutável.
 * NÃO modifica: atributos, OVR, XP, nível, influência, prestígio, posição, etc.
 */
export function setAura(
  player: Player,
  value: number,
  _reason?: string
): Player {
  if (!player) return player;
  const safeAura = clampAura(value);

  return {
    ...player,
    aura: safeAura,
  };
}

/**
 * Modifica a AURA do jogador de forma relativa (delta positivo ou negativo).
 * Respeita obrigatoriamente os limites estritos [0, 100].
 * NÃO altera atributos, OVR, XP, nível, influência ou dados contratuais.
 */
export function modifyAura(
  player: Player,
  delta: number,
  _reason?: string
): Player {
  if (!player) return player;
  const currentAura = clampAura(player.aura);
  const safeDelta = typeof delta === 'number' && Number.isFinite(delta) ? Math.round(delta) : 0;
  const newAura = clampAura(currentAura + safeDelta);

  return {
    ...player,
    aura: newAura,
  };
}

/**
 * Restaura a AURA do jogador para o padrão neutro oficial (50).
 * Usado na inicialização de novas partidas ou resets de estado.
 */
export function resetAura(
  player: Player,
  _reason = 'Reset para padrão de início de partida'
): Player {
  if (!player) return player;

  return {
    ...player,
    aura: AURA_DEFAULT,
  };
}

/**
 * Retorna metadados visuais e táticos do estado de AURA atual.
 * Útil para feedback na interface e indicadores de intensidade.
 */
export function getAuraStatus(auraValue: number): AuraStatusInfo {
  const safe = clampAura(auraValue);
  if (safe <= 35) {
    return {
      level: 'Baixa',
      label: 'Sob Pressão',
      description: 'Confiança abalada no momento; momento de instabilidade emocional ou técnica.',
      color: '#8B918E',
    };
  }
  if (safe <= 65) {
    return {
      level: 'Estável',
      label: 'Equilibrado',
      description: 'Estado mental e técnico equilibrado; concentração estável para o jogo.',
      color: '#F4F5F2',
    };
  }
  return {
    level: 'Alta',
    label: 'Confiante',
    description: 'Excelente momento de desempenho; confiança elevada nas tomadas de decisão.',
    color: '#B7FF3C',
  };
}

// ====================================================
// SUÍTE DE TESTES UNITÁRIOS OFICIAIS (Prompt 07, Item 12)
// ====================================================
export interface AuraTestCaseResult {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
  details?: string;
}

/**
 * Executa os 14 casos de teste estritos do Sistema de AURA.
 */
export function runAuraTests(): AuraTestCaseResult[] {
  const results: AuraTestCaseResult[] = [];

  // Helper para criar um atleta de teste isolado
  const createMockPlayer = (aura = 50): Player => ({
    id: 'mock_player',
    name: 'Atleta Teste',
    nickname: 'Craque',
    age: 18,
    country: 'Brasil',
    position: 'ATA',
    kitNumber: 9,
    attributes: {
      VEL: 80,
      FIN: 85,
      DRI: 82,
      FOR: 70,
      PAS: 65,
      DEF: 30,
    },
    ovr: 78,
    aura,
    xp: 250,
    level: 3,
    status: 'Disponível',
    influence: 45,
    prestige: 'Promessa',
    contract: {
      clubId: 'mock_club',
      salary: 1000,
      yearsRemaining: 2,
    },
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
  });

  // Teste 1: AURA padrão = 50
  results.push({
    id: 'aura_test_1',
    name: '1. AURA Padrão Inicial',
    description: 'A constante AURA_DEFAULT deve ser exatamente 50',
    passed: AURA_DEFAULT === 50,
    expected: 50,
    actual: AURA_DEFAULT,
  });

  // Teste 2: clampAura(-10) retorna 0
  const clampNegative = clampAura(-10);
  results.push({
    id: 'aura_test_2',
    name: '2. Underflow clampAura(-10)',
    description: 'clampAura(-10) deve retornar o limite mínimo 0',
    passed: clampNegative === 0,
    expected: 0,
    actual: clampNegative,
  });

  // Teste 3: clampAura(110) retorna 100
  const clampOverflow = clampAura(110);
  results.push({
    id: 'aura_test_3',
    name: '3. Overflow clampAura(110)',
    description: 'clampAura(110) deve retornar o limite máximo 100',
    passed: clampOverflow === 100,
    expected: 100,
    actual: clampOverflow,
  });

  // Teste 4: clampAura(75) retorna 75
  const clampInside = clampAura(75);
  results.push({
    id: 'aura_test_4',
    name: '4. Valor Válido clampAura(75)',
    description: 'clampAura(75) deve retornar exatamente 75 sem alterações',
    passed: clampInside === 75,
    expected: 75,
    actual: clampInside,
  });

  // Teste 5: modifyAura(50, 10) resulta em 60
  const p5 = createMockPlayer(50);
  const modifiedP5 = modifyAura(p5, 10);
  results.push({
    id: 'aura_test_5',
    name: '5. Incremento Relativo (+10)',
    description: 'modifyAura com delta +10 a partir de 50 resulta em 60',
    passed: modifiedP5.aura === 60,
    expected: 60,
    actual: modifiedP5.aura,
  });

  // Teste 6: modifyAura(50, -10) resulta em 40
  const p6 = createMockPlayer(50);
  const modifiedP6 = modifyAura(p6, -10);
  results.push({
    id: 'aura_test_6',
    name: '6. Decremento Relativo (-10)',
    description: 'modifyAura com delta -10 a partir de 50 resulta em 40',
    passed: modifiedP6.aura === 40,
    expected: 40,
    actual: modifiedP6.aura,
  });

  // Teste 7: AURA nunca ultrapassa 100 (ex: 95 + 20 = 100)
  const p7 = createMockPlayer(95);
  const modifiedP7 = modifyAura(p7, 20);
  results.push({
    id: 'aura_test_7',
    name: '7. Teto Máximo Inviolável (95 + 20)',
    description: 'modifyAura(95, 20) é limitado ao teto máximo de 100',
    passed: modifiedP7.aura === 100,
    expected: 100,
    actual: modifiedP7.aura,
  });

  // Teste 8: AURA nunca fica abaixo de 0 (ex: 5 - 20 = 0)
  const p8 = createMockPlayer(5);
  const modifiedP8 = modifyAura(p8, -20);
  results.push({
    id: 'aura_test_8',
    name: '8. Piso Mínimo Inviolável (5 - 20)',
    description: 'modifyAura(5, -20) é limitado ao piso mínimo de 0',
    passed: modifiedP8.aura === 0,
    expected: 0,
    actual: modifiedP8.aura,
  });

  // Teste 9: resetAura() retorna para 50
  const p9 = createMockPlayer(87);
  const resetP9 = resetAura(p9);
  results.push({
    id: 'aura_test_9',
    name: '9. Restauração resetAura()',
    description: 'resetAura() restaura a AURA do atleta para o valor neutro 50',
    passed: resetP9.aura === 50,
    expected: 50,
    actual: resetP9.aura,
  });

  // Teste 10: alterar AURA não altera atributos
  const p10 = createMockPlayer(50);
  const originalAttrs = { ...p10.attributes };
  const p10Boosted = modifyAura(p10, 45);
  const p10Dropped = modifyAura(p10Boosted, -90);
  const attrsUntouched =
    p10Dropped.attributes.VEL === originalAttrs.VEL &&
    p10Dropped.attributes.FIN === originalAttrs.FIN &&
    p10Dropped.attributes.DRI === originalAttrs.DRI &&
    p10Dropped.attributes.FOR === originalAttrs.FOR &&
    p10Dropped.attributes.PAS === originalAttrs.PAS &&
    p10Dropped.attributes.DEF === originalAttrs.DEF;
  results.push({
    id: 'aura_test_10',
    name: '10. Imunidade dos 6 Atributos Oficiais',
    description: 'Alterações bruscas de AURA não modificam os atributos permanentes do atleta',
    passed: attrsUntouched,
    expected: JSON.stringify(originalAttrs),
    actual: JSON.stringify(p10Dropped.attributes),
  });

  // Teste 11: alterar AURA não altera OVR
  const p11 = createMockPlayer(50);
  const originalOVR = p11.ovr;
  const p11BoostedOVR = modifyAura(p11, 40);
  const p11DroppedOVR = modifyAura(p11, -40);
  const ovrUntouched =
    p11BoostedOVR.ovr === originalOVR &&
    p11DroppedOVR.ovr === originalOVR;
  results.push({
    id: 'aura_test_11',
    name: '11. Imunidade do OVR Oficial',
    description: 'O OVR permanece absolutamente idêntico independente da oscilação de AURA',
    passed: ovrUntouched,
    expected: `OVR = ${originalOVR}`,
    actual: `Boosted=${p11BoostedOVR.ovr}, Dropped=${p11DroppedOVR.ovr}`,
  });

  // Teste 12: alterar AURA não altera XP
  const p12 = createMockPlayer(50);
  const originalXP = p12.xp;
  const p12Modified = modifyAura(p12, 25);
  results.push({
    id: 'aura_test_12',
    name: '12. Imunidade de XP',
    description: 'Modificar AURA não interfere no XP do atleta',
    passed: p12Modified.xp === originalXP,
    expected: originalXP,
    actual: p12Modified.xp,
  });

  // Teste 13: alterar AURA não altera nível
  const p13 = createMockPlayer(50);
  const originalLevel = p13.level;
  const p13Modified = modifyAura(p13, -30);
  results.push({
    id: 'aura_test_13',
    name: '13. Imunidade de Nível',
    description: 'Modificar AURA não altera o nível do atleta',
    passed: p13Modified.level === originalLevel,
    expected: originalLevel,
    actual: p13Modified.level,
  });

  // Teste 14: alterar AURA não altera influência
  const p14 = createMockPlayer(50);
  const originalInfluence = p14.influence;
  const p14Modified = setAura(p14, 95);
  results.push({
    id: 'aura_test_14',
    name: '14. Imunidade de Influência',
    description: 'setAura(95) não altera a reputação / influência do atleta',
    passed: p14Modified.influence === originalInfluence,
    expected: originalInfluence,
    actual: p14Modified.influence,
  });

  return results;
}
