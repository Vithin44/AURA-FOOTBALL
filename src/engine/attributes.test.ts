/**
 * AURA Football - Testes Automatizados do Sistema de Atributos (Prompt 05, Item 13)
 * Suíte de testes pura em TypeScript validando os 7 casos obrigatórios sem dependências externas.
 */

import {
  clampAttribute,
  createInitialAttributes,
  validateAttributes,
  runAttributeTests,
} from './attributes';

export interface TestReport {
  suiteName: string;
  total: number;
  passed: number;
  failed: number;
  results: { description: string; passed: boolean; error?: string }[];
}

/**
 * Utilitário leve de asserção tipada
 */
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Executa a suíte de testes completa do Prompt 05
 */
export function executePrompt05TestSuite(): TestReport {
  const tests: { description: string; fn: () => void }[] = [
    // Caso 1: Atributo 50 permanece 50
    {
      description: 'Caso 1: Atributo 50 permanece 50',
      fn: () => {
        assert(clampAttribute(50) === 50, '50 deve permanecer 50');
      },
    },

    // Caso 2: Atributo 100 permanece 100
    {
      description: 'Caso 2: Atributo 100 permanece 100',
      fn: () => {
        assert(clampAttribute(100) === 100, '100 deve permanecer 100');
      },
    },

    // Caso 3: Atributo 101 é limitado para 100
    {
      description: 'Caso 3: Atributo 101 é limitado para 100',
      fn: () => {
        assert(clampAttribute(101) === 100, '101 deve ser limitado para 100');
        assert(clampAttribute(150) === 100, '150 deve ser limitado para 100');
      },
    },

    // Caso 4: Atributo 0 é corrigido para 1
    {
      description: 'Caso 4: Atributo 0 é corrigido para 1',
      fn: () => {
        assert(clampAttribute(0) === 1, '0 deve ser corrigido para 1');
      },
    },

    // Caso 5: Atributo negativo é corrigido/rejeitado
    {
      description: 'Caso 5: Atributo negativo é corrigido para 1',
      fn: () => {
        assert(clampAttribute(-10) === 1, '-10 deve ser corrigido para 1');
        assert(clampAttribute(-99) === 1, '-99 deve ser corrigido para 1');
      },
    },

    // Caso 6: Todos os seis atributos existem
    {
      description: 'Caso 6: Todos os seis atributos oficiais (VEL, FIN, DRI, FOR, PAS, DEF) existem',
      fn: () => {
        const attrs = createInitialAttributes('ATA');
        const keys = Object.keys(attrs);
        assert(keys.length === 6, 'Deve conter exatamente 6 atributos');
        assert(typeof attrs.VEL === 'number', 'VEL deve existir e ser número');
        assert(typeof attrs.FIN === 'number', 'FIN deve existir e ser número');
        assert(typeof attrs.DRI === 'number', 'DRI deve existir e ser número');
        assert(typeof attrs.FOR === 'number', 'FOR deve existir e ser número');
        assert(typeof attrs.PAS === 'number', 'PAS deve existir e ser número');
        assert(typeof attrs.DEF === 'number', 'DEF deve existir e ser número');
      },
    },

    // Caso 7: Nenhum atributo adicional é criado acidentalmente
    {
      description: 'Caso 7: Nenhum atributo adicional é aceito/criado acidentalmente',
      fn: () => {
        const invalidPayload = {
          VEL: 75,
          FIN: 80,
          DRI: 70,
          FOR: 65,
          PAS: 60,
          DEF: 40,
          resistencia: 80,
          aceleracao: 90,
        };
        const validation = validateAttributes(invalidPayload);
        assert(!validation.isValid, 'Payload com atributos extras deve ser inválido');
        const sanitizedKeys = Object.keys(validation.sanitized);
        assert(sanitizedKeys.length === 6, 'Sanitizado deve conter apenas 6 atributos');
        assert(!('resistencia' in validation.sanitized), 'Resistência não pode existir no sanitizado');
        assert(!('aceleracao' in validation.sanitized), 'Aceleração não pode existir no sanitizado');
      },
    },

    // Verificação da suíte runtime integrada
    {
      description: 'Verificação da suíte integrada runAttributeTests()',
      fn: () => {
        const results = runAttributeTests();
        assert(results.length === 7, 'Deve conter os 7 casos');
        assert(results.every((r) => r.passed), 'Todos os 7 testes devem passar');
      },
    },
  ];

  const results: { description: string; passed: boolean; error?: string }[] = [];
  let passedCount = 0;

  for (const t of tests) {
    try {
      t.fn();
      results.push({ description: t.description, passed: true });
      passedCount++;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      results.push({ description: t.description, passed: false, error: errorMsg });
    }
  }

  return {
    suiteName: 'Sistema de Atributos - AURA Football',
    total: tests.length,
    passed: passedCount,
    failed: tests.length - passedCount,
    results,
  };
}
