import { useNavigationState } from '@react-navigation/native';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useDeepLinking } from '../hooks/useDeepLinking';
import { useNavigationAnalytics } from '../hooks/useNavigationAnalytics';
import { NavigationService } from '../navigation/NavigationService';

interface NavigationContextType {
  currentRoute: string | null;
  canGoBack: boolean;
  isReady: boolean;
  
  navigate: (routeName: string, params?: any) => void;
  goBack: () => void;
  reset: (routeName: string, params?: any) => void;
  replace: (routeName: string, params?: any) => void;
  
  createLink: (screen: string, params?: Record<string, any>) => string;
  shareLink: (screen: string, params?: Record<string, any>) => Promise<string | null>;
  
  trackScreenView: (screenName: string, params?: any) => void;
  trackNavigationEvent: (event: string, params?: any) => void;
  
  history: string[];
  goBackInHistory: (steps?: number) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const analytics = useNavigationAnalytics();
  
  const deepLinking = useDeepLinking();

  const routeName = useNavigationState(state => {
    if (!state) return null;
    
    const route = state.routes[state.index];
    if (route.state && route.state.index !== undefined) {
      return route.state.routes[route.state.index]?.name;
    }
    return route.name;
  });

  useEffect(() => {
    if (routeName && routeName !== currentRoute) {
      setCurrentRoute(routeName);
      
      setHistory(prev => {
        const newHistory = [...prev];
        if (newHistory[newHistory.length - 1] !== routeName) {
          newHistory.push(routeName);
          return newHistory.slice(-10);
        }
        return newHistory;
      });
    }
  }, [routeName, currentRoute]);

  useEffect(() => {
    const checkReady = () => {
      if (NavigationService.getCurrentRoute()) {
        setIsReady(true);
      }
    };

    checkReady();
    
    const interval = setInterval(checkReady, 100);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateCanGoBack = () => {
      setCanGoBack(history.length > 1);
    };

    updateCanGoBack();
  }, [history]);

  const navigate = (routeName: string, params?: any) => {
    NavigationService.navigate(routeName as any, params);
    analytics.trackNavigationEvent('navigate', { routeName, params });
  };

  const goBack = () => {
    if (canGoBack) {
      NavigationService.goBack();
      analytics.trackNavigationEvent('go_back');
    }
  };

  const reset = (routeName: string, params?: any) => {
    NavigationService.reset(routeName as any, params);
    analytics.trackNavigationEvent('reset', { routeName, params });
  };

  const replace = (routeName: string, params?: any) => {
    NavigationService.replace(routeName as any, params);
    analytics.trackNavigationEvent('replace', { routeName, params });
  };

  const goBackInHistory = (steps: number = 1) => {
    if (history.length > steps) {
      const targetRoute = history[history.length - steps - 1];
      if (targetRoute) {
        navigate(targetRoute);
        analytics.trackNavigationEvent('go_back_in_history', { steps, targetRoute });
      }
    }
  };

  const contextValue: NavigationContextType = {
    currentRoute,
    canGoBack,
    isReady,
    
    navigate,
    goBack,
    reset,
    replace,
    
    createLink: deepLinking.createLink,
    shareLink: deepLinking.shareLink,
    
    trackScreenView: analytics.trackScreenView,
    trackNavigationEvent: analytics.trackNavigationEvent,
    
    history,
    goBackInHistory,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};

export const withNavigationContext = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WrappedComponent = (props: P) => (
    <NavigationProvider>
      <Component {...props} />
    </NavigationProvider>
  );
  WrappedComponent.displayName = `withNavigationContext(${Component.displayName || Component.name})`;
  return WrappedComponent;
};
