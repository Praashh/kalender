import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationState } from '@react-navigation/native';
import { NavigationService } from '../navigation/NavigationService';

const NAVIGATION_STATE_KEY = 'navigation_state';

export class NavigationMiddleware {
  static async saveNavigationState(state: NavigationState): Promise<void> {
    try {
      const stateString = JSON.stringify(state);
      await AsyncStorage.setItem(NAVIGATION_STATE_KEY, stateString);
    } catch (error) {
      console.warn('Failed to save navigation state:', error);
    }
  }

  static async restoreNavigationState(): Promise<NavigationState | null> {
    try {
      const stateString = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);
      if (stateString) {
        return JSON.parse(stateString);
      }
    } catch (error) {
      console.warn('Failed to restore navigation state:', error);
    }
    return null;
  }

  static async clearNavigationState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NAVIGATION_STATE_KEY);
    } catch (error) {
      console.warn('Failed to clear navigation state:', error);
    }
  }

  // Handle navigation state changes
  static handleStateChange = (state: NavigationState | undefined) => {
    if (state) {
      // Save state for persistence
      this.saveNavigationState(state);
      
      // Log navigation events for debugging
      console.log('Navigation state changed:', {
        currentRoute: NavigationService.getCurrentRouteName(),
        state: JSON.stringify(state, null, 2),
      });
    }
  };

  // Handle navigation focus events
  static handleFocus = (routeName: string) => {
    console.log(`Screen focused: ${routeName}`);
    
    // Track screen focus for analytics
    // You can integrate with your analytics service here
  };

  // Handle navigation blur events
  static handleBlur = (routeName: string) => {
    console.log(`Screen blurred: ${routeName}`);
    
    // Track screen blur for analytics
    // You can integrate with your analytics service here
  };

  // Handle before remove events (useful for preventing navigation)
  static handleBeforeRemove = (routeName: string, callback: () => void) => {
    console.log(`Before remove: ${routeName}`);
    
    // You can add custom logic here to prevent navigation
    // For example, show a confirmation dialog
    callback();
  };

  // Handle deep link events
  static handleDeepLink = (url: string) => {
    console.log('Deep link received:', url);
    
    // You can add custom deep link handling logic here
    // For example, analytics tracking, custom routing, etc.
  };

  // Handle navigation errors
  static handleNavigationError = (error: Error) => {
    console.error('Navigation error:', error);
    
    // You can add error reporting logic here
    // For example, send to crash reporting service
  };

  // Initialize navigation middleware
  static initialize() {
    // Set up global navigation event listeners
    // This would be called when the app starts
    
    console.log('Navigation middleware initialized');
  }

  // Cleanup navigation middleware
  static cleanup() {
    // Clean up any event listeners or resources
    console.log('Navigation middleware cleaned up');
  }
}

// Navigation state persistence utilities
export class NavigationPersistence {
  // Save current navigation state
  static async saveState(): Promise<void> {
    const state = NavigationService.getRootState();
    if (state) {
      await NavigationMiddleware.saveNavigationState(state);
    }
  }

  // Restore navigation state
  static async restoreState(): Promise<boolean> {
    const state = await NavigationMiddleware.restoreNavigationState();
    if (state) {
      // You would typically restore this state in your navigation container
      console.log('Navigation state restored:', state);
      return true;
    }
    return false;
  }

  // Clear all navigation state
  static async clearState(): Promise<void> {
    await NavigationMiddleware.clearNavigationState();
  }

  // Check if navigation state exists
  static async hasState(): Promise<boolean> {
    try {
      const stateString = await AsyncStorage.getItem(NAVIGATION_STATE_KEY);
      return stateString !== null;
    } catch {
      return false;
    }
  }
}

// Navigation analytics middleware
export class NavigationAnalytics {
  private static screenViews: {
    screenName: string;
    timestamp: number;
    params?: any;
  }[] = [];

  // Track screen view
  static trackScreenView(screenName: string, params?: any): void {
    const screenView = {
      screenName,
      timestamp: Date.now(),
      params,
    };

    this.screenViews.push(screenView);
    
    // Keep only last 100 screen views to prevent memory issues
    if (this.screenViews.length > 100) {
      this.screenViews = this.screenViews.slice(-100);
    }

    console.log('Screen view tracked:', screenView);
    
    // You can integrate with your analytics service here
    // Example: Analytics.track('screen_view', screenView);
  }

  // Track navigation event
  static trackNavigationEvent(event: string, params?: any): void {
    const navigationEvent = {
      event,
      timestamp: Date.now(),
      params,
    };

    console.log('Navigation event tracked:', navigationEvent);
    
    // You can integrate with your analytics service here
    // Example: Analytics.track('navigation_event', navigationEvent);
  }

  // Get screen view history
  static getScreenViewHistory(): {
    screenName: string;
    timestamp: number;
    params?: any;
  }[] {
    return [...this.screenViews];
  }

  // Clear screen view history
  static clearScreenViewHistory(): void {
    this.screenViews = [];
  }
}

// Export middleware functions for easy use
export const {
  saveNavigationState,
  restoreNavigationState,
  clearNavigationState,
  handleStateChange,
  handleFocus,
  handleBlur,
  handleBeforeRemove,
  handleDeepLink,
  handleNavigationError,
  initialize,
  cleanup,
} = NavigationMiddleware;
