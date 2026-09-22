/**
 * AURA Football - Página Separada: Diagnóstico & Testes da Engine
 * Página técnica dedicada e isolada para verificação de compilação, tipos, Engine, RNG, Save e integridade.
 */

import React, { useState } from 'react';
import { useCareer } from '../state/careerState';
import { useNavigation } from '../state/navigationState';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { StatDisplay } from '../components/StatDisplay';
import { rng } from '../engine/rng';
import { POSITION_IDS } from '../data/positions';
import { ATTRIBUTE_IDS } from '../data/attributes';
import { runAttributeTests, AttributeTestCaseResult } from '../engine/attributes';
import { runOVRTests, OVRTestCaseResult } from '../engine/ovr';
import { runAuraTests, AuraTestCaseResult } from '../engine/aura';
import { runMatchTests, MatchTestCaseResult } from '../engine/match';
import {
  CheckCircle2,
  AlertCircle,
  Dice5,
  Coins,
  Save,
  RotateCcw,
  ArrowLeft,
  Terminal,
  FlaskConical,
  Zap,
  Swords,
} from 'lucide-react';

export function DiagnosticsPage() {
  const {
    career,
    saveCareer,
    loadSavedCareer,
    resetCareer,
    creditFichas,
    spendFichas,
    isValid,
    validationErrors,
  } = useCareer();
  const { navigateTo } = useNavigation();

  // Testes interativos da Engine
  const [rngSeed, setRngSeed] = useState(12345);
  const [rngOutput, setRngOutput] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [attributeTestResults, setAttributeTestResults] = useState<AttributeTestCaseResult[]>(() =>
    runAttributeTests()
  );
  const [ovrTestResults, setOvrTestResults] = useState<OVRTestCaseResult[]>(() =>
    runOVRTests()
  );
  const [auraTestResults, setAuraTestResults] = useState<AuraTestCaseResult[]>(() =>
    runAuraTests()
  );
  const [matchTestResults, setMatchTestResults] = useState<MatchTestCaseResult[]>(() =>
    runMatchTests()
  );

  const handleRunAttributeTests = () => {
    setAttributeTestResults(runAttributeTests());
  };

  const handleRunOVRTests = () => {
    setOvrTestResults(runOVRTests());
  };

  const handleRunAuraTests = () => {
    setAuraTestResults(runAuraTests());
  };

  const handleRunMatchTests = () => {
    setMatchTestResults(runMatchTests());
  };

  const handleTestRNG = () => {
    rng.setSeed(rngSeed);
    const num = rng.nextInt(1, 100);
    setRngOutput(num);
  };

  const handleSave = () => {
    const success = saveCareer();
    setSaveStatus(
      success ? 'Save gravado com sucesso no LocalStorage!' : 'Falha ao salvar carreira.'
    );
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleLoad = () => {
    const success = loadSavedCareer();
    setSaveStatus(
      success ? 'Save recuperado do LocalStorage!' : 'Nenhum save encontrado no storage.'
    );
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      {/* Barra de Navegação e Retorno ao Jogo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#191C1C]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-[#B7FF3C] uppercase flex items-center gap-1.5">
              <Terminal size={14} /> PÁGINA SEPARADA DE DIAGNÓSTICO
            </span>
            <span className="text-xs text-[#8B918E]">•</span>
            <span className="text-xs font-mono text-[#8B918E]">ENGINE ISOLADA</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F4F5F2] mt-1">Diagnóstico & Testes da Engine</h1>
          <p className="text-xs text-[#8B918E] mt-0.5">
            Área técnica isolada para verificação de RNG determinístico, sistema de save, regras dos atributos e saldo único de Fichas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isValid ? (
            <Badge variant="green" className="py-1 px-2.5 gap-1.5">
              <CheckCircle2 size={13} />
              Estrutura Válida
            </Badge>
          ) : (
            <Badge variant="red" className="py-1 px-2.5 gap-1.5">
              <AlertCircle size={13} />
              Erros Encontrados
            </Badge>
          )}

          <Button variant="secondary" size="sm" onClick={() => navigateTo('hub')}>
            <ArrowLeft size={14} />
            Voltar ao Jogo (HUB)
          </Button>
        </div>
      </div>

      {/* Alertas de Erros de Validação se houver */}
      {validationErrors.length > 0 && (
        <Card variant="soft" className="border-[#E5484D]/40 bg-[#E5484D]/10">
          <div className="text-xs text-[#E5484D] font-semibold mb-1">Inconsistências Detectadas:</div>
          <ul className="text-xs text-[#E5484D] list-disc list-inside space-y-0.5">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Grid de Verificação dos Módulos da Engine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Painel 1: Sistema de Posições e Atributos */}
        <Card variant="dark">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#F4F5F2]">1. Posições & Atributos Oficiais</h2>
            <Badge variant="dark">{POSITION_IDS.length} Posições • {ATTRIBUTE_IDS.length} Attrs</Badge>
          </div>
          <p className="text-xs text-[#8B918E] mb-3">
            Fonte única de verdade sem posições secundárias ou atributos extras.
          </p>
          <div className="space-y-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#8B918E]">Posições Oficiais:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {POSITION_IDS.map((pos) => (
                  <span
                    key={pos}
                    className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${
                      career.player.position === pos
                        ? 'bg-[#B7FF3C] text-[#080909] font-bold border-[#B7FF3C]'
                        : 'bg-[#191C1C] text-[#8B918E] border-[#262B2B]'
                    }`}
                  >
                    {pos}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-[#191C1C]">
              <span className="text-[10px] font-mono uppercase text-[#8B918E]">6 Atributos Base:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {ATTRIBUTE_IDS.map((attr) => (
                  <span
                    key={attr}
                    className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#191C1C] text-[#F4F5F2] border border-[#262B2B]"
                  >
                    {attr}: {career.player.attributes[attr]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Painel 2: Economia (Fichas) & Estado do Jogador */}
        <Card variant="dark">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#F4F5F2]">2. Moeda Única & Atleta</h2>
            <Badge variant="gold">Fichas</Badge>
          </div>
          <p className="text-xs text-[#8B918E] mb-3">
            Gerenciada estritamente pela Engine (sem moedas duplicadas para cassino/carreira).
          </p>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <StatDisplay label="Saldo Fichas" value={career.currency.fichas} highlight />
            <StatDisplay label="OVR Atleta" value={career.player.ovr} />
            <StatDisplay label="AURA Base" value={career.player.aura} />
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => creditFichas(50, 'Crédito de teste via Engine')}
            >
              <Coins size={14} className="text-[#D9B65D]" />
              +50 Fichas
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => spendFichas(25, 'Débito de teste via Engine')}
            >
              -25 Fichas
            </Button>
          </div>
        </Card>

        {/* Painel 3: Teste do RNG Controlável com Seed */}
        <Card variant="dark">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#F4F5F2]">3. RNG Determinístico / Seedable</h2>
            <Badge variant="dark">Mulberry32</Badge>
          </div>
          <p className="text-xs text-[#8B918E] mb-3">
            Permite reprodutibilidade em partidas, momentos e cassino futuro.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] font-mono text-[#8B918E] block mb-1">
                Semente (Seed):
              </label>
              <input
                type="number"
                value={rngSeed}
                onChange={(e) => setRngSeed(Number(e.target.value))}
                className="w-full bg-[#191C1C] border border-[#262B2B] rounded px-2.5 py-1 text-xs font-mono text-[#F4F5F2] focus:outline-none focus:border-[#B7FF3C]"
              />
            </div>
            <Button variant="secondary" size="sm" onClick={handleTestRNG} className="mt-4">
              <Dice5 size={14} />
              Sortear (1-100)
            </Button>
          </div>
          {rngOutput !== null && (
            <div className="mt-3 p-2 bg-[#191C1C] rounded border border-[#262B2B] text-xs font-mono flex items-center justify-between">
              <span className="text-[#8B918E]">Resultado do RNG:</span>
              <span className="text-[#B7FF3C] font-bold text-sm">{rngOutput}</span>
            </div>
          )}
        </Card>

        {/* Painel 4: Sistema de Save Versionado */}
        <Card variant="dark">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#F4F5F2]">4. Arquitetura de Save</h2>
            <Badge variant="dark">v1.0 (Versionado)</Badge>
          </div>
          <p className="text-xs text-[#8B918E] mb-3">
            Serialização segura com validação de integridade no carregamento.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" onClick={handleSave}>
              <Save size={14} />
              Salvar Estado
            </Button>
            <Button variant="secondary" size="sm" onClick={handleLoad}>
              Carregar Estado
            </Button>
            <Button variant="outline" size="sm" onClick={resetCareer}>
              <RotateCcw size={14} />
              Reset
            </Button>
          </div>
          {saveStatus && (
            <div className="mt-3 text-xs text-[#B7FF3C] font-mono">{saveStatus}</div>
          )}
        </Card>
      </div>

      {/* Painel 5: Suíte de Testes Unitários de Atributos (Prompt 05, Item 13) */}
      <Card variant="dark" className="border-[#262B2B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#191C1C] mb-4">
          <div className="flex items-center gap-2">
            <FlaskConical size={18} className="text-[#B7FF3C]" />
            <div>
              <h2 className="text-sm font-bold text-[#F4F5F2] uppercase tracking-wider">
                Suíte de Testes dos Atributos (Prompt 05, Item 13)
              </h2>
              <p className="text-xs text-[#8B918E]">
                Validação estrita dos 7 casos obrigatórios: escala 1–100, limites, overflow, underflow e rejeição de atributos não oficiais.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant={attributeTestResults.every((t) => t.passed) ? 'green' : 'red'}
              className="py-1 px-2.5"
            >
              {attributeTestResults.filter((t) => t.passed).length} / {attributeTestResults.length} Passaram
            </Badge>
            <Button variant="secondary" size="sm" onClick={handleRunAttributeTests}>
              <RotateCcw size={13} />
              Reexecutar Testes
            </Button>
          </div>
        </div>

        {/* Lista dos 7 Casos de Teste */}
        <div className="space-y-2">
          {attributeTestResults.map((test) => (
            <div
              key={test.id}
              className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                test.passed
                  ? 'bg-[#111313] border-[#222626]'
                  : 'bg-rose-950/20 border-rose-800/40'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  {test.passed ? (
                    <CheckCircle2 size={15} className="text-[#B7FF3C] shrink-0" />
                  ) : (
                    <AlertCircle size={15} className="text-rose-400 shrink-0" />
                  )}
                  <span className="font-semibold text-xs text-[#F4F5F2]">{test.name}</span>
                </div>
                <p className="text-xs text-[#8B918E] pl-6">{test.description}</p>
                {test.details && (
                  <p className="text-[11px] font-mono text-[#636B67] pl-6 mt-1">
                    Detalhes: {test.details}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 pl-6 md:pl-0 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-[#555C59] block uppercase">Esperado:</span>
                  <span className="text-[#8B918E]">{JSON.stringify(test.expected)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#555C59] block uppercase">Obtido:</span>
                  <span className={test.passed ? 'text-[#B7FF3C] font-bold' : 'text-rose-400 font-bold'}>
                    {JSON.stringify(test.actual)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Painel 6: Suíte de Testes Unitários de OVR (Prompt 06, Item 10) */}
      <Card variant="dark" className="border-[#262B2B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#191C1C] mb-4">
          <div className="flex items-center gap-2">
            <FlaskConical size={18} className="text-[#B7FF3C]" />
            <div>
              <h2 className="text-sm font-bold text-[#F4F5F2] uppercase tracking-wider">
                Suíte de Testes do Sistema de OVR (Prompt 06, Item 10)
              </h2>
              <p className="text-xs text-[#8B918E]">
                Validação estrita dos 9 casos oficiais: pesos de 100%, cálculo ponderado, sensibilidade posicional, arredondamento e integridade de limites [0, 100].
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant={ovrTestResults.every((t) => t.passed) ? 'green' : 'red'}
              className="py-1 px-2.5"
            >
              {ovrTestResults.filter((t) => t.passed).length} / {ovrTestResults.length} Passaram
            </Badge>
            <Button variant="secondary" size="sm" onClick={handleRunOVRTests}>
              <RotateCcw size={13} />
              Reexecutar Testes de OVR
            </Button>
          </div>
        </div>

        {/* Lista dos 9 Casos de Teste de OVR */}
        <div className="space-y-2">
          {ovrTestResults.map((test) => (
            <div
              key={test.id}
              className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                test.passed
                  ? 'bg-[#111313] border-[#222626]'
                  : 'bg-rose-950/20 border-rose-800/40'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  {test.passed ? (
                    <CheckCircle2 size={15} className="text-[#B7FF3C] shrink-0" />
                  ) : (
                    <AlertCircle size={15} className="text-rose-400 shrink-0" />
                  )}
                  <span className="font-semibold text-xs text-[#F4F5F2]">{test.name}</span>
                </div>
                <p className="text-xs text-[#8B918E] pl-6">{test.description}</p>
                {test.details && (
                  <p className="text-[11px] font-mono text-[#636B67] pl-6 mt-1">
                    Detalhes: {test.details}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 pl-6 md:pl-0 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-[#555C59] block uppercase">Esperado:</span>
                  <span className="text-[#8B918E]">{JSON.stringify(test.expected)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#555C59] block uppercase">Obtido:</span>
                  <span className={test.passed ? 'text-[#B7FF3C] font-bold' : 'text-rose-400 font-bold'}>
                    {JSON.stringify(test.actual)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Painel 7: Suíte de Testes da AURA ENGINE (Prompt 07, Itens 12 & 13) */}
      <Card variant="dark" className="border-[#262B2B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#191C1C] mb-4">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-[#B7FF3C]" />
            <div>
              <h2 className="text-sm font-bold text-[#F4F5F2] uppercase tracking-wider">
                AURA ENGINE (Prompt 07, Itens 12 & 13)
              </h2>
              <p className="text-xs text-[#8B918E]">
                Validação estrita dos 14 casos oficiais: AURA_DEFAULT=50, limites [0, 100], deltas relativos, reset e imunidade total de OVR, Atributos, XP, Nível e Influência.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant={auraTestResults.every((t) => t.passed) ? 'green' : 'red'}
              className="py-1 px-2.5 font-mono uppercase"
            >
              AURA ENGINE: {auraTestResults.filter((t) => t.passed).length}/{auraTestResults.length} TESTS PASSED
            </Badge>
            <Button variant="secondary" size="sm" onClick={handleRunAuraTests}>
              <RotateCcw size={13} />
              Reexecutar Testes de AURA
            </Button>
          </div>
        </div>

        {/* Lista dos 14 Casos de Teste de AURA */}
        <div className="space-y-2">
          {auraTestResults.map((test) => (
            <div
              key={test.id}
              className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                test.passed
                  ? 'bg-[#111313] border-[#222626]'
                  : 'bg-rose-950/20 border-rose-800/40'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  {test.passed ? (
                    <CheckCircle2 size={15} className="text-[#B7FF3C] shrink-0" />
                  ) : (
                    <AlertCircle size={15} className="text-rose-400 shrink-0" />
                  )}
                  <span className="font-semibold text-xs text-[#F4F5F2]">{test.name}</span>
                </div>
                <p className="text-xs text-[#8B918E] pl-6">{test.description}</p>
                {test.details && (
                  <p className="text-[11px] font-mono text-[#636B67] pl-6 mt-1">
                    Detalhes: {test.details}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 pl-6 md:pl-0 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-[#555C59] block uppercase">Esperado:</span>
                  <span className="text-[#8B918E]">{JSON.stringify(test.expected)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#555C59] block uppercase">Obtido:</span>
                  <span className={test.passed ? 'text-[#B7FF3C] font-bold' : 'text-rose-400 font-bold'}>
                    {JSON.stringify(test.actual)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Painel 8: Suíte de Testes da MATCH ENGINE (Prompt 08 - Fundação da Partida) */}
      <Card variant="dark" className="border-[#262B2B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#191C1C] mb-4">
          <div className="flex items-center gap-2">
            <Swords size={18} className="text-[#B7FF3C]" />
            <div>
              <h2 className="text-sm font-bold text-[#F4F5F2] uppercase tracking-wider">
                MATCH ENGINE (Prompt 08 - Fundação da Partida)
              </h2>
              <p className="text-xs text-[#8B918E]">
                Validação estrita dos 21 casos oficiais: Minuto inicial 0, etapas (1º tempo, intervalo 45', 2º tempo, fim 90'), placar imutável, determinismo RNG e imunidade total de AURA, OVR e Atributos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant={matchTestResults.every((t) => t.passed) ? 'green' : 'red'}
              className="py-1 px-2.5 font-mono uppercase"
            >
              MATCH ENGINE: {matchTestResults.filter((t) => t.passed).length}/{matchTestResults.length} TESTS PASSED
            </Badge>
            <Button variant="secondary" size="sm" onClick={handleRunMatchTests}>
              <RotateCcw size={13} />
              Reexecutar Testes de Partida
            </Button>
          </div>
        </div>

        {/* Lista dos 21 Casos de Teste de Match */}
        <div className="space-y-2">
          {matchTestResults.map((test) => (
            <div
              key={test.id}
              className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                test.passed
                  ? 'bg-[#111313] border-[#222626]'
                  : 'bg-rose-950/20 border-rose-800/40'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  {test.passed ? (
                    <CheckCircle2 size={15} className="text-[#B7FF3C] shrink-0" />
                  ) : (
                    <AlertCircle size={15} className="text-rose-400 shrink-0" />
                  )}
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#191C1C] text-[#8B918E] uppercase">
                    {test.category}
                  </span>
                  <span className="font-semibold text-xs text-[#F4F5F2]">{test.name}</span>
                </div>
                <p className="text-xs text-[#8B918E] pl-6">{test.description}</p>
                {test.details && (
                  <p className="text-[11px] font-mono text-[#636B67] pl-6 mt-1">
                    Detalhes: {test.details}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 pl-6 md:pl-0 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-[#555C59] block uppercase">Esperado:</span>
                  <span className="text-[#8B918E]">{JSON.stringify(test.expected)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#555C59] block uppercase">Obtido:</span>
                  <span className={test.passed ? 'text-[#B7FF3C] font-bold' : 'text-rose-400 font-bold'}>
                    {JSON.stringify(test.actual)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
