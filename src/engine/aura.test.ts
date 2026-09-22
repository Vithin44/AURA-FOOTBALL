/**
 * AURA Football - Testes Automatizados do Sistema de AURA (Prompt 07, Item 12)
 * Validação dos 14 casos de teste obrigatórios sem dependências externas.
 */

import {
  AURA_MIN,
  AURA_MAX,
  AURA_DEFAULT,
  clampAura,
  modifyAura,
  setAura,
  resetAura,
  runAuraTests,
} from './aura';
import { Player } from '../types';

export interface AuraTestReport {
  suiteName: string;
  total: number;
  passed: number;
  failed: number;
  results: { description: string; passed: boolean; error?: string }[];
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Cria um objeto Player isolado para os testes de mutação.
 */
function createMockPlayer(aura = 50): Player {
  return {
    id: 'mock_player_test',
    name: 'Atleta Teste AURA',
    nickname: 'Biel',
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
      clubId: 'club_test',
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
  };
}

export function executePrompt07TestSuite(): AuraTestReport {
  const tests: { description: string; fn: () => void }[] = [
    // 1. AURA padrão = 50
    {
      description: '1. AURA padrão inicial = 50',
      fn: () => {
        assert(AURA_DEFAULT === 50, 'AURA_DEFAULT deve ser 50');
      },
    },

    // 2. clampAura(-10) retorna 0
    {
      description: '2. clampAura(-10) retorna 0',
      fn: () => {
        assert(clampAura(-10) === 0, 'clampAura(-10) deve retornar 0');
      },
    },

    // 3. clampAura(110) retorna 100
    {
      description: '3. clampAura(110) retorna 100',
      fn: () => {
        assert(clampAura(110) === 100, 'clampAura(110) deve retornar 100');
      },
    },

    // 4. clampAura(75) retorna 75
    {
      description: '4. clampAura(75) retorna 75',
      fn: () => {
        assert(clampAura(75) === 75, 'clampAura(75) deve retornar 75');
      },
    },

    // 5. modifyAura(50, 10) resulta em 60
    {
      description: '5. modifyAura(50, 10) resulta em 60',
      fn: () => {
        const p = createMockPlayer(50);
        const modified = modifyAura(p, 10);
        assert(modified.aura === 60, `Esperado 60, obtido ${modified.aura}`);
      },
    },

    // 6. modifyAura(50, -10) resulta em 40
    {
      description: '6. modifyAura(50, -10) resulta em 40',
      fn: () => {
        const p = createMockPlayer(50);
        const modified = modifyAura(p, -10);
        assert(modified.aura === 40, `Esperado 40, obtido ${modified.aura}`);
      },
    },

    // 7. AURA nunca ultrapassa 100 (ex: 95 + 20 = 100)
    {
      description: '7. AURA nunca ultrapassa 100 (95 + 20 = 100)',
      fn: () => {
        const p = createMockPlayer(95);
        const modified = modifyAura(p, 20);
        assert(modified.aura === 100, `Esperado 100, obtido ${modified.aura}`);
        assert(clampAura(150) === 100, 'clampAura(150) deve retornar 100');
      },
    },

    // 8. AURA nunca fica abaixo de 0 (ex: 5 - 20 = 0)
    {
      description: '8. AURA nunca fica abaixo de 0 (5 - 20 = 0)',
      fn: () => {
        const p = createMockPlayer(5);
        const modified = modifyAura(p, -20);
        assert(modified.aura === 0, `Esperado 0, obtido ${modified.aura}`);
        assert(clampAura(-50) === 0, 'clampAura(-50) deve retornar 0');
      },
    },

    // 9. resetAura() retorna para 50
    {
      description: '9. resetAura() restaura para 50',
      fn: () => {
        const pHigh = createMockPlayer(90);
        const pLow = createMockPlayer(15);
        assert(resetAura(pHigh).aura === 50, 'resetAura em 90 deve retornar 50');
        assert(resetAura(pLow).aura === 50, 'resetAura em 15 deve retornar 50');
      },
    },

    // 10. Alterar AURA não altera atributos
    {
      description: '10. Alterar AURA não altera atributos',
      fn: () => {
        const p = createMockPlayer(50);
        const originalAttrs = { ...p.attributes };
        const pBoosted = modifyAura(p, 45);
        const pDropped = modifyAura(pBoosted, -90);

        assert(pDropped.attributes.VEL === originalAttrs.VEL, 'VEL não deve mudar');
        assert(pDropped.attributes.FIN === originalAttrs.FIN, 'FIN não deve mudar');
        assert(pDropped.attributes.DRI === originalAttrs.DRI, 'DRI não deve mudar');
        assert(pDropped.attributes.FOR === originalAttrs.FOR, 'FOR não deve mudar');
        assert(pDropped.attributes.PAS === originalAttrs.PAS, 'PAS não deve mudar');
        assert(pDropped.attributes.DEF === originalAttrs.DEF, 'DEF não deve mudar');
      },
    },

    // 11. Alterar AURA não altera OVR
    {
      description: '11. Alterar AURA não altera OVR',
      fn: () => {
        const p = createMockPlayer(50);
        const originalOVR = p.ovr;
        const p1 = modifyAura(p, 40);
        const p2 = modifyAura(p, -40);
        const p3 = setAura(p, 100);
        const p4 = setAura(p, 0);

        assert(p1.ovr === originalOVR, 'OVR não deve mudar em +40 AURA');
        assert(p2.ovr === originalOVR, 'OVR não deve mudar em -40 AURA');
        assert(p3.ovr === originalOVR, 'OVR não deve mudar em 100 AURA');
        assert(p4.ovr === originalOVR, 'OVR não deve mudar em 0 AURA');
      },
    },

    // 12. Alterar AURA não altera XP
    {
      description: '12. Alterar AURA não altera XP',
      fn: () => {
        const p = createMockPlayer(50);
        const originalXP = p.xp;
        const modified = modifyAura(p, 30);
        assert(modified.xp === originalXP, 'XP deve permanecer inalterado');
      },
    },

    // 13. Alterar AURA não altera nível
    {
      description: '13. Alterar AURA não altera nível',
      fn: () => {
        const p = createMockPlayer(50);
        const originalLevel = p.level;
        const modified = modifyAura(p, -30);
        assert(modified.level === originalLevel, 'Nível deve permanecer inalterado');
      },
    },

    // 14. Alterar AURA não altera influência
    {
      description: '14. Alterar AURA não altera influência',
      fn: () => {
        const p = createMockPlayer(50);
        const originalInfluence = p.influence;
        const modified = setAura(p, 95);
        assert(modified.influence === originalInfluence, 'Influência deve permanecer inalterada');
      },
    },
  ];

  const results: { description: string; passed: boolean; error?: string }[] = [];
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      test.fn();
      results.push({ description: test.description, passed: true });
      passed++;
    } catch (err: unknown) {
      failed++;
      results.push({
        description: test.description,
        passed: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return {
    suiteName: 'Suíte de Testes do Sistema de AURA (Prompt 07)',
    total: tests.length,
    passed,
    failed,
    results,
  };
}
