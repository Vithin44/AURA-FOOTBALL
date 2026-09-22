/**
 * AURA Football - Engine: Sistema de Economia (Fichas)
 * Fonte única de verdade de saldo para a carreira e futuro Cassino.
 */

export interface TransactionResult {
  success: boolean;
  newBalance: number;
  message?: string;
}

export class EconomyEngine {
  /**
   * Adiciona Fichas ao saldo atual
   */
  public static credit(currentBalance: number, amount: number, reason?: string): TransactionResult {
    if (amount <= 0 || !Number.isInteger(amount)) {
      return {
        success: false,
        newBalance: currentBalance,
        message: 'A quantia de Fichas deve ser um número inteiro positivo.',
      };
    }

    const newBalance = currentBalance + amount;
    return {
      success: true,
      newBalance,
      message: reason || 'Crédito de Fichas efetuado.',
    };
  }

  /**
   * Debita Fichas do saldo atual com garantia de não-negatividade
   */
  public static debit(currentBalance: number, amount: number, reason?: string): TransactionResult {
    if (amount <= 0 || !Number.isInteger(amount)) {
      return {
        success: false,
        newBalance: currentBalance,
        message: 'A quantia de Fichas deve ser um número inteiro positivo.',
      };
    }

    if (currentBalance < amount) {
      return {
        success: false,
        newBalance: currentBalance,
        message: 'Saldo insuficiente de Fichas.',
      };
    }

    const newBalance = currentBalance - amount;
    return {
      success: true,
      newBalance,
      message: reason || 'Débito de Fichas efetuado.',
    };
  }
}
