import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useState } from 'react';
import { createDeepLink, parseDeepLink } from '../navigation/linking';

export const useDeepLinking = () => {
  const navigation = useNavigation();
  const [initialUrl, setInitialUrl] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeDeepLinking = async () => {
      try {
        const url = await Linking.getInitialURL();
        setInitialUrl(url);
        setIsReady(true);

        if (url) {
          handleDeepLink(url);
        }
      } catch (error) {
        console.warn('Failed to initialize deep linking:', error);
        setIsReady(true);
      }
    };

    initializeDeepLinking();
  }, []);

  const handleDeepLink = useCallback((url: string) => {
    try {
      const parsedLink = parseDeepLink(url);
      
      if (parsedLink) {
        const { screen, params } = parsedLink;
        
        (navigation as any).navigate(screen, params);
        
        console.log('Deep link handled:', { url, screen, params });
      }
    } catch (error) {
      console.warn('Failed to handle deep link:', error);
    }
  }, [navigation]);

  useEffect(() => {
    if (!isReady) return;

    const handleUrl = (event: { url: string }) => {
      handleDeepLink(event.url);
    };

    const subscription = Linking.addEventListener('url', handleUrl);

    return () => {
      subscription?.remove();
    };
  }, [isReady, navigation, handleDeepLink]);

  const createLink = useCallback((screen: string, params?: Record<string, any>) => {
    return createDeepLink(screen, params);
  }, []);

  const shareLink = useCallback(async (screen: string, params?: Record<string, any>) => {
    try {
      const link = createLink(screen, params);
      
      
      console.log('Share link created:', link);
      return link;
    } catch (error) {
      console.warn('Failed to create share link:', error);
      return null;
    }
  }, [createLink]);

  const isValidDeepLink = useCallback((url: string) => {
    try {
      const parsed = parseDeepLink(url);
      return parsed !== null;
    } catch {
      return false;
    }
  }, []);

  return {
    initialUrl,
    isReady,
    handleDeepLink,
    createLink,
    shareLink,
    isValidDeepLink,
  };
};

export const useDeepLinkHandler = (patterns: Record<string, (params: any) => void>) => {
  const { handleDeepLink } = useDeepLinking();

  const enhancedHandleDeepLink = useCallback((url: string) => {
    const parsed = parseDeepLink(url);
    
    if (parsed) {
      const { screen, params } = parsed;
      
      if (patterns[screen]) {
        patterns[screen](params);
      } else {
        handleDeepLink(url);
      }
    }
  }, [handleDeepLink, patterns]);

  return {
    handleDeepLink: enhancedHandleDeepLink,
  };
};

export const useDeepLinkState = () => {
  const [pendingDeepLink, setPendingDeepLink] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const setPendingLink = useCallback((url: string) => {
    setPendingDeepLink(url);
  }, []);

  const processPendingLink = useCallback((handler: (url: string) => void) => {
    if (pendingDeepLink && !isProcessing) {
      setIsProcessing(true);
      handler(pendingDeepLink);
      setPendingDeepLink(null);
      setIsProcessing(false);
    }
  }, [pendingDeepLink, isProcessing]);

  const clearPendingLink = useCallback(() => {
    setPendingDeepLink(null);
    setIsProcessing(false);
  }, []);

  return {
    pendingDeepLink,
    isProcessing,
    setPendingLink,
    processPendingLink,
    clearPendingLink,
    hasPendingLink: pendingDeepLink !== null,
  };
};
