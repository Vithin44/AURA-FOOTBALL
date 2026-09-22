/**
 * AURA Football - HomePage (Tela Técnica de Verificação da Fundação)
 * Tela técnica minimalista para validação e diagnóstico da arquitetura.
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
import { PageId } from '../types';
import {
  CheckCircle2,
  AlertCircle,
  Dice5,
  Coins,
  Save,
  RotateCcw,
  Compass,
} from 'lucide-react';

export function HomePage() {
  const { career, saveCareer, loadSavedCareer, resetCareer, creditFichas, spendFichas, isValid, validationErrors } =
    useCareer();
  const { navigateTo } = useNavigation();

  // Testes interativos da Engine
  const [rngSeed, setRngSeed] = useState(12345);
  const [rngOutput, setRngOutput] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');

  const handleTestRNG = () => {
    rng.setSeed(rngSeed);
    const num = rng.nextInt(1, 100);
    setRngOutput(num);
  };

  const handleSave = () => {
    const success = saveCareer();
    setSaveStatus(success ? 'Save gravado com sucesso no LocalStorage!' : 'Falha ao salvar carreira.');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleLoad = () => {
    const success = loadSavedCareer();
    setSaveStatus(success ? 'Save recuperado do LocalStorage!' : 'Nenhum save encontrado no storage.');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  // Rotas disponíveis para verificação
  const routes: { id: PageId; label: string }[] = [
    { id: 'character_creation', label: 'Criação Atleta' },
    { id: 'hub', label: 'HUB' },
    { id: 'player', label: 'Jogador' },
    { id: 'matches', label: 'Partidas' },
    { id: 'club', label: 'Clube' },
    { id: 'calendar', label: 'Calendário' },
    { id: 'training', label: 'Treino' },
    { id: 'transfers', label: 'Mercado' },
    { id: 'news', label: 'Notícias' },
    { id: 'trophies', label: 'Troféus' },
    { id: 'store', label: 'Loja' },
    { id: 'casino', label: 'Cassino' },
    { id: 'settings', label: 'Ajustes' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Cabeçalho Técnico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#191C1C]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-[#B7FF3C] uppercase">
              AURA FOOTBALL
            </span>
            <span className="text-xs text-[#8B918E]">•</span>
            <span className="text-xs font-mono text-[#8B918E]">PROMPT 02 — FUNDAÇÃO TÉCNICA</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F4F5F2] mt-1">Diagnóstico da Arquitetura</h1>
          <p className="text-xs text-[#8B918E] mt-0.5">
            Tela técnica simples para verificação de compilação, tipos, Engine, RNG, Save e separação conceitual.
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
        </div>
      </div>

      {/* Erros de Validação se houver */}
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

      {/* Grid de Verificação dos Pilares */}
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

      {/* Painel 5: Verificação de Rotas da Navegação */}
      <Card variant="dark">
        <div className="flex items-center gap-2 mb-2">
          <Compass size={16} className="text-[#B7FF3C]" />
          <h2 className="text-sm font-semibold text-[#F4F5F2]">5. Verificação de Roteamento & Telas</h2>
        </div>
        <p className="text-xs text-[#8B918E] mb-3">
          Navegue pelas rotas estruturadas para confirmar a prontidão da arquitetura:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => navigateTo(route.id)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-[#191C1C] hover:bg-[#252A2A] text-[#F4F5F2] border border-[#262B2B] transition-colors cursor-pointer"
            >
              {route.label}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
