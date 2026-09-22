/**
 * AURA Football - Engine: Gerador de Números Pseudo-Aleatórios (RNG)
 * Implementação Mulberry32 controlável com suporte a Seed para simulações reproduzíveis.
 */

class SeedableRNG {
  private seed: number;

  constructor(initialSeed = Date.now()) {
    this.seed = initialSeed;
  }

  /**
   * Define uma nova semente para o gerador
   */
  public setSeed(seed: number): void {
    this.seed = seed;
  }

  /**
   * Retorna a semente atual
   */
  public getSeed(): number {
    return this.seed;
  }

  /**
   * Gera um float no intervalo [0, 1)
   */
  public nextFloat(): number {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Gera um número inteiro no intervalo [min, max] (inclusivo)
   */
  public nextInt(min: number, max: number): number {
    const clampedMin = Math.ceil(min);
    const clampedMax = Math.floor(max);
    return Math.floor(this.nextFloat() * (clampedMax - clampedMin + 1)) + clampedMin;
  }

  /**
   * Testa uma chance percentual (0 a 100)
   */
  public chance(percentage: number): boolean {
    return this.nextFloat() * 100 < percentage;
  }

  /**
   * Escolhe um elemento aleatório de uma lista
   */
  public pickOne<T>(list: readonly T[]): T {
    const index = this.nextInt(0, list.length - 1);
    return list[index];
  }
}

// Instância singleton padrão da Engine
export const rng = new SeedableRNG();

// Fábrica para criar geradores isolados com sementes específicas quando necessário
export function createRNG(seed: number): SeedableRNG {
  return new SeedableRNG(seed);
}
