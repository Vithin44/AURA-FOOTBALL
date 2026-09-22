/**
 * AURA Football - Engine: Módulo do Jogador
 * Preparado para cálculos de OVR, evolução e regras de atleta nos próximos prompts.
 */

import { Player, PositionId, PlayerAttributes } from '../../types';
import { calculateOVR, syncPlayerOVR } from '../ovr';

export { calculateOVR, syncPlayerOVR };

export class PlayerEngine {
  /**
   * Cálculo oficial de OVR por pesos de posição (Prompt 06)
   */
  public static calculateOVR(position: PositionId, attributes: PlayerAttributes): number {
    return calculateOVR(attributes, position);
  }

  /**
   * Sincroniza o OVR do jogador
   */
  public static syncOVR(player: Player): Player {
    return syncPlayerOVR(player);
  }

  /**
   * Reseta a AURA para o valor padrão de início de partida (50)
   */
  public static resetMatchAura(): number {
    return 50;
  }
}

