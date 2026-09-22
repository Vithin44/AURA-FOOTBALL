/**
 * AURA Football - Engine Central de OVR (Prompt 06)
 * Cálculo automático, posicional e determinístico do Overall do jogador.
 * Fonte única de verdade: posição principal + 6 atributos ponderados.
 */

import { PlayerAttributes, PositionId, Player } from '../types';
import { POSITION_OVR_WEIGHTS } from '../data/attributes';
import { POSITION_IDS } from '../data/positions';
import { clampAttribute } from './attributes';

/**
 * Calcula o OVR (Overall) oficial do atleta a partir de seus 6 atributos e sua posição.
 *
 * Fórmula Oficial:
 * OVR = (VEL × pesoVEL + FIN × pesoFIN + DRI × pesoDRI + FOR × pesoFOR + PAS × pesoPAS + DEF × pesoDEF) / 100
 *
 * Regras Estritas:
 * - Cada atributo é garantido na escala 1–100 via clampAttribute.
 * - Os pesos são definidos pela posição oficial e somam exatamente 100%.
 * - O resultado é arredondado para o inteiro mais próximo (Math.round).
 * - O valor final é limitado rigorosamente entre 0 e 100.
 * - Valores NaN, nulos ou posições inválidas nunca quebram a aplicação.
 */
export function calculateOVR(
  attributes: PlayerAttributes,
  position: PositionId
): number {
  // Proteção contra posição inválida ou nula
  const weights = POSITION_OVR_WEIGHTS[position];
  if (!weights) {
    return 50; // Fallback seguro
  }

  // Sanitização rigorosa de cada um dos 6 atributos oficiais (escala 1–100)
  const safeVEL = clampAttribute(attributes?.VEL);
  const safeFIN = clampAttribute(attributes?.FIN);
  const safeDRI = clampAttribute(attributes?.DRI);
  const safeFOR = clampAttribute(attributes?.FOR);
  const safePAS = clampAttribute(attributes?.PAS);
  const safeDEF = clampAttribute(attributes?.DEF);

  // Média ponderada oficial
  const weightedSum =
    safeVEL * weights.VEL +
    safeFIN * weights.FIN +
    safeDRI * weights.DRI +
    safeFOR * weights.FOR +
    safePAS * weights.PAS +
    safeDEF * weights.DEF;

  const rawOVR = weightedSum / 100;

  // Arredondamento para o inteiro mais próximo
  const rounded = Math.round(rawOVR);

  // Garantia estrita de limite entre 0 e 100
  if (Number.isNaN(rounded) || !Number.isFinite(rounded)) {
    return 1;
  }

  return Math.max(0, Math.min(100, rounded));
}

/**
 * Sincroniza o campo `ovr` do jogador de forma pura e imutável.
 * Mantém consistência absoluta entre player.attributes, player.position e player.ovr.
 */
export function syncPlayerOVR(player: Player): Player {
  if (!player) return player;
  const newOVR = calculateOVR(player.attributes, player.position);
  if (player.ovr === newOVR) {
    return player;
  }
  return {
    ...player,
    ovr: newOVR,
  };
}

/**
 * Estrutura para os relatórios da suíte de testes de OVR
 */
export interface OVRTestCaseResult {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  expected: unknown;
  actual: unknown;
  details?: string;
}

/**
 * Suíte de Testes Automatizada do OVR (Prompt 06, Item 7)
 * Cobre os 9 casos obrigatórios de validação técnica do sistema de OVR.
 */
