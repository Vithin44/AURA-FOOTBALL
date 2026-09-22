/**
 * AURA Football - Tokens do Design System
 * Fonte centralizada de valores visuais, espaçamentos e transições.
 */

export const DESIGN_TOKENS = {
  colors: {
    bgBase: '#080909',
    bgDark: '#111313',
    bgSoft: '#191C1C',
    textWhite: '#F4F5F2',
    textMuted: '#8B918E',
    auraGreen: '#B7FF3C',
    auraRed: '#E5484D',
    auraGold: '#D9B65D',
    borderSubtle: '#222626',
    borderFocus: '#2A3030',
  },
  typography: {
    fontDisplay: "'Archivo', system-ui, -apple-system, sans-serif",
    fontMono: "'IBM Plex Mono', monospace",
  },
  animation: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: '450ms cubic-bezier(0.4, 0, 0.2, 1)',
    cinematic: '800ms cubic-bezier(0.16, 1, 0.3, 1)',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },
  spacing: {
    containerMax: '1280px',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;
