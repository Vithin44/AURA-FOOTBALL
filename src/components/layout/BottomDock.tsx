/**
 * AURA Football - Layout: BottomDock Flutuante
 * Barra de navegação inferior minimalista, translúcida e moderna (sem sidebars verticais).
 */

import React, { useState } from 'react';
import { useNavigation } from '../../state/navigationState';
import { PageId } from '../../types';
import {
  Home,
  User,
  Swords,
  Dumbbell,
  Calendar,
  Newspaper,
  Trophy,
  ArrowLeftRight,
  ShoppingBag,
  Sparkles,
  Settings,
  Terminal,
  MoreHorizontal,
  X,
} from 'lucide-react';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export function BottomDock() {
  const { activePage, navigateTo } = useNavigation();
  const [showDrawer, setShowDrawer] = useState(false);

  // Principais botões fixos no Dock
  const primaryItems: NavItem[] = [
    { id: 'hub', label: 'Central', icon: Home },
    { id: 'player', label: 'Atleta', icon: User },
    { id: 'matches', label: 'Partida', icon: Swords },
    { id: 'training', label: 'Treino', icon: Dumbbell },
    { id: 'news', label: 'Imprensa', icon: Newspaper },
  ];

  // Itens complementares acessíveis pelo menu rápido "Mais"
  const secondaryItems: NavItem[] = [
    { id: 'character_creation', label: 'Criar Jogador & Avatar', icon: Sparkles },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'club', label: 'Meu Clube', icon: User },
    { id: 'transfers', label: 'Mercado', icon: ArrowLeftRight },
    { id: 'trophies', label: 'Sala de Troféus', icon: Trophy },
    { id: 'store', label: 'Loja Oficial', icon: ShoppingBag },
    { id: 'casino', label: 'Cassino VIP', icon: Sparkles },
    { id: 'settings', label: 'Ajustes & Save', icon: Settings },
    { id: 'diagnostics', label: 'Diagnóstico da Engine', icon: Terminal },
  ];

  const handleSelect = (id: PageId) => {
    navigateTo(id);
    setShowDrawer(false);
  };

  return (
    <>
      {/* Modal / Gaveta de Menus Complementares */}
      {showDrawer && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowDrawer(false)}
        >
          <div
            className="w-full max-w-md bg-[#111313] border border-[#222626] rounded-2xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#191C1C]">
              <div>
                <h3 className="text-sm font-bold text-[#F4F5F2]">Módulos da Carreira</h3>
                <p className="text-xs text-[#8B918E]">Navegue pelos setores e ferramentas</p>
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="w-7 h-7 rounded-lg bg-[#191C1C] flex items-center justify-center text-[#8B918E] hover:text-[#F4F5F2]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                const isDiagnostics = item.id === 'diagnostics';

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#B7FF3C]/10 border-[#B7FF3C] text-[#B7FF3C]'
                        : isDiagnostics
                        ? 'bg-[#191C1C]/80 border-[#B7FF3C]/30 text-[#F4F5F2] hover:border-[#B7FF3C]'
                        : 'bg-[#191C1C] border-[#262B2B] text-[#8B918E] hover:text-[#F4F5F2] hover:bg-[#202525]'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        isActive
                          ? 'bg-[#B7FF3C] text-[#080909]'
                          : isDiagnostics
                          ? 'bg-[#B7FF3C]/20 text-[#B7FF3C]'
                          : 'bg-[#111313] text-[#8B918E]'
                      }`}
                    >
                      <Icon size={14} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold block leading-tight text-[#F4F5F2]">
                        {item.label}
                      </span>
                      {isDiagnostics && (
                        <span className="text-[10px] text-[#B7FF3C] font-mono leading-none">
                          Página separada
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Barra Flutuante (BottomDock) */}
      <nav
        aria-label="Navegação Principal"
        className="fixed bottom-4 inset-x-0 mx-auto max-w-lg z-40 px-3 pointer-events-none"
      >
        <div className="pointer-events-auto bg-[#111313]/90 backdrop-blur-lg border border-[#222626] rounded-2xl p-1.5 shadow-2xl flex items-center justify-between gap-1">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#B7FF3C] text-[#080909] font-bold shadow-sm'
                    : 'text-[#8B918E] hover:text-[#F4F5F2] hover:bg-[#191C1C]'
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] font-display mt-0.5 tracking-tight truncate max-w-[55px]">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Botão de Atalho Direto para Diagnóstico da Engine na Barra */}
          <button
            onClick={() => handleSelect('diagnostics')}
            title="Página Separada de Teste da Engine"
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all cursor-pointer select-none ${
              activePage === 'diagnostics'
                ? 'bg-[#B7FF3C] text-[#080909] font-bold shadow-sm'
                : 'text-[#B7FF3C]/80 hover:text-[#B7FF3C] hover:bg-[#191C1C]'
            }`}
          >
            <Terminal size={18} />
            <span className="text-[10px] font-mono mt-0.5 tracking-tight">Engine</span>
          </button>

          {/* Botão Mais */}
          <button
            onClick={() => setShowDrawer(true)}
            className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all cursor-pointer select-none ${
              showDrawer
                ? 'bg-[#191C1C] text-[#F4F5F2]'
                : 'text-[#8B918E] hover:text-[#F4F5F2] hover:bg-[#191C1C]'
            }`}
            title="Mais Opções"
          >
            <MoreHorizontal size={18} />
            <span className="text-[10px] font-display mt-0.5 tracking-tight">Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
}
