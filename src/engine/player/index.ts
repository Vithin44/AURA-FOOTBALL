/**
 * AURA Football - Engine: Módulo do Jogador
 * Preparado para cálculos de OVR, evolução e regras de atleta nos próximos prompts.
 */

import { Player, PositionId, PlayerAttributes } from '../../types';

export class PlayerEngine {
  /**
   * Stub de preparação para cálculo de OVR por pesos de posição
   */
  public static calculateOVR(position: PositionId, attributes: PlayerAttributes): number {
    // Cálculo inicial ponderado básico da fundação (será refinado pelo prompt específico)
    const values = Object.values(attributes);
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    return Math.round(avg);
  }

  /**
   * Reseta a AURA para o valor padrão de início de partida (50)
   */
  public static resetMatchAura(): number {
    return 50;
  }
}
