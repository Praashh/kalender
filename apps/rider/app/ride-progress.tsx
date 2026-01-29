import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRide } from "@/contexts/RideContext";

export default function RideProgressScreen() {
  const router = useRouter();
  const {
    driver,
    pickup,
    destination,
    selectedRideType,
    estimatedDuration,
    setRideStatus,
  } = useRide();

  const [remainingTime, setRemainingTime] = useState(estimatedDuration || 15);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Simulate ride progress
  useEffect(() => {
    const totalTime = estimatedDuration || 15;

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: totalTime * 1000, // Convert to ms, but speed up for demo
      useNativeDriver: false,
    }).start();

    // Update remaining time
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Ride complete
          setTimeout(() => {
            setRideStatus("completed");
            router.replace("/ride-complete");
          }, 500);
          return 0;
        }
        setProgress((prevProgress) => prevProgress + 100 / totalTime);
        return prev - 1;
      });
    }, 1000); // Update every second for demo (would be longer in real app)

    return () => clearInterval(interval);
  }, []);

  // Redirect if no driver
  useEffect(() => {
    if (!driver) {
      router.replace("/(tabs)");
    }
  }, [driver]);

  const handleEmergency = () => {
    Alert.alert("Emergency", "Contact emergency services?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call 999",
        style: "destructive",
        onPress: () => Alert.alert("Demo", "This would call emergency services"),
      },
    ]);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  if (!driver) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Map with route progress */}
      <View className="flex-1 bg-gray-100 relative">
        {/* Grid pattern to simulate map */}
        <View className="flex-1 opacity-30">
          {Array.from({ length: 15 }).map((_, i) => (
            <View key={i} className="flex-row flex-1 border-b border-gray-300">
              {Array.from({ length: 10 }).map((_, j) => (
                <View key={j} className="flex-1 border-r border-gray-300" />
              ))}
            </View>
          ))}
        </View>

        {/* Pickup marker (dimmed - already passed) */}
        <View className="absolute top-1/4 left-1/4">
          <View className="w-4 h-4 bg-teal-300 rounded-full border-2 border-teal-200" />
        </View>

        {/* Route line */}
        <View className="absolute top-1/4 left-1/4 w-1/2 h-1/2">
          {/* Background route line */}
          <View
            className="absolute w-full h-0.5 bg-gray-300"
            style={{
              top: "50%",
              transform: [{ rotate: "30deg" }],
            }}
          />
          {/* Progress route line */}
          <Animated.View
            style={{
              width: progressWidth,
              position: "absolute",
              height: 2,
              backgroundColor: "#14B8A6",
              top: "50%",
              transform: [{ rotate: "30deg" }],
            }}
          />
        </View>

        {/* Current position (car) */}
        <View
          className="absolute"
          style={{
            top: `${25 + progress * 0.5}%`,
            left: `${25 + progress * 0.5}%`,
          }}
        >
          <View className="bg-teal-500 rounded-lg p-2 shadow-lg">
            <Ionicons name="car" size={20} color="white" />
          </View>
        </View>

        {/* Destination marker */}
        <View className="absolute bottom-1/4 right-1/4">
          <View className="w-6 h-6 bg-teal-500 rounded-full border-4 border-white shadow-lg items-center justify-center">
            <View className="w-2 h-2 bg-white rounded-full" />
          </View>
        </View>

        {/* ETA overlay */}
        <View className="absolute top-4 left-4 right-4">
          <View className="bg-white/95 rounded-xl p-4 shadow-md">
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-gray-500 text-sm">Arriving in</Text>
                <Text className="text-gray-900 text-2xl font-bold">
                  {remainingTime} min
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-500 text-sm">Destination</Text>
                <Text className="text-gray-900 font-semibold">
                  {destination?.name}
                </Text>
              </View>
            </View>

            {/* Progress bar */}
            <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <Animated.View
                style={{ width: progressWidth }}
                className="h-full bg-teal-500 rounded-full"
              />
            </View>
          </View>
        </View>

        {/* Emergency button */}
        <TouchableOpacity
          onPress={handleEmergency}
          className="absolute bottom-4 right-4 bg-red-500 rounded-full p-3 shadow-lg"
          activeOpacity={0.8}
        >
          <Ionicons name="shield" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Bottom sheet with minimized driver info */}
      <View className="bg-white rounded-t-3xl -mt-6 pt-4 pb-8 shadow-lg">
        {/* Handle */}
        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />

        {/* Ride in progress indicator */}
        <View className="px-4 mb-4">
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-teal-500 rounded-full mr-2" />
            <Text className="text-teal-600 font-semibold">Ride in progress</Text>
          </View>
        </View>

        {/* Driver card (compact) */}
        <TouchableOpacity
          className="px-4 mb-4"
          activeOpacity={0.7}
          onPress={() => Alert.alert("Driver", `${driver.name}\n${driver.car.model}`)}
        >
          <View className="bg-gray-50 rounded-xl p-4 flex-row items-center">
            <Image
              source={{ uri: driver.photo }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold">{driver.name}</Text>
              <Text className="text-gray-500 text-sm">
                {driver.car.color} {driver.car.model}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="star" size={14} color="#facc15" />
              <Text className="text-gray-900 ml-1">{driver.rating}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Trip summary */}
        <View className="px-4 mb-4">
          <View className="flex-row justify-between items-center py-3 border-t border-b border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="location" size={18} color="#14B8A6" />
              <Text className="text-gray-500 ml-2">{pickup?.name}</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color="#9ca3af" />
            <View className="flex-row items-center">
              <Ionicons name="flag" size={18} color="#14B8A6" />
              <Text className="text-gray-900 ml-2">{destination?.name}</Text>
            </View>
          </View>
        </View>

        {/* Fare estimate */}
        <View className="px-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-500">Estimated fare</Text>
            <Text className="text-gray-900 text-xl font-bold">
              £{selectedRideType?.priceRange[0] || 15}.00
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
