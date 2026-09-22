/**
 * AURA Football - Ponto de Entrada da Aplicação (App)
 * Integrado com TopBar contextual, BottomDock flutuante e roteamento completo.
 */

import React from 'react';
import { CareerProvider } from '../state/careerState';
import { NavigationProvider, useNavigation } from '../state/navigationState';
import { TopBar } from '../components/layout/TopBar';
import { BottomDock } from '../components/layout/BottomDock';
import { HubPage } from '../pages/HubPage';
import { PlayerPage } from '../pages/PlayerPage';
import { DiagnosticsPage } from '../pages/DiagnosticsPage';
import { CharacterCreationPage } from '../pages/CharacterCreationPage';
import { MatchPage } from '../pages/MatchPage';
import {
  ClubPage,
  CalendarPage,
  TrainingPage,
  TransfersPage,
  NewsPage,
  TrophiesPage,
  StorePage,
  CasinoPage,
  SettingsPage,
} from '../pages/modules';

function Router() {
  const { activePage } = useNavigation();

  switch (activePage) {
    case 'home':
    case 'hub':
      return <HubPage />;
    case 'diagnostics':
      return <DiagnosticsPage />;
    case 'player':
      return <PlayerPage />;
    case 'matches':
      return <MatchPage />;
    case 'club':
      return <ClubPage />;
    case 'calendar':
      return <CalendarPage />;
    case 'training':
      return <TrainingPage />;
    case 'transfers':
      return <TransfersPage />;
    case 'news':
      return <NewsPage />;
    case 'trophies':
      return <TrophiesPage />;
    case 'store':
      return <StorePage />;
    case 'casino':
      return <CasinoPage />;
    case 'settings':
      return <SettingsPage />;
    case 'character_creation':
      return <CharacterCreationPage />;
    default:
      return <HubPage />;
  }
}

export function App() {
  return (
    <CareerProvider>
      <NavigationProvider initialPage="hub">
        <div className="min-h-screen bg-[#080909] text-[#F4F5F2] font-sans antialiased selection:bg-[#B7FF3C] selection:text-[#080909] flex flex-col">
          {/* Barra Superior Contextual */}
          <TopBar />

          {/* Área Principal de Conteúdo */}
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            <Router />
          </main>

          {/* Barra Inferior Flutuante (BottomDock) */}
          <BottomDock />
        </div>
      </NavigationProvider>
    </CareerProvider>
  );
}

export default App;
