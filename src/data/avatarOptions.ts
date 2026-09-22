/**
 * AURA Football - Opções de Customização do Avatar 2D
 * Fonte de dados para opções de pele, cabelo, feições e uniformes.
 */

import {
  HairStyleId,
  FaceShapeId,
  EyebrowsId,
  EyesId,
  MouthId,
  JerseyStyleId,
} from '../types';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface OptionItem<T extends string> {
  id: T;
  label: string;
  description?: string;
}

// 1. Tons de Pele (1 a 6)
export const SKIN_TONES: Array<{ id: number; name: string; hex: string; shadowHex: string }> = [
  { id: 1, name: 'Claro Natural', hex: '#F9DAC3', shadowHex: '#E2B89C' },
  { id: 2, name: 'Trigo / Médio Claro', hex: '#E7B68E', shadowHex: '#CF9667' },
  { id: 3, name: 'Bronze / Moreno Claro', hex: '#C68E65', shadowHex: '#A96E45' },
  { id: 4, name: 'Moreno Médio', hex: '#A36842', shadowHex: '#844D29' },
  { id: 5, name: 'Cacau / Negro Suave', hex: '#77472B', shadowHex: '#58301A' },
  { id: 6, name: 'Ébano / Negro Intenso', hex: '#482B1A', shadowHex: '#301A0E' },
];

// 2. Estilos de Cabelo
export const HAIR_STYLES: OptionItem<HairStyleId>[] = [
  { id: 'curto_degrade', label: 'Fade / Degradê', description: 'Lateral raspada com topo alinhado' },
  { id: 'ondulado', label: 'Ondulado Médio', description: 'Volume natural e textura alta' },
  { id: 'moicano', label: 'Moicano Atlético', description: 'Laterais limpas e crista estilizada' },
  { id: 'dreads', label: 'Tranças / Dreads', description: 'Trançado esportivo preso para trás' },
  { id: 'topete', label: 'Topete Clássico', description: 'Penteado com fixador lateral' },
  { id: 'raspado', label: 'Raspado Máquina', description: 'Corte militar rente ao couro cabeludo' },
];

// 3. Cores de Cabelo
export const HAIR_COLORS: ColorOption[] = [
  { id: 'preto', name: 'Preto Profundo', hex: '#111313' },
  { id: 'castanho_escuro', name: 'Castanho Escuro', hex: '#37251C' },
  { id: 'castanho_claro', name: 'Castanho Claro', hex: '#6C4831' },
  { id: 'loiro', name: 'Loiro Dourado', hex: '#D2AD6B' },
  { id: 'platinado', name: 'Platinado Nevado', hex: '#E8ECEF' },
  { id: 'ruivo', name: 'Ruivo Queimado', hex: '#9E3C22' },
  { id: 'aura_green', name: 'Verde AURA', hex: '#B7FF3C' },
  { id: 'azul_eletrico', name: 'Azul Neon', hex: '#3B82F6' },
];

// 4. Formatos de Rosto
export const FACE_SHAPES: OptionItem<FaceShapeId>[] = [
  { id: 'oval', label: 'Oval Esportivo', description: 'Linhas suaves e simétricas' },
  { id: 'quadrado', label: 'Mandíbula Firme', description: 'Ângulos retos e queixo marcante' },
  { id: 'alongado', label: 'Alongado Fino', description: 'Perfil esguio e aerodinâmico' },
];

// 5. Sobrancelhas
export const EYEBROW_STYLES: OptionItem<EyebrowsId>[] = [
  { id: 'marcante', label: 'Marcante', description: 'Densidade atlética firme' },
  { id: 'fina', label: 'Alinhada', description: 'Traço fino e limpo' },
  { id: 'arqueada', label: 'Arqueada', description: 'Expressão focada e desafiadora' },
];

// 6. Olhos
export const EYE_STYLES: OptionItem<EyesId>[] = [
  { id: 'focado', label: 'Focado', description: 'Olhar compenetrado na bola' },
  { id: 'amendoado', label: 'Amendoado', description: 'Linhas horizontais equilibradas' },
  { id: 'intenso', label: 'Intenso', description: 'Foco competitivo agressivo' },
];

// 7. Boca / Expressão
export const MOUTH_STYLES: OptionItem<MouthId>[] = [
  { id: 'firme', label: 'Firme', description: 'Concentração antes do apito' },
  { id: 'neutra', label: 'Neutra', description: 'Calma e postura equilibrada' },
  { id: 'sorriso_leve', label: 'Confiante', description: 'Leve sorriso de liderança' },
];

// 8. Estilos de Camisa
export const JERSEY_STYLES: OptionItem<JerseyStyleId>[] = [
  { id: 'solida', label: 'Sólida Pro', description: 'Design clean minimalista' },
  { id: 'listrada', label: 'Listras Clássicas', description: 'Listras verticais tradicionais' },
  { id: 'faixa_diagonal', label: 'Faixa Diagonal', description: 'Faixa transversal dinâmica' },
  { id: 'gola_v', label: 'Gola V Moderna', description: 'Recorte geométrico e detalhes nos ombros' },
];

// 9. Paleta de Cores de Roupas & Acessórios
export const KIT_COLORS: ColorOption[] = [
  { id: 'aura_green', name: 'AURA Green', hex: '#B7FF3C' },
  { id: 'dark_base', name: 'Preto Noite', hex: '#111313' },
  { id: 'off_white', name: 'Branco Gelo', hex: '#F4F5F2' },
  { id: 'crimson', name: 'Vermelho Fogo', hex: '#E5484D' },
  { id: 'royal_blue', name: 'Azul Real', hex: '#3B82F6' },
  { id: 'gold', name: 'Dourado Campeão', hex: '#D9B65D' },
  { id: 'electric_cyan', name: 'Ciano Veloz', hex: '#06B6D4' },
  { id: 'graphite', name: 'Grafite Fosco', hex: '#262B2B' },
];

// 10. Cores de Chuteira
export const BOOT_COLORS: ColorOption[] = [
  { id: 'aura_green', name: 'AURA Speed Neon', hex: '#B7FF3C' },
  { id: 'blackout', name: 'Blackout Couro', hex: '#111313' },
  { id: 'whiteout', name: 'Whiteout Puro', hex: '#F4F5F2' },
  { id: 'fire_red', name: 'Vermelho Ataque', hex: '#E5484D' },
  { id: 'electric_blue', name: 'Azul Controle', hex: '#3B82F6' },
  { id: 'gold_trophy', name: 'Ouro Especial', hex: '#D9B65D' },
];
