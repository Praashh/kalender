import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AuthScreen from "./auth";
import ToastManager from "toastify-react-native";

function AppContent() {
  const { theme } = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded || isLoading) {
    // Async font loading or auth check in progress
    return null;
  }

  return (
    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      {isAuthenticated ? (
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="event-edit-modal"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              title: "Edit Event",
            }}
          />

          <Stack.Screen
            name="availability-create-modal"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              title: "Create Availability",
            }}
          />
        </Stack>
      ) : (
        <AuthScreen />
      )}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastManager />
    </AuthProvider>
  );
}
