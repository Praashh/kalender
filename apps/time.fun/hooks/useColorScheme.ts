import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const THEME_STORAGE_KEY = '@kalender_theme_preference';

export type ThemeMode = 'light' | 'dark' | 'system';

export function useColorScheme() {
  const systemColorScheme = useRNColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setThemeMode(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setTheme = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeMode(mode);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setTheme(newMode);
  };

  // Determine the actual theme based on mode and system preference
  const getCurrentTheme = (): 'light' | 'dark' => {
    if (themeMode === 'system') {
      return systemColorScheme ?? 'light';
    }
    return themeMode;
  };

  return {
    theme: getCurrentTheme(),
    themeMode,
    setTheme,
    toggleTheme,
    isLoaded,
  };
}
