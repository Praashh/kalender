import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { NavigationService } from '../navigation/NavigationService';

// Hook for managing navigation state and providing utilities
export const useNavigationState = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [canGoBack, setCanGoBack] = useState(false);

  // Update canGoBack state
  useEffect(() => {
    const updateCanGoBack = () => {
      setCanGoBack(navigation.canGoBack());
    };

    updateCanGoBack();
    
    // Listen for navigation state changes
    const unsubscribe = navigation.addListener('state', updateCanGoBack);
    
    return unsubscribe;
  }, [navigation]);

  // Navigation utilities
  const goBack = useCallback(() => {
    if (canGoBack) {
      NavigationService.goBack();
    }
  }, [canGoBack]);

  const navigate = useCallback((routeName: string, params?: any) => {
    NavigationService.navigate(routeName as any, params);
  }, []);

  const reset = useCallback((routeName: string, params?: any) => {
    NavigationService.reset(routeName as any, params);
  }, []);

  const replace = useCallback((routeName: string, params?: any) => {
    NavigationService.replace(routeName as any, params);
  }, []);

  const push = useCallback((routeName: string, params?: any) => {
    NavigationService.push(routeName as any, params);
  }, []);

  const pop = useCallback((count: number = 1) => {
    NavigationService.pop(count);
  }, []);

  const popToTop = useCallback(() => {
    NavigationService.popToTop();
  }, []);

  const getCurrentRoute = useCallback(() => {
    return NavigationService.getCurrentRoute();
  }, []);

  const getCurrentRouteName = useCallback(() => {
    return NavigationService.getCurrentRouteName();
  }, []);

  return {
    // State
    isFocused,
    canGoBack,
    
    // Navigation methods
    goBack,
    navigate,
    reset,
    replace,
    push,
    pop,
    popToTop,
    getCurrentRoute,
    getCurrentRouteName,
    
    // Direct navigation object access
    navigation,
  };
};

// Hook for preventing going back (useful for auth screens, forms, etc.)
export const usePreventGoBack = (prevent: boolean = true, onPrevent?: () => void) => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      if (!prevent) return;

      const onBackPress = () => {
        if (onPrevent) {
          onPrevent();
        }
        return true; // Prevent default back behavior
      };

      // Add back button listener
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (!prevent) return;

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Execute custom prevent logic
        if (onPrevent) {
          onPrevent();
        }
      });

      return unsubscribe;
    }, [navigation, prevent, onPrevent])
  );
};

// Hook for handling navigation lifecycle events
export const useNavigationLifecycle = (callbacks: {
  onFocus?: () => void;
  onBlur?: () => void;
  onBeforeRemove?: () => void;
  onStateChange?: () => void;
}) => {
  const navigation = useNavigation();
  const { onFocus, onBlur, onBeforeRemove, onStateChange } = callbacks;

  useFocusEffect(
    useCallback(() => {
      if (onFocus) {
        onFocus();
      }

      return () => {
        if (onBlur) {
          onBlur();
        }
      };
    }, [onFocus, onBlur])
  );

  useEffect(() => {
    if (!onBeforeRemove && !onStateChange) return;

    const unsubscribeBeforeRemove = onBeforeRemove
      ? navigation.addListener('beforeRemove', onBeforeRemove)
      : undefined;

    const unsubscribeStateChange = onStateChange
      ? navigation.addListener('state', onStateChange)
      : undefined;

    return () => {
      unsubscribeBeforeRemove?.();
      unsubscribeStateChange?.();
    };
  }, [navigation, onBeforeRemove, onStateChange]);
};

// Hook for managing navigation history
export const useNavigationHistory = () => {
  const [history, setHistory] = useState<string[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', (e) => {
      const currentRoute = NavigationService.getCurrentRouteName();
      if (currentRoute) {
        setHistory(prev => {
          const newHistory = [...prev];
          if (newHistory[newHistory.length - 1] !== currentRoute) {
            newHistory.push(currentRoute);
            // Keep only last 10 routes to prevent memory issues
            return newHistory.slice(-10);
          }
          return newHistory;
        });
      }
    });

    return unsubscribe;
  }, [navigation]);

  const goBackInHistory = useCallback((steps: number = 1) => {
    if (history.length > steps) {
      const targetRoute = history[history.length - steps - 1];
      if (targetRoute) {
        NavigationService.navigate(targetRoute as any);
      }
    }
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    goBackInHistory,
    clearHistory,
    canGoBackInHistory: history.length > 1,
  };
};
