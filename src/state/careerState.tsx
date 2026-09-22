/**
 * AURA Football - State: Gerenciamento Centralizado da Carreira
 * Estado global previsível, tipado e conectado aos módulos da Engine.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Career, Player } from '../types';
import { INITIAL_CAREER_TEMPLATE } from '../data/initialCareer';
import { SaveSystem } from '../engine/save';
import { EconomyEngine } from '../engine/economy';
import { validateCareer } from '../engine/validation';

interface CareerContextType {
  career: Career;
  setCareer: React.Dispatch<React.SetStateAction<Career>>;
  updateCareer: (updater: (prev: Career) => Career) => void;
  saveCareer: () => boolean;
  loadSavedCareer: () => boolean;
  resetCareer: () => void;
  creditFichas: (amount: number, reason?: string) => boolean;
  spendFichas: (amount: number, reason?: string) => boolean;
  updatePlayer: (updater: (prev: Player) => Player) => void;
  isValid: boolean;
  validationErrors: string[];
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

export function CareerProvider({ children }: { children: ReactNode }) {
  const [career, setCareer] = useState<Career>(() => {
    // Tenta carregar save existente ou usa template padrão inicial
    const existing = SaveSystem.loadFromStorage();
    if (existing) {
      return existing.career;
    }
    return INITIAL_CAREER_TEMPLATE;
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Valida sempre que o estado da carreira muda
  useEffect(() => {
    const res = validateCareer(career);
    setValidationErrors(res.errors);
  }, [career]);

  const saveCareer = (): boolean => {
    return SaveSystem.saveToStorage(career);
  };

  const loadSavedCareer = (): boolean => {
    const loaded = SaveSystem.loadFromStorage();
    if (loaded) {
      setCareer(loaded.career);
      return true;
    }
    return false;
  };

  const resetCareer = () => {
    setCareer(INITIAL_CAREER_TEMPLATE);
    SaveSystem.clearStorage();
  };

  const creditFichas = (amount: number, reason?: string): boolean => {
    const result = EconomyEngine.credit(career.currency.fichas, amount, reason);
    if (result.success) {
      setCareer((prev) => ({
        ...prev,
        currency: { fichas: result.newBalance },
        updatedAt: new Date().toISOString(),
      }));
      return true;
    }
    return false;
  };

  const spendFichas = (amount: number, reason?: string): boolean => {
    const result = EconomyEngine.debit(career.currency.fichas, amount, reason);
    if (result.success) {
      setCareer((prev) => ({
        ...prev,
        currency: { fichas: result.newBalance },
        updatedAt: new Date().toISOString(),
      }));
      return true;
    }
    return false;
  };

  const updatePlayer = (updater: (prev: Player) => Player) => {
    setCareer((prev) => ({
      ...prev,
      player: updater(prev.player),
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateCareer = (updater: (prev: Career) => Career) => {
    setCareer((prev) => ({
      ...updater(prev),
      updatedAt: new Date().toISOString(),
    }));
  };

  return (
    <CareerContext.Provider
      value={{
        career,
        setCareer,
        updateCareer,
        saveCareer,
        loadSavedCareer,
        resetCareer,
        creditFichas,
        spendFichas,
        updatePlayer,
        isValid: validationErrors.length === 0,
        validationErrors,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer(): CareerContextType {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer deve ser utilizado dentro de um CareerProvider');
  }
  return context;
}
