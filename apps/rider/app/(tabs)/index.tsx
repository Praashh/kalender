import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRide } from "@/contexts/RideContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DEFAULT_LOCATION,
  SAVED_PLACES,
  RECENT_SEARCHES,
} from "@/constants/mockData";

export default function HomeScreen() {
  const router = useRouter();
  const { setPickup, pickup } = useRide();
  const { user, isAuthenticated } = useAuth();

  // Set default pickup location on mount
  useEffect(() => {
    if (!pickup) {
      setPickup(DEFAULT_LOCATION);
    }
  }, []);

  const handleSearchPress = () => {
    router.push("/search");
  };

  const handleSavedPlacePress = (place: typeof SAVED_PLACES[0]) => {
    router.push({
      pathname: "/search",
      params: { preselected: JSON.stringify(place) },
    });
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Map Placeholder */}
      <View className="flex-1 bg-gray-200 items-center justify-center">
        <View className="absolute inset-0 bg-gray-100">
          {/* Grid pattern to simulate map */}
          <View className="flex-1 opacity-30">
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                className="flex-row flex-1 border-b border-gray-300"
              >
                {Array.from({ length: 10 }).map((_, j) => (
                  <View key={j} className="flex-1 border-r border-gray-300" />
                ))}
              </View>
            ))}
          </View>

          {/* Current location marker */}
          <View className="absolute top-1/2 left-1/2 -ml-3 -mt-3">
            <View className="w-6 h-6 bg-teal-500 rounded-full border-4 border-white shadow-lg items-center justify-center">
              <View className="w-2 h-2 bg-white rounded-full" />
            </View>
          </View>
        </View>

        {/* Floating UI elements */}
        <SafeAreaView className="absolute inset-0" edges={["top"]}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 pt-2">
            {/* Profile button */}
            <TouchableOpacity
              className="w-11 h-11 bg-white rounded-full items-center justify-center shadow-md"
              onPress={() => router.push("/(tabs)/account")}
            >
              {isAuthenticated && user?.name ? (
                <Text className="text-teal-500 font-bold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              ) : (
                <Ionicons name="person" size={20} color="#6b7280" />
              )}
            </TouchableOpacity>

            {/* Current location indicator */}
            <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-md">
              <Ionicons name="location" size={16} color="#14B8A6" />
              <Text className="text-gray-700 ml-2 font-medium">
                {pickup?.name || "Current Location"}
              </Text>
            </View>

            {/* Notifications */}
            <TouchableOpacity className="w-11 h-11 bg-white rounded-full items-center justify-center shadow-md">
              <Ionicons name="notifications-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* Bottom Sheet */}
      <View className="bg-white rounded-t-3xl -mt-6 pt-4 pb-32 shadow-lg">
        {/* Handle */}
        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />

        {/* Where to? Search bar */}
        <TouchableOpacity
          onPress={handleSearchPress}
          className="mx-4 mb-6"
          activeOpacity={0.8}
        >
          <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-4">
            <View className="w-10 h-10 bg-teal-500 rounded-full items-center justify-center mr-3">
              <Ionicons name="search" size={20} color="white" />
            </View>
            <Text className="text-gray-500 text-lg flex-1">
              Where to?
            </Text>
            <View className="flex-row items-center bg-white rounded-full px-3 py-2 shadow-sm">
              <Ionicons name="time-outline" size={14} color="#6b7280" />
              <Text className="text-gray-600 text-sm ml-1 font-medium">Now</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Saved Places */}
        <View className="px-4">
          <Text className="text-gray-400 text-xs font-semibold mb-3 tracking-wide">
            SAVED PLACES
          </Text>
          <View className="flex-row gap-3">
            {SAVED_PLACES.map((place) => (
              <TouchableOpacity
                key={place.name}
                onPress={() => handleSavedPlacePress(place)}
                className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100"
                activeOpacity={0.7}
              >
                <View className="w-10 h-10 bg-teal-100 rounded-full items-center justify-center mb-3">
                  <Ionicons
                    name={place.name === "Home" ? "home" : "briefcase"}
                    size={18}
                    color="#14B8A6"
                  />
                </View>
                <Text className="text-gray-900 font-semibold">{place.name}</Text>
                <Text className="text-gray-400 text-sm mt-1" numberOfLines={1}>
                  {place.address.split(",")[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Searches */}
        <View className="px-4 mt-6">
          <Text className="text-gray-400 text-xs font-semibold mb-3 tracking-wide">
            RECENT
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-4 px-4"
          >
            {RECENT_SEARCHES.map((place, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSavedPlacePress(place)}
                className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 mr-3 border border-gray-100"
                activeOpacity={0.7}
              >
                <View className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center mr-3">
                  <Ionicons name="time-outline" size={16} color="#6b7280" />
                </View>
                <View>
                  <Text className="text-gray-900 font-medium">{place.name}</Text>
                  <Text className="text-gray-400 text-sm">
                    {place.address.split(",")[0]}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
