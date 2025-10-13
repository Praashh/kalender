import { format } from "date-fns";
import React, { useCallback, useEffect } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import AppHeader from "@/components/AppHeader";
import { ThemedText } from "@/components/ThemedText";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { useAvailability } from "@/hooks/useAvailability";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const formatAvailabilityTime = (isoString: string): string => {
  try {
    return format(new Date(isoString), "h:mma").toLowerCase();
  } catch {
    return "--:--";
  }
};

const NewAvailabilityButton: React.FC<{ onPress: () => void }> = ({
  onPress,
}) => (
  <View className="flex-row justify-start items-center mb-5 mt-2.5">
    <TouchableOpacity
      className="bg-white flex-row items-center p-2 px-3 rounded-lg"
      onPress={onPress}
    >
      <Ionicons name="add-circle-outline" size={24} color="black" />
      <ThemedText className="text-black ml-1" style={{ color: "black" }}>
        New
      </ThemedText>
    </TouchableOpacity>
  </View>
);

const ExistingAvailabilityItem: React.FC<{
  availability: any;
  isLast: boolean;
}> = ({ availability, isLast }) => (
  <View className="mb-4 p-3 bg-[#3A3A3C] rounded-lg">
    <View className="mb-2">
      <ThemedText className="text-white text-base font-semibold">
        Name: {availability.name}
      </ThemedText>
      <ThemedText className="text-white text-sm font-light mt-1">
        {formatAvailabilityTime(availability.startTime.toString())} -{" "}
        {formatAvailabilityTime(availability.endTime.toString())}
      </ThemedText>
    </View>

    <View className="mt-1">
      <ThemedText className="text-[#BFBFC3] text-xs">
        Timezone: {availability.timezone}
      </ThemedText>
      {!isLast && <View className="h-px bg-[#4A4A4C] mt-3" />}
    </View>
  </View>
);

const ExistingAvailabilitiesList: React.FC<{ availabilities: any[] }> = ({
  availabilities,
}) => {
  if (availabilities.length === 0) {
    return null;
  }

  return (
    <View className="bg-[#2C2C2E] rounded-xl p-4 mt-4 shadow-lg shadow-black/30">
      <ThemedText className="text-white font-bold mb-3 text-base">
        Existing Availabilities
      </ThemedText>

      {availabilities.map((availability, index) => (
        <ExistingAvailabilityItem
          key={availability.id}
          availability={availability}
          isLast={index === availabilities.length - 1}
        />
      ))}
    </View>
  );
};

export default function AvilabilityScreen() {
  const { contentPaddingBottom } = useTabBarHeight();
  const { availabilities, refreshAvailabilities } = useAvailability();

  const handleNewAvailability = useCallback(() => {
    router.push("/availability-create-modal");
  }, []);

  useEffect(() => {
    (async () => {
      refreshAvailabilities();
    })();
  }, []);

  return (
    <View className="flex-1 bg-[#1C1C1E]">
      <AppHeader title="Availability" />

      <ScrollView
        className="flex-1 px-4"
        style={{ paddingBottom: contentPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        <NewAvailabilityButton onPress={handleNewAvailability} />

        <ExistingAvailabilitiesList availabilities={availabilities} />
      </ScrollView>
    </View>
  );
}
