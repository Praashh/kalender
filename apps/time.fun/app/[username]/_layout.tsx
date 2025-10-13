import { Stack, useLocalSearchParams } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
    const { username, duration } = useLocalSearchParams();
  return (
    <>
      <StatusBar hidden={true} />

      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="[username]"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="[duration]"
          options={{
            title: `${duration} ${username} Event`
          }}
        />
      </Stack>
    </>
  );
}