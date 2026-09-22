/**
 * AURA Football - State: Navegação Centralizada
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PageId } from '../types';

interface NavigationContextType {
  activePage: PageId;
  navigateTo: (page: PageId) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({
  children,
  initialPage = 'home',
}: {
  children: ReactNode;
  initialPage?: PageId;
}) {
  const [activePage, setActivePage] = useState<PageId>(initialPage);

  return (
    <NavigationContext.Provider
      value={{
        activePage,
        navigateTo: setActivePage,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation deve ser utilizado dentro de um NavigationProvider');
  }
  return context;
}
