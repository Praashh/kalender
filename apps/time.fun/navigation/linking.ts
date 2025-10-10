import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    'kalender://', // Custom scheme for your app
    'https://kalender.app', // Web URL (if you have a web version)
  ],
  config: {
    screens: {
      '(tabs)': {
        path: '/',
        screens: {
          index: {
            path: 'home',
            exact: true,
          },
          explore: {
            path: 'calendar',
            exact: true,
          },
          create: {
            path: 'create',
            exact: true,
          },
          meetings: {
            path: 'meetings',
            exact: true,
          },
          settings: {
            path: 'profile',
            exact: true,
          },
        },
      },
      auth: {
        path: 'auth',
        exact: true,
      },
      '+not-found': '*',
    },
  },
  getInitialURL: async () => {
    const url = await import('expo-linking').then(({ getInitialURL }) => getInitialURL());
    
    if (url != null) {
      return url;
    }

    const { getInitialURL } = await import('expo-linking');
    return getInitialURL();
  },
  subscribe: (listener) => {
    const { addEventListener } = require('expo-linking');
    
    const subscription = addEventListener('url', ({ url }: { url: string }) => {
      listener(url);
    });

    return () => subscription?.remove();
  },
};

export const createDeepLink = (screen: string, params?: Record<string, any>) => {
  const baseUrl = 'kalender://';
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
  return `${baseUrl}${screen}${queryString}`;
};

export const parseDeepLink = (url: string) => {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    const params = Object.fromEntries(urlObj.searchParams.entries());
    
    return {
      screen: pathSegments[0] || 'index',
      params,
      fullPath: urlObj.pathname,
    };
  } catch (error) {
    console.warn('Failed to parse deep link:', error);
    return null;
  }
};

export const getStateFromPath = (path: string, options: any) => {
  return null; // Let React Navigation handle default behavior
};

export const getPathFromState = (state: any, options: any) => {
  return null; // Let React Navigation handle default behavior
};
