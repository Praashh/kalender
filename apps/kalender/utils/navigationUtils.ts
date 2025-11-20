import { NavigationService } from '../navigation/NavigationService';
import { createDeepLink, parseDeepLink } from '../navigation/linking';

export class NavigationUtils {
  static isRouteAvailable(routeName: string): boolean {
    const currentRoute = NavigationService.getCurrentRoute();
    return currentRoute?.name === routeName;
  }

  static getNavigationStateString(): string {
    const state = NavigationService.getRootState();
    if (!state) return 'No navigation state';
    
    return JSON.stringify(state, null, 2);
  }

  static navigateWithConfirmation(
    routeName: string, 
    params?: any, 
    confirmMessage?: string
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (confirmMessage) {
        const confirmed = window.confirm(confirmMessage);
        if (confirmed) {
          NavigationService.navigate(routeName as any, params);
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        NavigationService.navigate(routeName as any, params);
        resolve(true);
      }
    });
  }

  static navigateWithDelay(
    routeName: string, 
    params?: any, 
    delay: number = 1000
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        NavigationService.navigate(routeName as any, params);
        resolve();
      }, delay);
    });
  }

  static navigateWithAnimation(
    routeName: string, 
    params?: any, 
    animationType: 'slide' | 'fade' | 'none' = 'slide'
  ): void {
    NavigationService.navigate(routeName as any, params);
  }

  static batchNavigate(operations: {
    type: 'navigate' | 'replace' | 'push' | 'reset';
    routeName: string;
    params?: any;
  }[]): void {
    operations.forEach((op, index) => {
      setTimeout(() => {
        switch (op.type) {
          case 'navigate':
            NavigationService.navigate(op.routeName as any, op.params);
            break;
          case 'replace':
            NavigationService.replace(op.routeName as any, op.params);
            break;
          case 'push':
            NavigationService.push(op.routeName as any, op.params);
            break;
          case 'reset':
            NavigationService.reset(op.routeName as any, op.params);
            break;
        }
      }, index * 100); // Small delay between operations
    });
  }

  // Create shareable link for current screen
  static createCurrentScreenLink(params?: Record<string, any>): string {
    const currentRoute = NavigationService.getCurrentRouteName();
    if (currentRoute) {
      return createDeepLink(currentRoute, params);
    }
    return createDeepLink('index', params);
  }

  // Parse and validate deep link
  static validateDeepLink(url: string): {
    isValid: boolean;
    screen?: string;
    params?: Record<string, any>;
    error?: string;
  } {
    try {
      const parsed = parseDeepLink(url);
      if (parsed) {
        return {
          isValid: true,
          screen: parsed.screen,
          params: parsed.params,
        };
      }
      return {
        isValid: false,
        error: 'Invalid URL format',
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get navigation breadcrumb
  static getBreadcrumb(): string[] {
    const state = NavigationService.getRootState();
    if (!state) return [];

    const breadcrumb: string[] = [];
    
    const extractRoutes = (navState: any) => {
      if (navState.routes) {
        navState.routes.forEach((route: any) => {
          breadcrumb.push(route.name);
          if (route.state) {
            extractRoutes(route.state);
          }
        });
      }
    };

    extractRoutes(state);
    return breadcrumb;
  }

  // Check if navigation is in a specific stack
  static isInStack(stackName: string): boolean {
    const breadcrumb = this.getBreadcrumb();
    return breadcrumb.includes(stackName);
  }

  // Get current stack name
  static getCurrentStack(): string | null {
    const breadcrumb = this.getBreadcrumb();
    return breadcrumb.length > 0 ? breadcrumb[0] : null;
  }

  // Navigate to root of current stack
  static navigateToStackRoot(): void {
    const currentStack = this.getCurrentStack();
    if (currentStack) {
      NavigationService.reset(currentStack as any);
    }
  }

  // Clear navigation history
  static clearHistory(): void {
    const currentRoute = NavigationService.getCurrentRouteName();
    if (currentRoute) {
      NavigationService.reset(currentRoute as any);
    }
  }

  // Get navigation metrics
  static getNavigationMetrics(): {
    totalRoutes: number;
    currentDepth: number;
    canGoBack: boolean;
    currentRoute: string | null;
  } {
    const state = NavigationService.getRootState();
    const currentRoute = NavigationService.getCurrentRouteName();
    
    let totalRoutes = 0;
    let currentDepth = 0;

    if (state) {
      const countRoutes = (navState: any, depth: number = 0) => {
        if (navState.routes) {
          totalRoutes += navState.routes.length;
          currentDepth = Math.max(currentDepth, depth);
          navState.routes.forEach((route: any) => {
            if (route.state) {
              countRoutes(route.state, depth + 1);
            }
          });
        }
      };

      countRoutes(state);
    }

    return {
      totalRoutes,
      currentDepth,
      canGoBack: NavigationService.getCurrentRoute() !== null,
      currentRoute,
    };
  }
}

// Export individual utility functions for convenience
export const {
  isRouteAvailable,
  getNavigationStateString,
  navigateWithConfirmation,
  navigateWithDelay,
  navigateWithAnimation,
  batchNavigate,
  createCurrentScreenLink,
  validateDeepLink,
  getBreadcrumb,
  isInStack,
  getCurrentStack,
  navigateToStackRoot,
  clearHistory,
  getNavigationMetrics,
} = NavigationUtils;
