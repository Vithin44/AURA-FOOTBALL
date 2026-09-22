/**
 * AURA Football - Testes Automatizados da Engine de Partidas (Prompt 08)
 * Validação rigorosa dos 21 casos de teste obrigatórios para a fundação do sistema de partidas.
 */

import {
  MATCH_START_MINUTE,
  MATCH_HALF_TIME_MINUTE,
  MATCH_SECOND_HALF_START_MINUTE,
  MATCH_REGULATION_MINUTES,
  createMatch,
  startMatch,
  advanceMatchMinute,
  scoreGoal,
  simulateMatch,
  formatMatchClock,
  canAdvanceMatch,
  runMatchTests,
} from './match';
import { Club, Player } from '../types';
import { createRNG } from './rng';

export interface MatchTestReport {
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

export function executePrompt08TestSuite(): MatchTestReport {
  const tests = runMatchTests();
  const reportResults: { description: string; passed: boolean; error?: string }[] = [];
  let passedCount = 0;
  let failedCount = 0;

  for (const t of tests) {
    if (t.passed) {
      passedCount++;
      reportResults.push({ description: `${t.id}. ${t.name}: ${t.description}`, passed: true });
    } else {
      failedCount++;
      reportResults.push({
        description: `${t.id}. ${t.name}: ${t.description}`,
        passed: false,
        error: `Esperado: ${JSON.stringify(t.expected)}, Obtido: ${JSON.stringify(t.actual)}`,
      });
    }
  }

  return {
    suiteName: 'Suíte Oficial da Engine de Partidas (Prompt 08)',
    total: tests.length,
    passed: passedCount,
    failed: failedCount,
    results: reportResults,
  };
}
