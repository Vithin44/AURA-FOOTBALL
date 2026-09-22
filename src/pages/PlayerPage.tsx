/**
 * AURA Football - PlayerPage (Ficha do Atleta & Sistema de Atributos - Prompt 05)
 * Visualização dos 6 atributos oficiais (escala 1–100), avatar 2D e laboratório de testes tátil.
 */

import React, { useState } from 'react';
import { useCareer } from '../state/careerState';
import { useNavigation } from '../state/navigationState';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { StatDisplay } from '../components/StatDisplay';
import { PlayerAvatar2D } from '../components/avatar/PlayerAvatar2D';
import { AttributeDisplay } from '../components/AttributeDisplay';
import { ATTRIBUTE_IDS, ATTRIBUTES_DATA, POSITION_ATTRIBUTE_PROFILES, POSITION_OVR_WEIGHTS } from '../data/attributes';
import { POSITION_IDS } from '../data/positions';
import { AttributeId, PositionId, PlayerAttributes } from '../types';
import { getPositionName } from '../utils/formatters';
import {
  clampAttribute,
  modifyAttribute,
  setAttribute,
  createInitialAttributes,
} from '../engine/attributes';
import { calculateOVR } from '../engine/ovr';
import { AuraIndicator } from '../components/AuraIndicator';
import {
  clampAura,
  modifyAura,
  setAura,
  resetAura,
  getAuraStatus,
  AURA_DEFAULT,
} from '../engine/aura';
import {
  Zap,
  Edit3,
  Award,
  DollarSign,
  FlaskConical,
  RotateCcw,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export function PlayerPage() {
  const { career, updatePlayer } = useCareer();
  const { navigateTo } = useNavigation();
  const player = career.player;

  // Estado para feedback do laboratório de testes
  const [testFeedback, setTestFeedback] = useState<string | null>(null);

  // Perfil tático de atributos para a posição atual do atleta
  const positionProfile = POSITION_ATTRIBUTE_PROFILES[player.position];

  // Modificação de um atributo via motor de atributos seguro
  const handleModifyAttribute = (attrId: AttributeId, delta: number) => {
    updatePlayer((prev) => modifyAttribute(prev, attrId, delta));
    setTestFeedback(
      `Atributo ${attrId} alterado: ${delta > 0 ? `+${delta}` : delta} (garantido entre 1 e 100). OVR recalculado automaticamente.`
    );
  };

  // Testes rápidos de limites e segurança (Prompt 05, Itens 2, 12 e 13)
  const handleTestExtremeValue = (attrId: AttributeId, rawValue: number) => {
    const clamped = clampAttribute(rawValue);
    updatePlayer((prev) => setAttribute(prev, attrId, rawValue));
    setTestFeedback(
      `Teste de segurança: Valor inserido ${rawValue} → corrigido pelo clamp para ${clamped}. OVR recalculado.`
    );
  };

  // Alteração de posição em ambiente de teste (Prompt 06, Item 11)
  const handleSwitchPosition = (newPos: PositionId) => {
    updatePlayer((prev) => {
      const newOVR = calculateOVR(prev.attributes, newPos);
      return {
        ...prev,
        position: newPos,
        ovr: newOVR,
      };
    });
    setTestFeedback(
      `Posição alterada para ${newPos}. OVR recalculado automaticamente de acordo com os pesos da posição.`
    );
  };

  // Aplicação de cenários de teste posicional (Prompt 06, Item 7)
  const handleApplyPreset = (name: string, attrs: PlayerAttributes, targetPos?: PositionId) => {
    updatePlayer((prev) => {
      const pos = targetPos || prev.position;
      const newOVR = calculateOVR(attrs, pos);
      return {
        ...prev,
        position: pos,
        attributes: attrs,
        ovr: newOVR,
      };
    });
    setTestFeedback(`Cenário "${name}" aplicado! Observe a variação do OVR com base nos pesos.`);
  };

  // Resetar atributos para o padrão jovem da posição atual
  const handleResetToPositionBase = () => {
    const fresh = createInitialAttributes(player.position);
    updatePlayer((prev) => {
      const newOVR = calculateOVR(fresh, prev.position);
      return {
        ...prev,
        attributes: fresh,
        ovr: newOVR,
      };
    });
    setTestFeedback(`Atributos restaurados para a distribuição equilibrada de ${player.position}.`);
  };

  // Modificação de AURA pelo motor oficial de AURA (Prompt 07)
  const handleModifyAura = (delta: number) => {
    updatePlayer((prev) => modifyAura(prev, delta));
    setTestFeedback(
      `AURA alterada em ${delta > 0 ? `+${delta}` : delta}. Note que OVR (${player.ovr}) e os 6 atributos permanecem estritamente inalterados.`
    );
  };

  const handleSetAura = (rawValue: number) => {
    const clamped = clampAura(rawValue);
    updatePlayer((prev) => setAura(prev, rawValue));
    setTestFeedback(
      `AURA definida para ${rawValue} (sanitizada pelo clamp para ${clamped}). OVR e atributos permanecem inalterados.`
    );
  };

  const handleResetAura = () => {
    updatePlayer((prev) => resetAura(prev));
    setTestFeedback(`AURA restaurada para o padrão neutro inicial oficial (${AURA_DEFAULT}).`);
  };

  // Cálculo ao vivo dos termos da fórmula para inspeção matemática transparente
  const currentWeights = POSITION_OVR_WEIGHTS[player.position];
  const breakdownTerms = ATTRIBUTE_IDS.map((attrId) => {
    const val = player.attributes[attrId];
    const weight = currentWeights[attrId];
    const contribution = (val * weight) / 100;
    return { attrId, val, weight, contribution };
  });
  const exactSum = breakdownTerms.reduce((sum, item) => sum + item.contribution, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-28">
      {/* Header do Perfil do Jogador com OVR em Destaque Oficial */}
      <div className="relative rounded-2xl bg-[#111313] border border-[#222626] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        {/* Luz de fundo sutil em AURA Green */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B7FF3C]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-[#080909] border-2 border-[#B7FF3C] overflow-hidden flex items-center justify-center shadow-lg shrink-0">
            <PlayerAvatar2D
              avatar={player.avatar}
              kitNumber={player.kitNumber}
              mode="bust"
              className="w-24 h-24 scale-125 translate-y-1.5"
              showGlow={false}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="green">{player.position}</Badge>
              <Badge variant="dark">{player.prestige}</Badge>
              <span className="text-xs font-mono text-[#8B918E]">{player.age} anos</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F4F5F2] mt-1 tracking-tight font-display">
              {player.name}
              {player.nickname && (
                <span className="text-[#8B918E] font-normal text-xl ml-2">"{player.nickname}"</span>
              )}
            </h1>
            <p className="text-xs text-[#8B918E] mt-0.5">
              {getPositionName(player.position)} • Camisa #{player.kitNumber} • {career.club.name}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('character_creation')}
          >
            <Edit3 size={14} />
            Editar Visual
          </Button>

          {/* Indicador de Status dos Atributos */}
          <div className="text-center px-3.5 py-2 rounded-xl bg-[#191C1C] border border-[#262B2B]">
            <span className="text-[10px] font-mono uppercase text-[#8B918E] block">ATRIBUTOS</span>
            <span className="font-mono text-xs font-bold text-[#F4F5F2]">6 OFICIAIS</span>
          </div>

          {/* OVR: Destaque Oficial AURA Football (Prompt 06) */}
          <div
            className="text-center px-4 py-2 rounded-2xl bg-[#191C1C] border border-[#2E3333] flex flex-col items-center justify-center min-w-[95px]"
            title="Overall oficial: nível geral calculado pela média ponderada dos 6 atributos"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B918E] block font-bold">
              OVR
            </span>
            <span className="font-display text-3xl sm:text-4xl font-black text-[#F4F5F2] leading-none my-0.5 tracking-tight">
              {player.ovr}
            </span>
            <span className="text-[9px] font-mono text-[#8B918E] block uppercase">
              {player.position}
            </span>
          </div>

          {/* AURA: Estado Momentâneo de Confiança e Desempenho (Prompt 07) */}
          <div
            className="text-center px-4 py-2 rounded-2xl bg-[#191C1C] border-2 border-[#B7FF3C] shadow-lg shadow-[#B7FF3C]/10 flex flex-col items-center justify-center min-w-[105px]"
            title="AURA oficial: estado momentâneo de confiança e desempenho do atleta (escala 0–100, padrão neutro 50)"
          >
            <div className="flex items-center gap-1">
              <Zap size={11} className="text-[#B7FF3C]" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B7FF3C] block font-bold">
                AURA
              </span>
            </div>
            <span className="font-display text-3xl sm:text-4xl font-black text-[#B7FF3C] leading-none my-0.5 tracking-tight">
              {player.aura}
            </span>
            <span className="text-[9px] font-mono text-[#8B918E] block uppercase">
              {getAuraStatus(player.aura).label}
            </span>
          </div>
        </div>
      </div>

      {/* Aviso do Sistema: Regra do OVR e da AURA (Prompt 06 & 07) */}
      <div className="p-3.5 rounded-xl bg-[#111313] border border-[#262B2B] flex items-start gap-3 text-xs text-[#8B918E]">
        <Info size={16} className="text-[#B7FF3C] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#F4F5F2] block">
            Diferença Oficial: OVR vs. AURA do Jogador:
          </span>
          <p>
            O <strong>OVR ({player.ovr})</strong> representa o nível técnico permanente/progressivo do atleta (calculado pelos 6 atributos ponderados para {player.position}). A <strong>AURA ({player.aura})</strong> representa o estado momentâneo de confiança/desempenho (escala 0–100, neutro 50). <strong>A AURA nunca altera o OVR nem os atributos.</strong>
          </p>
        </div>
      </div>

      {/* Grid Principal: 6 Atributos Oficiais à Esquerda & Painéis Complementares à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ==================================================== */}
        {/* COLUNA PRINCIPAL: OS 6 ATRIBUTOS OFICIAIS (7 Colunas) */}
        {/* ==================================================== */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card Interativo de AURA do Atleta (Prompt 07, Itens 10 & 11) */}
          <AuraIndicator
            value={player.aura}
            size="md"
            showBar={true}
            showIntensityBadge={true}
            showLabel={true}
            showDescription={true}
            interactive={true}
            onModify={handleModifyAura}
          />

          <div className="flex items-center justify-between pb-1 border-b border-[#191C1C] pt-1">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-[#B7FF3C]" />
              <h2 className="text-sm font-bold text-[#F4F5F2] uppercase tracking-wider">
                6 Atributos Oficiais (Escala 1–100)
              </h2>
            </div>
            <span className="text-xs font-mono text-[#8B918E]">
              Posição: {player.position}
            </span>
          </div>

          {/* Lista dos 6 Atributos utilizando o componente AttributeDisplay */}
          <div className="space-y-3">
            {ATTRIBUTE_IDS.map((attrId) => {
              const value = player.attributes[attrId];
              const importance = positionProfile?.importance[attrId];

              return (
                <AttributeDisplay
                  key={attrId}
                  attributeId={attrId}
                  value={value}
                  importance={importance}
                  showBar={true}
                  showDescription={true}
                  showInfluences={false}
                  interactive={true}
                  onModify={(delta) => handleModifyAttribute(attrId, delta)}
                />
              );
            })}
          </div>

          {/* Feedback temporário de teste */}
          {testFeedback && (
            <div className="p-3 rounded-xl bg-[#191C1C] border border-[#B7FF3C]/30 flex items-center justify-between text-xs text-[#B7FF3C]">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} />
                <span>{testFeedback}</span>
              </div>
              <button
                type="button"
                onClick={() => setTestFeedback(null)}
                className="text-[#8B918E] hover:text-[#F4F5F2] text-xs cursor-pointer"
              >
                fechar
              </button>
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* COLUNA LATERAL: LABORATÓRIO DE TESTES DE OVR & PESOS (5 Colunas) */}
        {/* ==================================================== */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Seletor de Posição em Ambiente de Teste (Prompt 06, Item 11) */}
          <Card variant="dark" className="border-[#2E3333]">
            <div className="flex items-center justify-between pb-3 border-b border-[#191C1C] mb-3">
              <div className="flex items-center gap-2">
                <FlaskConical size={15} className="text-[#B7FF3C]" />
                <h3 className="text-sm font-bold text-[#F4F5F2]">Simulador de Posição & OVR</h3>
              </div>
              <Badge variant="green" className="text-[10px]">OVR Dinâmico</Badge>
            </div>

            <p className="text-xs text-[#8B918E] mb-3">
              Alterne a posição do atleta e observe o <strong>OVR mudar instantaneamente</strong> com base nos pesos específicos da posição:
            </p>

            {/* Grid dos 10 botões de Posição */}
            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {POSITION_IDS.map((pos) => {
                const isCurrent = player.position === pos;
                const simulatedOVR = calculateOVR(player.attributes, pos);
                return (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => handleSwitchPosition(pos)}
                    className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer flex flex-col items-center justify-center border ${
                      isCurrent
                        ? 'bg-[#B7FF3C] text-[#080909] font-black border-[#B7FF3C] shadow-sm'
                        : 'bg-[#191C1C] text-[#8B918E] border-[#2A2E2E] hover:text-[#F4F5F2] hover:border-[#3A4040]'
                    }`}
                    title={`Mudar para ${pos} (OVR resultante: ${simulatedOVR})`}
                  >
                    <span className="font-mono text-xs font-bold leading-none">{pos}</span>
                    <span
                      className={`text-[10px] font-mono leading-none mt-1 ${
                        isCurrent ? 'text-[#080909] font-black' : 'text-[#B7FF3C]'
                      }`}
                    >
                      {simulatedOVR}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Presets Posicionais Rápidos (Prompt 06, Item 7) */}
            <div className="space-y-1.5 pt-2 border-t border-[#191C1C]">
              <span className="text-[10px] font-mono uppercase text-[#8B918E] block">
                Cenários de Teste (Mesmos Atributos vs Posições Diferentes)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleApplyPreset('Atacante Goleador', {
                      VEL: 88,
                      FIN: 92,
                      DRI: 84,
                      FOR: 70,
                      PAS: 65,
                      DEF: 25,
                    }, 'ATA')
                  }
                  className="text-xs truncate text-left justify-start"
                >
                  ⚡ Atacante Goleador
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleApplyPreset('Zagueiro Paredão', {
                      VEL: 65,
                      FIN: 20,
                      DRI: 45,
                      FOR: 88,
                      PAS: 60,
                      DEF: 92,
                    }, 'ZAG')
                  }
                  className="text-xs truncate text-left justify-start"
                >
                  🛡️ Zagueiro Paredão
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleApplyPreset('Meia Maestro', {
                      VEL: 70,
                      FIN: 72,
                      DRI: 85,
                      FOR: 55,
                      PAS: 90,
                      DEF: 48,
                    }, 'MEI')
                  }
                  className="text-xs truncate text-left justify-start"
                >
                  🎯 Meia Maestro
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleApplyPreset('Uniforme (Todos 70)', {
                      VEL: 70,
                      FIN: 70,
                      DRI: 70,
                      FOR: 70,
                      PAS: 70,
                      DEF: 70,
                    })
                  }
                  className="text-xs truncate text-left justify-start"
                >
                  ⚖️ Uniforme (Todos 70)
                </Button>
              </div>
            </div>
          </Card>

          {/* 2. Laboratório de Testes de AURA (Prompt 07, Itens 2, 3, 5, 6, 12) */}
          <Card variant="dark" className="border-[#2E3333]">
            <div className="flex items-center justify-between pb-3 border-b border-[#191C1C] mb-3">
              <div className="flex items-center gap-2">
                <Zap size={15} className="text-[#B7FF3C]" />
                <h3 className="text-sm font-bold text-[#F4F5F2]">Laboratório de AURA do Atleta</h3>
              </div>
              <Badge variant="green" className="text-[10px]">Escala 0–100</Badge>
            </div>

            <p className="text-xs text-[#8B918E] mb-3">
              Simule variações momentâneas de desempenho/confiança e comprove que <strong>AURA nunca altera OVR nem atributos</strong>:
            </p>

            {/* Ações Relativas Rápidas (modifyAura) */}
            <div className="space-y-2 mb-3">
              <span className="text-[10px] font-mono uppercase text-[#8B918E] block">
                Modificações Relativas (modifyAura)
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleModifyAura(10)}
                  className="text-xs font-mono"
                >
                  +10
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleModifyAura(-10)}
                  className="text-xs font-mono"
                >
                  -10
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleModifyAura(25)}
                  className="text-xs font-mono"
                >
                  +25
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleModifyAura(-25)}
                  className="text-xs font-mono"
                >
                  -25
                </Button>
              </div>
            </div>

            {/* Testes de Limites Extremos (clampAura) */}
            <div className="space-y-2 mb-3 pt-2 border-t border-[#191C1C]">
              <span className="text-[10px] font-mono uppercase text-[#8B918E] block">
                Proteção Contra Limites Inválidos (clampAura)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetAura(120)}
                  className="text-xs"
                >
                  Teto: 120 → 100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetAura(-20)}
                  className="text-xs"
                >
                  Piso: -20 → 0
                </Button>
              </div>
            </div>

            {/* Botão de Reset Oficial (50) */}
            <div className="pt-2 border-t border-[#191C1C]">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={handleResetAura}
                className="text-xs"
              >
                <RotateCcw size={13} />
                Restaurar AURA Neutra Inicial ({AURA_DEFAULT})
              </Button>
            </div>

            {/* Prova em Tempo Real das Invariantes do Prompt 07 */}
            <div className="mt-3 p-2.5 rounded-xl bg-[#080909] border border-[#222626] space-y-1 text-[11px] font-mono">
              <div className="flex items-center justify-between text-[#8B918E]">
                <span>AURA Momentânea:</span>
                <span className="text-[#B7FF3C] font-bold">{player.aura} / 100</span>
              </div>
              <div className="flex items-center justify-between text-[#8B918E]">
                <span>OVR (Imune à AURA):</span>
                <span className="text-[#F4F5F2] font-bold">{player.ovr} (Preservado)</span>
              </div>
              <div className="flex items-center justify-between text-[#8B918E]">
                <span>Atributos (Imunes à AURA):</span>
                <span className="text-[#F4F5F2] font-bold">VEL {player.attributes.VEL} | FIN {player.attributes.FIN}</span>
              </div>
            </div>
          </Card>

          {/* 2. Inspetor Matemático da Fórmula Oficial (Prompt 06, Item 3) */}
          <Card variant="dark">
            <div className="flex items-center gap-2 pb-3 border-b border-[#191C1C] mb-3">
              <Layers size={15} className="text-[#B7FF3C]" />
              <h3 className="text-sm font-bold text-[#F4F5F2]">
                Decomposição Matemática do OVR ({player.position})
              </h3>
            </div>

            <div className="space-y-1.5 text-xs">
              {breakdownTerms.map((term) => (
                <div
                  key={term.attrId}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#191C1C] border border-[#262B2B]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#F4F5F2] w-8">
                      {term.attrId}
                    </span>
                    <span className="text-[11px] text-[#8B918E]">
                      {term.val} × {term.weight}%
                    </span>
                  </div>
                  <div className="font-mono text-xs text-[#B7FF3C] font-semibold">
                    +{term.contribution.toFixed(2)}
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-[#262B2B] flex items-center justify-between font-mono text-xs">
                <span className="text-[#8B918E]">Soma Ponderada:</span>
                <span className="text-[#F4F5F2] font-bold">
                  {exactSum.toFixed(2)} / 100
                </span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#8B918E]">Arredondamento (Math.round):</span>
                <span className="text-[#B7FF3C] font-black text-sm">
                  {player.ovr} OVR
                </span>
              </div>
            </div>
          </Card>

          {/* 3. Laboratório da Escala 1–100 (Prompt 05, Item 13 & 14) */}
          <Card variant="dark" className="border-[#2E3333]">
            <div className="flex items-center justify-between pb-3 border-b border-[#191C1C] mb-3">
              <h3 className="text-sm font-bold text-[#F4F5F2]">Testes Rápidos de Limites</h3>
              <Badge variant="dark" className="text-[10px]">Escala 1–100</Badge>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestExtremeValue('VEL', 120)}
                  className="text-xs"
                >
                  VEL = 120 → 100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestExtremeValue('FIN', 100)}
                  className="text-xs"
                >
                  FIN = 100 → 100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestExtremeValue('DRI', 0)}
                  className="text-xs"
                >
                  DRI = 0 → 1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestExtremeValue('DEF', -15)}
                  className="text-xs"
                >
                  DEF = -15 → 1
                </Button>
              </div>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  onClick={handleResetToPositionBase}
                  className="text-xs"
                >
                  <RotateCcw size={13} />
                  Restaurar Valores Iniciais de {player.position}
                </Button>
              </div>
            </div>
          </Card>

          {/* 4. Estatísticas da Temporada e Contrato */}
          <Card variant="dark">
            <div className="flex items-center gap-2 pb-3 border-b border-[#191C1C] mb-3">
              <Award size={15} className="text-[#B7FF3C]" />
              <h3 className="text-sm font-bold text-[#F4F5F2]">Dados da Temporada</h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <StatDisplay label="Partidas" value={player.stats.matches} />
              <StatDisplay label="Gols" value={player.stats.goals} highlight />
              <StatDisplay label="Assistências" value={player.stats.assists} />
              <StatDisplay
                label="Nota Média"
                value={player.stats.averageRating > 0 ? player.stats.averageRating.toFixed(1) : '-'}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
