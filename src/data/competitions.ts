/**
 * AURA Football - Catálogo de Competições Base
 */

import { Competition } from '../types';

export const INITIAL_COMPETITIONS: Competition[] = [
  {
    id: 'comp_estadual',
    name: 'Campeonato Estadual',
    type: 'Liga',
    country: 'Brasil',
    difficulty: 'Média',
  },
  {
    id: 'comp_copa_nacional',
    name: 'Copa Nacional',
    type: 'Copa Nacional',
    country: 'Brasil',
    difficulty: 'Alta',
  },
  {
    id: 'comp_continental',
    name: 'Copa dos Campeões da América',
    type: 'Continental',
    difficulty: 'Alta',
  },
  {
    id: 'comp_mundial',
    name: 'Copa do Mundo de Seleções',
    type: 'Mundial',
    difficulty: 'Extrema',
  },
];
