import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRide } from "@/contexts/RideContext";
import {
  RideCompletedCard,
  RouteDisplay,
  StarRating,
} from "@/components/rider";

export default function RideCompleteScreen() {
  const router = useRouter();
  const {
    pickup,
    destination,
    selectedRideType,
    resetRide,
  } = useRide();

  const [rating, setRating] = useState(5);

  // Calculate fare amounts
  const baseFare = selectedRideType?.priceRange[0] || 42;
  const competitorTake = baseFare * 0.6; // 60% of what competitor would take
  const youReceived = baseFare; // You get 100%

  const handleDone = () => {
    resetRide();
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Light teal gradient header area */}
        <View className="h-32 bg-gradient-to-b from-teal-50 to-gray-50" />

        {/* Ride Completed Card - overlapping header */}
        <View className="-mt-20">
          <RideCompletedCard
            youReceived={youReceived}
            competitorTake={competitorTake}
            competitorName="Uber/Bolt"
          />
        </View>

        {/* Route Display */}
        <View className="px-6 mt-6">
          <RouteDisplay
            startLocation={pickup?.name || "Oxford Circus, London"}
            endLocation={destination?.name || "Greenwich, London"}
          />
        </View>

        {/* Divider */}
        <View className="mx-6 h-px bg-gray-200 my-4" />

        {/* Rate Rider Section */}
        <View className="px-6">
          <Text className="text-gray-500 text-sm font-medium mb-3">
            Rate Rider
          </Text>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size={40}
          />
        </View>
      </ScrollView>

      {/* Close button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-8 pt-4 border-t border-gray-100">
        <TouchableOpacity
          onPress={handleDone}
          className="bg-teal-500 py-4 rounded-xl items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold">Close</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
