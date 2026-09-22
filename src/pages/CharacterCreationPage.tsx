/**
 * AURA Football - Tela de Criação de Jogador (CharacterCreationPage - Prompt 04)
 * Experiência visual de jogo premium com avatar 2D em destaque, preview em tempo real e configuração tátil.
 */

import React, { useState } from 'react';
import { PlayerAvatar, PositionId, Player } from '../types';
import { useCareer } from '../state/careerState';
import { useNavigation } from '../state/navigationState';
import { PlayerAvatar2D } from '../components/avatar/PlayerAvatar2D';
import { AppearanceTab } from '../components/character-creation/AppearanceTab';
import { KitTab } from '../components/character-creation/KitTab';
import { IdentityTab } from '../components/character-creation/IdentityTab';
import { PlayerIntroCinematic } from '../components/character-creation/PlayerIntroCinematic';
import {
  validatePlayerCreation,
  createNewPlayer,
  PROVISIONAL_CLUB,
} from '../engine/playerCreation';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { getPositionName } from '../utils/formatters';
import {
  User,
  Sparkles,
  Shirt,
  CheckCircle2,
  AlertCircle,
  Eye,
  Maximize2,
  Minimize2,
  ArrowRight,
} from 'lucide-react';

type TabId = 'identity' | 'appearance' | 'kit';

