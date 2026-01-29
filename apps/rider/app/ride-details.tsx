import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRide } from "@/contexts/RideContext";
import { DriverCard, VehicleInfo } from "@/components/rider";
import { Colors } from "@/constants/Colors";

export default function RideDetailsScreen() {
  const router = useRouter();
  const { driver, pickup, destination, selectedRideType, setRideStatus } =
    useRide();
  const [eta, setEta] = useState(driver?.location ? 5 : 2);

  // Simulate driver approaching
  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev - 1;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Redirect if no driver
  useEffect(() => {
    if (!driver) {
      router.replace("/(tabs)");
    }
  }, [driver]);

  const handleCall = () => {
    Alert.alert("Call Driver", "Would you like to call the driver?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => Linking.openURL("tel:+1234567890"),
      },
    ]);
  };

  const handleMessage = () => {
    Alert.alert("Coming Soon", "Messaging feature coming soon!");
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Ride",
      "Are you sure you want to cancel this ride? Cancellation fees may apply.",
      [
        { text: "Keep Ride", style: "cancel" },
        {
          text: "Cancel Ride",
          style: "destructive",
          onPress: () => {
            setRideStatus("cancelled");
            router.replace("/(tabs)");
          },
        },
      ]
    );
  };

  const handleDriverArrived = () => {
    setRideStatus("in_progress");
    router.replace("/ride-progress");
  };

  if (!driver) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      {/* Teal Header */}
      <View className="bg-teal-500 pt-12 pb-6 px-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white/80 text-sm font-medium uppercase tracking-wide">
              Your Driver is Arriving
            </Text>
            <View className="flex-row items-baseline mt-1">
              <Text className="text-white text-5xl font-bold">{eta}</Text>
              <Text className="text-white text-2xl font-medium ml-1">
                min away
              </Text>
            </View>
          </View>
          <View className="w-14 h-14 bg-white/20 rounded-2xl items-center justify-center">
            <Ionicons name="car" size={28} color="white" />
          </View>
        </View>
      </View>

      {/* Map with driver location */}
      <View className="flex-1 bg-gray-100 relative">
        {/* Grid pattern to simulate map */}
        <View className="flex-1 opacity-30">
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} className="flex-row flex-1 border-b border-gray-300">
              {Array.from({ length: 10 }).map((_, j) => (
                <View key={j} className="flex-1 border-r border-gray-300" />
              ))}
            </View>
          ))}
        </View>

        {/* Route visualization */}
        <View className="absolute inset-0">
          {/* Driver marker */}
          <View className="absolute top-1/4 right-1/3">
            <View className="bg-gray-800 rounded-full p-2 shadow-lg">
              <Ionicons name="car" size={18} color="white" />
            </View>
          </View>

          {/* Route line (teal) */}
          <View
            className="absolute top-1/4 right-1/3 w-32 h-1 bg-teal-500 rounded-full"
            style={{ transform: [{ rotate: "60deg" }] }}
          />

          {/* Pickup marker */}
          <View className="absolute bottom-1/3 left-1/3">
            <View className="w-4 h-4 bg-teal-500 rounded-full border-4 border-white shadow-lg" />
          </View>

          {/* Destination marker */}
          <View className="absolute top-1/4 right-1/4">
            <View className="w-4 h-4 bg-teal-500 rounded-full border-4 border-white shadow-lg" />
          </View>
        </View>
      </View>

      {/* Bottom sheet with driver details */}
      <View className="bg-white rounded-t-3xl -mt-6 pt-4 pb-6 shadow-lg">
        {/* Handle */}
        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-4" />

        {/* Driver Card */}
        <View className="px-4 mb-3">
          <DriverCard
            name={driver.name}
            photo={driver.photo}
            rating={driver.rating}
            trips={driver.trips}
            yearsWithZipo={3}
            isOnline={true}
          />
        </View>

        {/* Vehicle Info */}
        <View className="px-4 mb-4">
          <View className="bg-gray-50 rounded-2xl p-4">
            <VehicleInfo
              vehicleType={selectedRideType?.name || "Economy"}
              model={`${driver.car.color} ${driver.car.model}`}
              plateNumber={driver.car.plate}
            />
          </View>
        </View>

        {/* Action buttons */}
        <View className="flex-row px-4 gap-3">
          <TouchableOpacity
            onPress={handleCall}
            className="flex-1 bg-gray-100 rounded-xl py-3 items-center flex-row justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={20} color={Colors.brand.teal} />
            <Text className="text-gray-900 font-semibold ml-2">Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleMessage}
            className="flex-1 bg-gray-100 rounded-xl py-3 items-center flex-row justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble" size={20} color={Colors.brand.teal} />
            <Text className="text-gray-900 font-semibold ml-2">Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCancel}
            className="flex-1 bg-gray-100 rounded-xl py-3 items-center flex-row justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text className="text-gray-900 font-semibold ml-2">Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Demo: Start Ride button */}
        <View className="px-4 mt-4">
          <TouchableOpacity
            onPress={handleDriverArrived}
            className="bg-teal-500 py-4 rounded-xl items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold">
              Driver Arrived (Demo)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
