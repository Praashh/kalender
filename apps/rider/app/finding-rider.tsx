import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRide } from "@/contexts/RideContext";
import { MOCK_DRIVER } from "@/constants/mockData";

export default function FindingRiderScreen() {
  const router = useRouter();
  const { selectedRideType, setDriver, setRideStatus, pickup } = useRide();

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Start animations on mount
  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotate animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Progress animation (simulating search progress)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Simulate finding a driver after 3 seconds
    const timer = setTimeout(() => {
      setDriver(MOCK_DRIVER);
      setRideStatus("driver_assigned");
      router.replace("/ride-details");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    setRideStatus("cancelled");
    router.replace("/(tabs)");
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Map placeholder */}
      <View className="flex-1 bg-gray-100 relative">
        {/* Grid pattern to simulate map */}
        <View className="flex-1 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} className="flex-row flex-1 border-b border-gray-300">
              {Array.from({ length: 10 }).map((_, j) => (
                <View key={j} className="flex-1 border-r border-gray-300" />
              ))}
            </View>
          ))}
        </View>

        {/* Animated pulse around pickup location */}
        <View className="absolute top-1/2 left-1/2 -ml-16 -mt-16 items-center justify-center">
          {/* Outer pulse ring */}
          <Animated.View
            style={{
              transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.5],
                outputRange: [0.6, 0],
              }),
            }}
            className="absolute w-32 h-32 bg-teal-500/30 rounded-full"
          />

          {/* Middle pulse ring */}
          <Animated.View
            style={{
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [1, 1.5],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.5],
                outputRange: [0.8, 0.2],
              }),
            }}
            className="absolute w-24 h-24 bg-teal-500/40 rounded-full"
          />

          {/* Inner circle */}
          <View className="w-16 h-16 bg-teal-500/50 rounded-full items-center justify-center">
            <View className="w-8 h-8 bg-teal-500 rounded-full items-center justify-center">
              <Ionicons name="location" size={20} color="white" />
            </View>
          </View>
        </View>

        {/* Searching cars animation */}
        <Animated.View
          style={{ transform: [{ rotate: spin }] }}
          className="absolute top-1/2 left-1/2 -ml-24 -mt-24 w-48 h-48"
        >
          {[0, 60, 120, 180, 240, 300].map((angle, index) => (
            <View
              key={index}
              className="absolute top-0 left-1/2 -ml-3 w-6 h-24"
              style={{ transform: [{ rotate: `${angle}deg` }] }}
            >
              <View className="w-6 h-6 bg-white rounded-full items-center justify-center shadow-md">
                <Ionicons name="car" size={14} color="#14B8A6" />
              </View>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Bottom sheet */}
      <View className="bg-white rounded-t-3xl -mt-6 pt-4 pb-8 px-4 shadow-lg">
        {/* Handle */}
        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />

        {/* Status */}
        <View className="items-center mb-6">
          <View className="flex-row items-center mb-2">
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="sync" size={24} color="#14B8A6" />
            </Animated.View>
            <Text className="text-gray-900 text-xl font-bold ml-3">
              Finding your driver...
            </Text>
          </View>
          <Text className="text-gray-500 text-center">
            Looking for {selectedRideType?.name || "a"} driver near{" "}
            {pickup?.name || "you"}
          </Text>
        </View>

        {/* Progress bar */}
        <View className="mb-6">
          <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <Animated.View
              style={{ width: progressWidth }}
              className="h-full bg-teal-500 rounded-full"
            />
          </View>
        </View>

        {/* Trip summary */}
        <View className="bg-gray-50 rounded-xl p-4 mb-6">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-500 text-sm">Estimated fare</Text>
              <Text className="text-gray-900 text-xl font-bold">
                £{selectedRideType?.priceRange[0] || 15} -{" "}
                £{selectedRideType?.priceRange[1] || 20}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-500 text-sm">Ride type</Text>
              <Text className="text-gray-900 font-semibold">
                {selectedRideType?.name || "Everyday"}
              </Text>
            </View>
          </View>
        </View>

        {/* Cancel button */}
        <TouchableOpacity
          onPress={handleCancel}
          className="py-4 rounded-xl items-center border border-gray-200"
          activeOpacity={0.7}
        >
          <Text className="text-gray-700 font-semibold">Cancel Search</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
