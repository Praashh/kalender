import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useCallback } from "react";
import "./global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { RideProvider } from "@/contexts/RideContext";
import ToastManager from "toastify-react-native";
import { View, ActivityIndicator } from "react-native";

const ONBOARDING_KEY = "hasCompletedOnboarding";

// Light theme colors
const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff",
    card: "#ffffff",
    text: "#000000",
    border: "#e5e5e5",
    primary: "#2563eb",
  },
};

function AppContent() {
  const { isLoading: authLoading } = useAuth();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Check onboarding status
  const checkOnboardingStatus = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      const completed = value === "true";
      setHasOnboarded(completed);
      return completed;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      setHasOnboarded(false);
      return false;
    }
  }, []);

  // Initial check on mount
  useEffect(() => {
    checkOnboardingStatus().then(() => {
      setIsReady(true);
    });
  }, []);

  // Re-check onboarding status when navigating away from onboarding
  useEffect(() => {
    if (!isReady) return;

    const inOnboarding = segments[0] === "onboarding";

    // If we just left onboarding, re-check the status
    if (!inOnboarding && hasOnboarded === false) {
      checkOnboardingStatus();
    }
  }, [segments, isReady]);

  // Handle initial routing
  useEffect(() => {
    if (!isReady || !loaded || hasOnboarded === null) return;

    const inOnboarding = segments[0] === "onboarding";
    const inTabs = segments[0] === "(tabs)";

    // Only redirect if we're at root or in wrong place
    if (!hasOnboarded && !inOnboarding && segments.length === 0) {
      router.replace("/onboarding");
    }
  }, [hasOnboarded, segments, loaded, isReady]);

  // Show loading while checking
  if (!loaded || !isReady || authLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ThemeProvider value={LightTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#ffffff" },
        }}
      >
        {/* Onboarding - shown first time */}
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        {/* Main tabs - freely accessible */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Auth screen - modal presentation */}
        <Stack.Screen
          name="auth"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            headerShown: false,
          }}
        />

        {/* Ride booking flow screens */}
        <Stack.Screen
          name="search"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="select-rider"
          options={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />

        <Stack.Screen
          name="finding-rider"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="ride-details"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="ride-progress"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="ride-complete"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RideProvider>
        <AppContent />
        <ToastManager />
      </RideProvider>
    </AuthProvider>
  );
}
