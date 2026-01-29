/**
 * Zipo-style color palette for the rider app.
 * Primary: Teal/Turquoise accent
 * Secondary: Neutral grays
 */

// Zipo brand teal colors
const tealPrimary = '#14B8A6';
const tealLight = '#2DD4BF';
const tealDark = '#0D9488';

export const Colors = {
  // Brand colors (use these for consistent Zipo styling)
  brand: {
    teal: tealPrimary,
    tealLight: tealLight,
    tealDark: tealDark,
    gold: '#FACC15',
    goldLight: '#FDE047',
    green: '#22C55E',
    greenLight: '#4ADE80',
  },

  light: {
    text: '#1f2937',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    tint: tealPrimary,
    icon: '#6b7280',
    tabIconDefault: '#9ca3af',
    tabIconSelected: tealPrimary,
    primary: tealPrimary,
    primaryLight: tealLight,
    primaryDark: tealDark,
    secondary: '#64748b',
    success: '#22C55E',
    warning: '#f59e0b',
    error: '#ef4444',
    card: '#ffffff',
    cardMuted: '#f8fafc',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    muted: '#f1f5f9',
    accent: tealPrimary,
    rating: '#FACC15',
  },
  dark: {
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    tint: tealLight,
    icon: '#94a3b8',
    tabIconDefault: '#64748b',
    tabIconSelected: tealLight,
    primary: tealLight,
    primaryLight: '#5EEAD4',
    primaryDark: tealPrimary,
    secondary: '#94a3b8',
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#f87171',
    card: '#1e293b',
    cardMuted: '#334155',
    border: '#334155',
    borderLight: '#475569',
    muted: '#334155',
    accent: tealLight,
    rating: '#FACC15',
  },
};
