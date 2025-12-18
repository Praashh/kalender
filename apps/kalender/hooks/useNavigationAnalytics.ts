import { useFocusEffect, useNavigationState } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';

type ScreenTrackingEvent = {
  screenName: string;
  timestamp: number;
  params?: any;
};

type NavigationAnalytics = {
  trackScreenView: (screenName: string, params?: any) => void;
  trackNavigationEvent: (event: string, params?: any) => void;
};
export const useNavigationAnalytics = () => {
  const previousRouteNameRef = useRef<string | undefined>(undefined);
  const currentRouteNameRef = useRef<string | undefined>(undefined);

  const trackScreenView = (screenName: string, params?: any) => {
    const event: ScreenTrackingEvent = {
      screenName,
      timestamp: Date.now(),
      params,
    };

    console.log('Screen View:', event);
  };

  const trackNavigationEvent = (event: string, params?: any) => {
    const navigationEvent = {
      event,
      timestamp: Date.now(),
      params,
    };

    console.log('Navigation Event:', navigationEvent);
  };
  const routeName = useNavigationState(state => {
    if (!state) return undefined;
    
    const route = state.routes[state.index];
    if (route.state && route.state.index !== undefined) {
      return route.state.routes[route.state.index]?.name;
    }
    return route.name;
  });
  useEffect(() => {
    if (routeName && routeName !== previousRouteNameRef.current) {
      previousRouteNameRef.current = currentRouteNameRef.current;
      currentRouteNameRef.current = routeName;
      
      trackScreenView(routeName);
    }
  }, [routeName]);

  return {
    trackScreenView,
    trackNavigationEvent,
    currentRouteName: currentRouteNameRef.current,
    previousRouteName: previousRouteNameRef.current,
  } as NavigationAnalytics & {
    currentRouteName?: string;
    previousRouteName?: string;
  };
};

export const useScreenTracking = (screenName: string) => {
  const analytics = useNavigationAnalytics();

  useFocusEffect(
    React.useCallback(() => {
      analytics.trackScreenView(screenName);
      
      return () => {
        analytics.trackNavigationEvent('screen_blur', { screenName });
      };
    }, [screenName, analytics])
  );

  return analytics;
};
export const useNavigationTracking = () => {
  const analytics = useNavigationAnalytics();

  const trackTabPress = (tabName: string) => {
    analytics.trackNavigationEvent('tab_press', { tabName });
  };

  const trackBackPress = () => {
    analytics.trackNavigationEvent('back_press');
  };

  const trackDeepLink = (url: string) => {
    analytics.trackNavigationEvent('deep_link', { url });
  };

  return {
    ...analytics,
    trackTabPress,
    trackBackPress,
    trackDeepLink,
  };
};
