/**
 * AURA Football - Apresentação Cinematográfica do Atleta Criado
 * Tela imersiva pós-criação com avatar em destaque, dados principais e botão de entrada na carreira.
 */

import React from 'react';
import { Player, Club } from '../../types';
import { PlayerAvatar2D } from '../avatar/PlayerAvatar2D';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { getPositionName } from '../../utils/formatters';
import { ArrowRight, Edit3, Shield, Sparkles, Trophy } from 'lucide-react';

interface PlayerIntroCinematicProps {
  player: Player;
  club: Club;
  onConfirmStart: () => void;
  onBackToEdit: () => void;
}

export function PlayerIntroCinematic({
  player,
  club,
  onConfirmStart,
  onBackToEdit,
}: PlayerIntroCinematicProps) {
  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center max-w-5xl mx-auto px-4 py-8 overflow-hidden">
      {/* Luz ambiente de estádio / holofotes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#B7FF3C]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center text-center space-y-8">
        {/* Título de Entrada Cinematográfica */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-[#B7FF3C]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#B7FF3C] font-bold">
              NOVO ATLETA REGISTRADO NO SISTEMA
            </span>
            <span className="w-8 h-px bg-[#B7FF3C]" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-[#F4F5F2] tracking-tight">
            {player.name}
          </h1>

          {player.nickname && player.nickname !== player.name && (
            <p className="text-lg text-[#8B918E] font-medium">
              Conhecido nos gramados como "{player.nickname}"
            </p>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <Badge variant="green" className="text-sm px-3 py-1">
              #{player.kitNumber} • {player.position} ({getPositionName(player.position)})
            </Badge>
            <Badge variant="dark" className="text-sm px-3 py-1">
              {club.name} ({club.league})
            </Badge>
          </div>
        </div>

        {/* Palco do Avatar 2D */}
        <div className="relative w-72 sm:w-80 h-96 flex items-center justify-center">
          <div className="absolute bottom-2 w-56 h-6 bg-[#000000] rounded-full blur-md opacity-80" />
          <PlayerAvatar2D
            avatar={player.avatar}
            kitNumber={player.kitNumber}
            mode="full"
            className="w-full h-full"
            showGlow={true}
          />
        </div>

        {/* Rodapé e Ação Principal */}
        <div className="w-full max-w-md space-y-4 pt-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono text-[#8B918E] uppercase tracking-widest block">
              STATUS DA CARREIRA
            </span>
            <p className="text-sm text-[#F4F5F2] font-medium">
              Contrato assinado com o {club.name}. Sua jornada até o topo do futebol começa agora.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={onBackToEdit}
              className="w-full sm:w-auto"
            >
              <Edit3 size={16} />
              Refinar Detalhes
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={onConfirmStart}
              className="w-full flex-1 text-base shadow-[0_0_24px_rgba(183,255,60,0.3)]"
            >
              Iniciar Carreira no HUB
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
