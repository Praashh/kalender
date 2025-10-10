import { CommonActions, createNavigationContainerRef, StackActions } from '@react-navigation/native';

type RootStackParamList = {
  '(tabs)': any;
  '+not-found': undefined;
  auth: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export class NavigationService {
  static navigate(routeName: string, params?: any) {
    if (navigationRef.isReady()) {
      navigationRef.navigate(routeName as any, params as any);
    }
  }

  static goBack() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  }

  static reset(routeName: string, params?: any) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: routeName, params }],
        })
      );
    }
  }

  static push(routeName: string, params?: any) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.push(routeName as any, params as any));
    }
  }

  static pop(count: number = 1) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.pop(count));
    }
  }

  static popToTop() {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.popToTop());
    }
  }

  static replace(routeName: string, params?: any) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.replace(routeName as any, params as any));
    }
  }

  static getCurrentRoute() {
    if (navigationRef.isReady()) {
      return navigationRef.getCurrentRoute();
    }
    return null;
  }

  static getCurrentRouteName() {
    if (navigationRef.isReady()) {
      return navigationRef.getCurrentRoute()?.name || null;
    }
    return null;
  }

  static getRootState() {
    if (navigationRef.isReady()) {
      return navigationRef.getRootState();
    }
    return null;
  }
}