export function runOVRTests(): OVRTestCaseResult[] {
  const results: OVRTestCaseResult[] = [];

  // Teste 1: Atributos baixos
  const lowAttrs: PlayerAttributes = { VEL: 1, FIN: 1, DRI: 1, FOR: 1, PAS: 1, DEF: 1 };
  const ovrLow = calculateOVR(lowAttrs, 'ATA');
  results.push({
    id: 'ovr_case_1',
    name: '1. Atributos Baixos',
    description: 'Atributos no valor mínimo (todos 1) geram OVR 1',
    passed: ovrLow === 1,
    expected: 1,
    actual: ovrLow,
  });

  // Teste 2: Atributos altos
  const maxAttrs: PlayerAttributes = { VEL: 100, FIN: 100, DRI: 100, FOR: 100, PAS: 100, DEF: 100 };
  const ovrMax = calculateOVR(maxAttrs, 'MEI');
  results.push({
    id: 'ovr_case_2',
    name: '2. Atributos Altos',
    description: 'Atributos no valor máximo (todos 100) geram OVR 100',
    passed: ovrMax === 100,
    expected: 100,
    actual: ovrMax,
  });

  // Teste 3: Atributos iguais
  const equalAttrs: PlayerAttributes = { VEL: 70, FIN: 70, DRI: 70, FOR: 70, PAS: 70, DEF: 70 };
  const equalOVRs = POSITION_IDS.map((pos) => calculateOVR(equalAttrs, pos));
  const allEqual70 = equalOVRs.every((val) => val === 70);
  results.push({
    id: 'ovr_case_3',
    name: '3. Atributos Iguais',
    description: 'Atributos uniformes (todos 70) resultam em OVR exatamente 70 em todas as 10 posições',
    passed: allEqual70,
    expected: '70 em todas as 10 posições',
    actual: allEqual70 ? '70 em todas' : equalOVRs.join(', '),
  });

  // Teste 4: Cada uma das 10 posições oficiais calcula com sucesso
  const testSampleAttrs: PlayerAttributes = { VEL: 75, FIN: 60, DRI: 68, FOR: 70, PAS: 72, DEF: 65 };
  const posCalculations = POSITION_IDS.map((pos) => ({
    pos,
    ovr: calculateOVR(testSampleAttrs, pos),
  }));
  const allTenValid = posCalculations.every((c) => typeof c.ovr === 'number' && c.ovr >= 1 && c.ovr <= 100);
  results.push({
    id: 'ovr_case_4',
    name: '4. Cada uma das 10 Posições Oficiais',
    description: 'Todas as 10 posições (GOL, ZAG, LE, LD, VOL, MC, MEI, PE, PD, ATA) executam o cálculo sem falhas',
    passed: allTenValid,
    expected: '10 posições válidas calculadas',
    actual: allTenValid ? '10/10 calculadas com sucesso' : 'Falha em alguma posição',
    details: posCalculations.map((c) => `${c.pos}:${c.ovr}`).join(', '),
  });

  // Teste 5: Alteração de posição (mesma distribuição de atributos produz OVRs diferentes em posições diferentes)
  // Perfil tipicamente atacante: Alta VEL e FIN, baixa DEF
  const strikerProfile: PlayerAttributes = { VEL: 85, FIN: 88, DRI: 82, FOR: 70, PAS: 65, DEF: 25 };
  const ovrStrikerAsATA = calculateOVR(strikerProfile, 'ATA');
  const ovrStrikerAsZAG = calculateOVR(strikerProfile, 'ZAG');
  const ovrStrikerAsGOL = calculateOVR(strikerProfile, 'GOL');
  const positionDependent =
    ovrStrikerAsATA > ovrStrikerAsZAG && ovrStrikerAsATA > ovrStrikerAsGOL;
  results.push({
    id: 'ovr_case_5',
    name: '5. Prova de Cálculo Posicional',
    description: 'A mesma distribuição de atributos produz OVRs diferentes em posições diferentes (ATA vs ZAG vs GOL)',
    passed: positionDependent,
    expected: 'ATA > ZAG e ATA > GOL',
    actual: `ATA=${ovrStrikerAsATA}, ZAG=${ovrStrikerAsZAG}, GOL=${ovrStrikerAsGOL}`,
    details: `Diferença entre ATA e ZAG com os mesmos atributos: ${ovrStrikerAsATA - ovrStrikerAsZAG} pontos de OVR`,
  });

  // Teste 6: Alteração de atributo (subir atributo crítico eleva o OVR)
  const baseMC: PlayerAttributes = { VEL: 60, FIN: 50, DRI: 65, FOR: 60, PAS: 60, DEF: 60 };
  const ovrMCBase = calculateOVR(baseMC, 'MC');
  // Subir PAS em +30 (PAS tem 30% de peso no MC -> deve subir aprox 9 pontos de OVR)
  const boostedMC: PlayerAttributes = { ...baseMC, PAS: 90 };
  const ovrMCBoosted = calculateOVR(boostedMC, 'MC');
  const attributeImpact = ovrMCBoosted > ovrMCBase;
  results.push({
    id: 'ovr_case_6',
    name: '6. Alteração de Atributo Relevante',
    description: 'Aumentar o Passe de um Meio-Campista (peso 30%) eleva sensivelmente seu OVR',
    passed: attributeImpact,
    expected: 'OVR Boosted > OVR Base',
    actual: `Base=${ovrMCBase} → Boosted=${ovrMCBoosted} (+${ovrMCBoosted - ovrMCBase})`,
  });

  // Teste 7: Valores inválidos (NaN, negativos, extremos, undefined)
  const invalidAttrs = {
    VEL: NaN,
    FIN: -50,
    DRI: 150,
    FOR: null as unknown as number,
    PAS: undefined as unknown as number,
    DEF: 80,
  } as PlayerAttributes;
  const ovrInvalid = calculateOVR(invalidAttrs, 'ZAG');
  const invalidHandled = !Number.isNaN(ovrInvalid) && ovrInvalid >= 0 && ovrInvalid <= 100;
  results.push({
    id: 'ovr_case_7',
    name: '7. Tratamento de Valores Inválidos',
    description: 'Valores inválidos (NaN, negativos, null, >100) são sanitizados sem travar a engine',
    passed: invalidHandled,
    expected: 'Número válido entre 0 e 100',
    actual: ovrInvalid,
  });

  // Teste 8: Confirmação de que todos os pesos somam exatamente 100 em todas as 10 posições
  const weightSums = POSITION_IDS.map((pos) => {
    const w = POSITION_OVR_WEIGHTS[pos];
    const sum = w.VEL + w.FIN + w.DRI + w.FOR + w.PAS + w.DEF;
    return { pos, sum };
  });
  const allSum100 = weightSums.every((ws) => ws.sum === 100);
  results.push({
    id: 'ovr_case_8',
    name: '8. Soma dos Pesos = 100%',
    description: 'Confirmação matemática de que os pesos de cada uma das 10 posições somam exatamente 100%',
    passed: allSum100,
    expected: '100% em todas as 10 posições',
    actual: allSum100 ? '100% em todas' : weightSums.map((ws) => `${ws.pos}:${ws.sum}`).join(', '),
  });

  // Teste 9: Confirmação de que o resultado sempre fica entre 0 e 100
  const randomTests = [
    calculateOVR({ VEL: 1, FIN: 1, DRI: 1, FOR: 1, PAS: 1, DEF: 1 }, 'GOL'),
    calculateOVR({ VEL: 100, FIN: 100, DRI: 100, FOR: 100, PAS: 100, DEF: 100 }, 'ATA'),
    calculateOVR({ VEL: 50, FIN: 99, DRI: 33, FOR: 88, PAS: 12, DEF: 77 }, 'LE'),
    calculateOVR({ VEL: 0, FIN: 200, DRI: -10, FOR: 999, PAS: NaN, DEF: 50 }, 'VOL'),
  ];
  const allInRange = randomTests.every((v) => typeof v === 'number' && v >= 0 && v <= 100);
  results.push({
    id: 'ovr_case_9',
    name: '9. Limites Finais (0 a 100)',
    description: 'Garante que o resultado final do OVR sempre reside no intervalo fechado [0, 100]',
    passed: allInRange,
    expected: 'Todos entre 0 e 100',
    actual: allInRange ? 'Confirmado para todos os testes' : randomTests.join(', '),
  });

  return results;
}
