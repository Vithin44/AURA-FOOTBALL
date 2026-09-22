/**
 * AURA Football - Engine: Sistema de Salvamento Estruturado e Versionado
 */

import { Career, SaveData, GameSettings } from '../types';
import { validateCareer } from './validation';

export const CURRENT_SAVE_VERSION = 1;
export const CURRENT_ENGINE_VERSION = '0.1.0';

export const DEFAULT_SETTINGS: GameSettings = {
  language: 'pt-BR',
  simulationSpeed: 'normal',
  decisionTimerDuration: 15,
  soundEnabled: true,
  reducedMotion: false,
};

const STORAGE_KEY = 'aura_football_save_slot_01';

export class SaveSystem {
  /**
   * Empacota o estado da carreira em um formato de Save versionado
   */
  public static packageSave(career: Career, settings: GameSettings = DEFAULT_SETTINGS): SaveData {
    return {
      metadata: {
        saveVersion: CURRENT_SAVE_VERSION,
        engineVersion: CURRENT_ENGINE_VERSION,
        timestamp: Date.now(),
      },
      career,
      settings,
    };
  }

  /**
   * Salva no LocalStorage do navegador de forma segura
   */
  public static saveToStorage(career: Career, settings: GameSettings = DEFAULT_SETTINGS): boolean {
    try {
      const validation = validateCareer(career);
      if (!validation.isValid) {
        console.error('Falha ao salvar: dados da carreira inválidos', validation.errors);
        return false;
      }

      const saveData = this.packageSave(career, settings);
      const serialized = JSON.stringify(saveData);
      localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    } catch (err) {
      console.error('Erro ao persistir save no LocalStorage:', err);
      return false;
    }
  }

  /**
   * Carrega e valida os dados do LocalStorage
   */
  public static loadFromStorage(): SaveData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw) as SaveData;
      if (!parsed.metadata || typeof parsed.metadata.saveVersion !== 'number') {
        console.warn('Save corrompido ou sem metadados de versão.');
        return null;
      }

      const validation = validateCareer(parsed.career);
      if (!validation.isValid) {
        console.warn('Save existente possui dados inválidos:', validation.errors);
        return null;
      }

      return parsed;
    } catch (err) {
      console.error('Erro ao carregar save do LocalStorage:', err);
      return null;
    }
  }

  /**
   * Remove o save do LocalStorage
   */
  public static clearStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Erro ao limpar save do storage:', err);
    }
  }
}
