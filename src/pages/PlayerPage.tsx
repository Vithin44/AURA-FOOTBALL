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
import { ATTRIBUTE_IDS, ATTRIBUTES_DATA, POSITION_ATTRIBUTE_PROFILES } from '../data/attributes';
import { AttributeId } from '../types';
import { getPositionName } from '../utils/formatters';
import {
  clampAttribute,
  modifyAttribute,
  setAttribute,
  createInitialAttributes,
} from '../engine/attributes';
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
      `Atributo ${attrId} alterado: ${delta > 0 ? `+${delta}` : delta} (garantido entre 1 e 100).`
    );
  };

  // Testes rápidos de limites e segurança (Prompt 05, Itens 2, 12 e 13)
  const handleTestExtremeValue = (attrId: AttributeId, rawValue: number) => {
    const clamped = clampAttribute(rawValue);
    updatePlayer((prev) => setAttribute(prev, attrId, rawValue));
    setTestFeedback(
      `Teste de segurança: Valor inserido ${rawValue} → corrigido pelo clamp para ${clamped}.`
    );
  };

  // Resetar atributos para o padrão jovem da posição atual
  const handleResetToPositionBase = () => {
    const fresh = createInitialAttributes(player.position);
    updatePlayer((prev) => ({
      ...prev,
      attributes: fresh,
    }));
    setTestFeedback(`Atributos restaurados para a distribuição equilibrada de ${player.position}.`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-28">
      {/* Header do Perfil do Jogador */}
      <div className="relative rounded-2xl bg-[#111313] border border-[#222626] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        {/* Luz de fundo sutil */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B7FF3C]/5 rounded-full blur-3xl pointer-events-none" />

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
            <h1 className="text-2xl sm:text-3xl font-black text-[#F4F5F2] mt-1 tracking-tight">
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
          <div className="text-center p-3 rounded-xl bg-[#191C1C] border border-[#262B2B]">
            <span className="text-[10px] font-mono uppercase text-[#8B918E] block">ATRIBUTOS</span>
            <span className="font-mono text-xl font-black text-[#B7FF3C]">6 OFICIAIS</span>
          </div>

          {/* OVR: Status de Desenvolvimento (Prompt 05, Item 6 e 16) */}
          <div className="text-center p-3 rounded-xl bg-[#191C1C] border border-[#262B2B]" title="OVR será implementado no Prompt 06">
            <span className="text-[10px] font-mono uppercase text-[#8B918E] block">OVR DA CARREIRA</span>
            <span className="font-mono text-xs font-bold text-[#8B918E] block pt-1">
              PROMPT 06
            </span>
          </div>
        </div>
      </div>

      {/* Aviso do Sistema: Atributos NÃO são o OVR (Item 6 do Prompt 05) */}
      <div className="p-3.5 rounded-xl bg-[#111313] border border-[#262B2B] flex items-start gap-3 text-xs text-[#8B918E]">
        <Info size={16} className="text-[#B7FF3C] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#F4F5F2] block">
            Arquitetura Técnica dos Atributos (AURA Football):
          </span>
          <p>
            O jogador possui exatamente <strong>6 atributos oficiais</strong> (VEL, FIN, DRI, FOR, PAS, DEF) na escala estrita <strong>1–100</strong>. Atributos não são o OVR — o cálculo ponderado de OVR por posição será o foco exclusivo do próximo prompt.
          </p>
        </div>
      </div>

      {/* Grid Principal: 6 Atributos Oficiais à Esquerda & Painéis Complementares à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ==================================================== */}
        {/* COLUNA PRINCIPAL: OS 6 ATRIBUTOS OFICIAIS (7 Colunas) */}
        {/* ==================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-[#191C1C]">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-[#B7FF3C]" />
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
        {/* COLUNA LATERAL: LABORATÓRIO DE TESTES & ESTATÍSTICAS (5 Colunas) */}
        {/* ==================================================== */}
        <div className="lg:col-span-5 space-y-5">
          {/* Laboratório de Teste da Escala 1–100 (Prompt 05, Item 13 & 14) */}
          <Card variant="dark" className="border-[#2E3333]">
            <div className="flex items-center justify-between pb-3 border-b border-[#191C1C] mb-3">
              <div className="flex items-center gap-2">
                <FlaskConical size={15} className="text-[#B7FF3C]" />
                <h3 className="text-sm font-bold text-[#F4F5F2]">Laboratório da Escala 1–100</h3>
              </div>
              <Badge variant="green" className="text-[10px]">Testes Vivos</Badge>
            </div>

            <p className="text-xs text-[#8B918E] mb-4">
              Experimente testar valores além dos limites permitidos para comprovar a segurança do <code className="text-[#B7FF3C]">clampAttribute</code>:
            </p>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestExtremeValue('VEL', 120)}
                  className="text-xs"
                  title="Testar valor 120 (deve limitar a 100)"
                >
                  VEL = 120 → 100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestExtremeValue('FIN', 100)}
                  className="text-xs"
                  title="Testar limite superior exato 100"
                >
                  FIN = 100 → 100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestExtremeValue('DRI', 0)}
                  className="text-xs"
                  title="Testar zero proibido (deve corrigir para 1)"
                >
                  DRI = 0 → 1
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestExtremeValue('DEF', -15)}
                  className="text-xs"
                  title="Testar valor negativo (deve corrigir para 1)"
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

          {/* Importância por Posição (Item 4 do Prompt 05) */}
          <Card variant="dark">
            <div className="flex items-center gap-2 pb-3 border-b border-[#191C1C] mb-3">
              <Layers size={15} className="text-[#B7FF3C]" />
              <h3 className="text-sm font-bold text-[#F4F5F2]">
                Perfil Tático da Posição ({player.position})
              </h3>
            </div>

            <p className="text-xs text-[#8B918E] mb-3">
              Peso e relevância tática de cada atributo para {getPositionName(player.position)}:
            </p>

            <div className="space-y-1.5 text-xs">
              {ATTRIBUTE_IDS.map((attrId) => {
                const importance = positionProfile?.importance[attrId] || 'Médio';
                const weight = positionProfile?.weights[attrId] || 0.16;

                return (
                  <div
                    key={attrId}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#191C1C] border border-[#262B2B]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#F4F5F2]">{attrId}</span>
                      <span className="text-[#8B918E] text-[11px]">{ATTRIBUTES_DATA[attrId].name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#8B918E]">
                        {(weight * 100).toFixed(0)}%
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                          importance === 'Crítico'
                            ? 'bg-[#B7FF3C]/10 text-[#B7FF3C] border-[#B7FF3C]/30'
                            : importance === 'Alto'
                            ? 'bg-[#191C1C] text-[#F4F5F2] border-[#2A2E2E]'
                            : 'bg-[#111313] text-[#555C59] border-[#1D2121]'
                        }`}
                      >
                        {importance}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Estatísticas da Temporada e Contrato */}
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
