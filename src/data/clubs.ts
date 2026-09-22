/**
 * AURA Football - Catálogo de Clubes Base
 */

import { Club } from '../types';

export const INITIAL_CLUBS: Club[] = [
  {
    id: 'club_paulista',
    name: 'Paulista FC',
    shortName: 'PFC',
    country: 'Brasil',
    league: 'Campeonato Estadual',
    ovr: 65,
    prestige: 'Pequeno',
    stadium: 'Estádio da Colina',
    primaryColor: '#E5484D',
    secondaryColor: '#111313',
  },
  {
    id: 'club_esperanca',
    name: 'Esperança Atlético',
    shortName: 'ESP',
    country: 'Brasil',
    league: 'Campeonato Estadual',
    ovr: 66,
    prestige: 'Pequeno',
    stadium: 'Arena Esperança',
    primaryColor: '#B7FF3C',
    secondaryColor: '#080909',
  },
  {
    id: 'club_metropolitano',
    name: 'Metropolitano',
    shortName: 'MET',
    country: 'Brasil',
    league: 'Divisão Nacional',
    ovr: 74,
    prestige: 'Médio',
    stadium: 'Parque Central',
    primaryColor: '#3B82F6',
    secondaryColor: '#191C1C',
  },
  {
    id: 'club_alvirrubro',
    name: 'União Alvirrubro',
    shortName: 'UAR',
    country: 'Brasil',
    league: 'Primeira Divisão',
    ovr: 82,
    prestige: 'Grande',
    stadium: 'Caldeirão Vermelho',
    primaryColor: '#DC2626',
    secondaryColor: '#F4F5F2',
  },
];
