import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";

// Mock ride history data
const RIDE_HISTORY = [
  {
    id: "1",
    date: "Today",
    time: "2:30 PM",
    pickup: "Current Location",
    destination: "Oxford Circus",
    price: 15.50,
    status: "completed",
    driver: "John S.",
    rating: 5,
  },
  {
    id: "2",
    date: "Yesterday",
    time: "9:15 AM",
    pickup: "Home",
    destination: "Canary Wharf",
    price: 22.00,
    status: "completed",
    driver: "Maria G.",
    rating: 4,
  },
  {
    id: "3",
    date: "Jan 25",
    time: "6:45 PM",
    pickup: "Work",
    destination: "Greenwich",
    price: 18.75,
    status: "completed",
    driver: "David L.",
    rating: 5,
  },
  {
    id: "4",
    date: "Jan 24",
    time: "11:30 AM",
    pickup: "Hyde Park",
    destination: "Home",
    price: 28.00,
    status: "cancelled",
    driver: null,
    rating: null,
  },
];

export default function ActivityScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 bg-teal-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="time-outline" size={40} color="#14B8A6" />
          </View>
          <Text className="text-gray-900 text-2xl font-bold text-center mb-3">
            View Your Rides
          </Text>
          <Text className="text-gray-500 text-center text-base mb-8">
            Sign in to see your ride history, receipts, and trip details.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/auth")}
            className="bg-teal-500 py-4 px-8 rounded-2xl"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg">Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-4 bg-white border-b border-gray-100">
        <Text className="text-gray-900 text-2xl font-bold">Activity</Text>
      </View>

      {/* Ride History */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4">
          <Text className="text-gray-400 text-xs font-semibold mb-4 tracking-wide">
            RIDE HISTORY
          </Text>

          {RIDE_HISTORY.map((ride) => (
            <TouchableOpacity
              key={ride.id}
              className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
              activeOpacity={0.7}
            >
              {/* Date and Status */}
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-400 text-sm">
                  {ride.date} at {ride.time}
                </Text>
                <View
                  className={`px-3 py-1 rounded-full ${ride.status === "completed"
                      ? "bg-teal-100"
                      : "bg-red-100"
                    }`}
                >
                  <Text
                    className={`text-xs font-semibold ${ride.status === "completed"
                        ? "text-teal-600"
                        : "text-red-600"
                      }`}
                  >
                    {ride.status === "completed" ? "Completed" : "Cancelled"}
                  </Text>
                </View>
              </View>

              {/* Route */}
              <View className="flex-row items-start mb-3">
                <View className="items-center mr-3">
                  <View className="w-2.5 h-2.5 bg-teal-500 rounded-full" />
                  <View className="w-0.5 h-6 bg-gray-200 my-1" />
                  <View className="w-2.5 h-2.5 bg-teal-500 rounded-full" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-600 mb-2">
                    {ride.pickup}
                  </Text>
                  <Text className="text-gray-900 font-medium">
                    {ride.destination}
                  </Text>
                </View>
              </View>

              {/* Price and Driver */}
              <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                <View>
                  {ride.driver && (
                    <Text className="text-gray-400 text-sm">
                      Driver: {ride.driver}
                    </Text>
                  )}
                </View>
                <View className="flex-row items-center">
                  {ride.rating && (
                    <View className="flex-row items-center mr-3">
                      <Ionicons name="star" size={14} color="#facc15" />
                      <Text className="text-gray-500 text-sm ml-1">
                        {ride.rating}
                      </Text>
                    </View>
                  )}
                  <Text className="text-gray-900 font-bold text-lg">
                    £{ride.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom padding for tab bar */}
        <View className="h-32" />
      </ScrollView>
    </SafeAreaView>
  );
}
