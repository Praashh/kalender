import type { NavigatorScreenParams } from '@react-navigation/native';

// Define the parameter list for the root stack navigator
export type RootStackParamList = {
  '(tabs)': NavigatorScreenParams<TabParamList>;
  '+not-found': undefined;
  auth: undefined;
};

// Define the parameter list for the tab navigator
export type TabParamList = {
  index: undefined;
  explore: undefined;
  create: undefined;
  meetings: undefined;
  settings: undefined;
};

// Define the parameter list for individual screens
export type HomeScreenParamList = {
  index: undefined;
};

export type CalendarScreenParamList = {
  explore: undefined;
};

export type CreateScreenParamList = {
  create: undefined;
};

export type MeetingsScreenParamList = {
  meetings: undefined;
};

export type SettingsScreenParamList = {
  settings: undefined;
};

export type AuthScreenParamList = {
  auth: undefined;
};

// Navigation prop types for type safety
export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: any; // Will be properly typed when using with navigation
  route: {
    key: string;
    name: T;
    params: RootStackParamList[T];
  };
};

export type TabScreenProps<T extends keyof TabParamList> = {
  navigation: any; // Will be properly typed when using with navigation
  route: {
    key: string;
    name: T;
    params: TabParamList[T];
  };
};

// Deep linking configuration types
export type LinkingConfig = {
  prefixes: string[];
  config: {
    screens: {
      [key: string]: {
        path: string;
        parse?: {
          [key: string]: (value: string) => any;
        };
      };
    };
  };
};

// Navigation state types
export type NavigationState = {
  index: number;
  routes: {
    key: string;
    name: string;
    params?: any;
  }[];
};

// Screen tracking types
export type ScreenTrackingEvent = {
  screenName: string;
  timestamp: number;
  params?: any;
};

// Navigation analytics types
export type NavigationAnalytics = {
  trackScreenView: (screenName: string, params?: any) => void;
  trackNavigationEvent: (event: string, params?: any) => void;
};
