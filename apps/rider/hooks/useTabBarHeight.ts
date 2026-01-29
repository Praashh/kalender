import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useTabBarHeight() {
  const insets = useSafeAreaInsets();
  
  const tabBarHeight = Platform.select({
    ios: 85 + insets.bottom,
    android: 70 + insets.bottom,
    default: 70 + insets.bottom,
  });
  
  // Add extra padding to ensure content doesn't get hidden
  const contentPaddingBottom = tabBarHeight + 20;
  
  return {
    tabBarHeight,
    contentPaddingBottom,
  };
}
