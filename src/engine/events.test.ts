/**
 * AURA Football - Testes Automatizados da Engine de Eventos (Prompt 09)
 * Validação rigorosa dos 27 casos de teste obrigatórios.
 */

import { runEventTests, EventTestCaseResult } from './events';

export interface EventTestReport {
  suiteName: string;
  total: number;
  passed: number;
  failed: number;
  results: { description: string; passed: boolean; error?: string }[];
}

export function executePrompt09TestSuite(): EventTestReport {
  const tests = runEventTests();
  const reportResults: { description: string; passed: boolean; error?: string }[] = [];
  let passedCount = 0;
  let failedCount = 0;

  for (const t of tests) {
    if (t.passed) {
      passedCount++;
      reportResults.push({ description: `${t.id}. [${t.category}] ${t.name}: ${t.description}`, passed: true });
    } else {
      failedCount++;
      reportResults.push({
        description: `${t.id}. [${t.category}] ${t.name}: ${t.description}`,
        passed: false,
        error: `Esperado: ${JSON.stringify(t.expected)}, Obtido: ${JSON.stringify(t.actual)}`,
      });
    }
  }

  return {
    suiteName: 'Suíte Oficial da Engine de Eventos da Partida (Prompt 09)',
    total: tests.length,
    passed: passedCount,
    failed: failedCount,
    results: reportResults,
  };
}
