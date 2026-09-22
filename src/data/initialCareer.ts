/**
 * AURA Football - Dados Iniciais Padrão para Criação/Reset da Carreira
 */

import { Career } from '../types';
import { INITIAL_CLUBS } from './clubs';

export const INITIAL_CAREER_TEMPLATE: Career = {
  id: 'career_save_default',
  saveName: 'Nova Jornada',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  player: {
    id: 'player_01',
    name: 'Gabriel Silva',
    nickname: 'Biel',
    age: 18,
    country: 'Brasil',
    position: 'MEI',
    kitNumber: 10,
    attributes: {
      VEL: 72,
      FIN: 65,
      DRI: 74,
      FOR: 60,
      PAS: 70,
      DEF: 45,
    },
    ovr: 68,
    aura: 50, // Início neutro da AURA
    xp: 0,
    level: 1,
    status: 'Disponível',
    influence: 20,
    prestige: 'Promessa',
    contract: {
      clubId: 'club_paulista',
      salary: 1200,
      yearsRemaining: 2,
    },
    avatar: {
      skinTone: 2,
      hairStyle: 'curto_degrade',
      hairColor: 'preto',
      bootsColor: '#B7FF3C',
      celebrationId: 'deslize_joelhos',
    },
    stats: {
      matches: 0,
      goals: 0,
      assists: 0,
      averageRating: 0,
      yellowCards: 0,
      redCards: 0,
    },
  },
  club: INITIAL_CLUBS[0],
  season: {
    year: 2026,
    seasonNumber: 1,
    currentWeek: 1,
    totalWeeks: 38,
    currentPhase: 'Pré-temporada',
  },
  currency: {
    fichas: 150, // Fonte única oficial de saldo virtual
  },
  progress: {
    level: 1,
    currentXP: 0,
    nextLevelXP: 1000,
    attributePointsAvailable: 0,
  },
  trophies: [],
  history: [],
  news: [
    {
      id: 'news_01',
      title: 'Apresentação no Paulista FC',
      description: 'Gabriel Silva veste a camisa 10 e inicia sua trajetória profissional.',
      date: '2026-09-01',
      category: 'Geral',
    },
  ],
};