export function CharacterCreationPage() {
  const { updateCareer } = useCareer();
  const { navigateTo } = useNavigation();

  // Estado das Abas de Configuração
  const [activeTab, setActiveTab] = useState<TabId>('identity');

  // Modo de exibição do Avatar (Corpo Inteiro vs Busto aproximado)
  const [avatarViewMode, setAvatarViewMode] = useState<'full' | 'bust'>('full');

  // Estado dos Dados do Jogador
  const [firstName, setFirstName] = useState('Gabriel');
  const [lastName, setLastName] = useState('Silva');
  const [displayName, setDisplayName] = useState('Biel');
  const [kitNumber, setKitNumber] = useState(10);
  const [position, setPosition] = useState<PositionId>('MEI');

  // Estado das Características do Avatar
  const [avatar, setAvatar] = useState<PlayerAvatar>({
    skinTone: 3,
    skinColor: '#C68E65',
    hairStyle: 'curto_degrade',
    hairColor: '#111313',
    faceShape: 'oval',
    eyebrows: 'marcante',
    eyes: 'focado',
    mouth: 'firme',
    jerseyStyle: 'solida',
    jerseyPrimaryColor: '#B7FF3C',
    jerseySecondaryColor: '#111313',
    shortsColor: '#111313',
    socksColor: '#111313',
    bootsColor: '#B7FF3C',
    celebrationId: 'padrao',
  });

  // Estado de Validação
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [createdPlayer, setCreatedPlayer] = useState<Player | null>(null);

  // Atualizador parcial do avatar com preview instantâneo
  const handleUpdateAvatar = (patch: Partial<PlayerAvatar>) => {
    setAvatar((prev) => ({ ...prev, ...patch }));
  };

  // Atualizador dos campos de identidade
  const handleUpdateIdentityField = (field: string, val: any) => {
    if (field === 'firstName') setFirstName(val);
    if (field === 'lastName') setLastName(val);
    if (field === 'displayName') setDisplayName(val);
    if (field === 'kitNumber') setKitNumber(val);
    if (field === 'position') setPosition(val);

    // Limpa erro específico ao digitar
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Ação Principal: CRIAR JOGADOR
  const handleCreatePlayer = () => {
    const input = {
      firstName,
      lastName,
      displayName,
      kitNumber,
      position,
      avatar,
    };

    const validation = validatePlayerCreation(input);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      if (validation.errors.firstName || validation.errors.kitNumber || validation.errors.position) {
        setActiveTab('identity');
      } else if (validation.errors.avatarSkin || validation.errors.avatarHair) {
        setActiveTab('appearance');
      }
      return;
    }

    setValidationErrors({});
    const newPlayer = createNewPlayer(input);

    // Salva o jogador criado e o clube provisório no estado da carreira
    updateCareer((prev) => ({
      ...prev,
      player: newPlayer,
      club: PROVISIONAL_CLUB,
    }));

    // Exibe a tela cinematográfica pós-criação
    setCreatedPlayer(newPlayer);
  };

  // Se o jogador foi criado, exibe a apresentação cinematográfica (Item 17)
  if (createdPlayer) {
    return (
      <PlayerIntroCinematic
        player={createdPlayer}
        club={PROVISIONAL_CLUB}
        onConfirmStart={() => navigateTo('hub')}
        onBackToEdit={() => setCreatedPlayer(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-28 space-y-6">
      {/* Cabeçalho Minimalista da Tela */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#191C1C]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#B7FF3C]">
              NOVA CARREIRA
            </span>
            <span className="text-[#8B918E]">•</span>
            <span className="text-xs text-[#8B918E]">Passo 1 de 1</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F4F5F2] tracking-tight mt-1">
            Criação do Atleta
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="dark" className="font-mono text-xs">
            Clube Inicial: {PROVISIONAL_CLUB.name}
          </Badge>
        </div>
      </div>

      {/* Grid Principal: Área do Avatar 2D (Esquerda) & Painel de Configuração (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ==================================================== */}
        {/* ÁREA PRINCIPAL: PALCO DO AVATAR 2D (5 Colunas) */}
        {/* ==================================================== */}
        <div className="lg:col-span-5 bg-[#0C0E0E] rounded-2xl border border-[#222626] p-6 flex flex-col items-center justify-between min-h-[560px] relative overflow-hidden shadow-2xl">
          {/* Efeito de Luz Superior de Vestiário / Estádio */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#B7FF3C]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Barra Superior do Palco: Identificação Dinâmica & Botão de Zoom */}
          <div className="w-full flex items-center justify-between z-10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8B918E] block">
                ATLETA EM CONSTRUÇÃO
              </span>
              <h2 className="text-lg font-bold text-[#F4F5F2] truncate max-w-[200px]">
                {displayName.trim() || firstName.trim() || 'Sem Nome'}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 bg-[#111313] p-1 rounded-xl border border-[#262B2B]">
              <button
                type="button"
                onClick={() => setAvatarViewMode('full')}
                className={`p-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  avatarViewMode === 'full'
                    ? 'bg-[#191C1C] text-[#B7FF3C]'
                    : 'text-[#8B918E] hover:text-[#F4F5F2]'
                }`}
                title="Visualizar Corpo Inteiro"
              >
                <Maximize2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => setAvatarViewMode('bust')}
                className={`p-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  avatarViewMode === 'bust'
                    ? 'bg-[#191C1C] text-[#B7FF3C]'
                    : 'text-[#8B918E] hover:text-[#F4F5F2]'
                }`}
                title="Aproximar Rosto / Busto"
              >
                <Minimize2 size={14} />
              </button>
            </div>
          </div>

          {/* Renderização do Avatar 2D Vetorial */}
          <div className="relative my-auto w-full max-w-[280px] h-[380px] flex items-center justify-center z-10 transition-all duration-300">
            <PlayerAvatar2D
              avatar={avatar}
              kitNumber={kitNumber}
              mode={avatarViewMode}
              className="w-full h-full"
              showGlow={true}
            />
          </div>

          {/* Rodapé do Palco: Resumo Imediato do Atleta */}
          <div className="w-full pt-4 border-t border-[#191C1C] flex items-center justify-between text-xs z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B7FF3C] animate-pulse" />
              <span className="font-mono text-[#8B918E]">Camisa #{kitNumber}</span>
            </div>
            <div className="font-mono font-bold text-[#F4F5F2]">
              {position} • {getPositionName(position)}
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* ÁREA DE CONFIGURAÇÃO: PAINEL DE CONTROLES (7 Colunas) */}
        {/* ==================================================== */}
        <div className="lg:col-span-7 space-y-5">
          {/* Navegação por Abas Limpas */}
          <div className="flex items-center gap-2 p-1.5 bg-[#111313] rounded-2xl border border-[#222626]">
            <button
              type="button"
              onClick={() => setActiveTab('identity')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'identity'
                  ? 'bg-[#191C1C] text-[#F4F5F2] border border-[#262B2B] shadow-sm'
                  : 'text-[#8B918E] hover:text-[#F4F5F2]'
              }`}
            >
              <User size={15} className={activeTab === 'identity' ? 'text-[#B7FF3C]' : ''} />
              <span>1. Identidade & Posição</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('appearance')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'appearance'
                  ? 'bg-[#191C1C] text-[#F4F5F2] border border-[#262B2B] shadow-sm'
                  : 'text-[#8B918E] hover:text-[#F4F5F2]'
              }`}
            >
              <Sparkles size={15} className={activeTab === 'appearance' ? 'text-[#B7FF3C]' : ''} />
              <span>2. Rosto & Cabelo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('kit')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'kit'
                  ? 'bg-[#191C1C] text-[#F4F5F2] border border-[#262B2B] shadow-sm'
                  : 'text-[#8B918E] hover:text-[#F4F5F2]'
              }`}
            >
              <Shirt size={15} className={activeTab === 'kit' ? 'text-[#B7FF3C]' : ''} />
              <span>3. Uniforme & Chuteira</span>
            </button>
          </div>

          {/* Painel do Conteúdo da Aba */}
          <div className="bg-[#0C0E0E] rounded-2xl border border-[#222626] p-6">
            {activeTab === 'identity' && (
              <IdentityTab
                firstName={firstName}
                lastName={lastName}
                displayName={displayName}
                kitNumber={kitNumber}
                position={position}
                errors={validationErrors}
                onUpdateField={handleUpdateIdentityField}
              />
            )}

            {activeTab === 'appearance' && (
              <AppearanceTab avatar={avatar} onChange={handleUpdateAvatar} />
            )}

            {activeTab === 'kit' && (
              <KitTab avatar={avatar} onChange={handleUpdateAvatar} />
            )}
          </div>

          {/* Feedback de Erro Geral se houver */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/50 flex items-start gap-3 text-rose-300 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Por favor, preencha os dados obrigatórios:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-400">
                  {Object.values(validationErrors).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Botão Final de Ação: CRIAR JOGADOR */}
          <div className="pt-2">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleCreatePlayer}
              className="py-4 text-base font-black tracking-wide shadow-[0_0_24px_rgba(183,255,60,0.25)] hover:shadow-[0_0_32px_rgba(183,255,60,0.4)]"
            >
              <CheckCircle2 size={18} />
              CRIAR JOGADOR & INICIAR CARREIRA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
