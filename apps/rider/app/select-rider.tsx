import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRide, RideType } from "@/contexts/RideContext";
import { useAuth } from "@/contexts/AuthContext";
import { RIDE_TYPES } from "@/constants/mockData";
import {
  VehicleTypeSelector,
  FilterChips,
  PriceComparison,
  VehicleType,
} from "@/components/rider";
import { Colors } from "@/constants/Colors";

// Vehicle type options for the selector
const VEHICLE_OPTIONS: VehicleType[] = [
  { id: "everyday", name: "Everyday", seats: 4, icon: "car" },
  { id: "xl", name: "Everyday XL", seats: 6, icon: "car-sport" },
];

// Filter chip options
const FILTER_OPTIONS = [
  { id: "favourite", label: "Favourite driver", icon: "people" as const },
  { id: "verified", label: "Verified only", icon: "shield-checkmark" as const },
];

export default function SelectRiderScreen() {
  const router = useRouter();
  const {
    pickup,
    destination,
    setSelectedRideType,
    calculateEstimates,
    estimatedDistance,
    estimatedDuration,
  } = useRide();
  const { isAuthenticated } = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState("everyday");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<RideType | null>(
    RIDE_TYPES[0]
  );

  // Calculate estimates when screen loads
  useEffect(() => {
    calculateEstimates();
  }, []);

  // Redirect if no destination selected
  useEffect(() => {
    if (!destination) {
      router.replace("/(tabs)");
    }
  }, [destination]);

  const handleBack = () => {
    router.back();
  };

  const handleToggleFilter = (id: string) => {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleConfirmRide = () => {
    if (!selectedType) return;

    setSelectedRideType(selectedType);

    if (!isAuthenticated) {
      router.push("/auth?returnTo=booking");
    } else {
      router.push("/finding-rider");
    }
  };

  // Price calculation
  const basePrice = selectedType?.priceRange[0] || 15;
  const distanceMultiplier = estimatedDistance ? estimatedDistance * 0.5 : 1;
  const discountedPrice = basePrice + distanceMultiplier;
  const originalPrice = discountedPrice * 2; // Show ~50% savings
  const savingsPercent = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  if (!destination) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      {/* Map with route */}
      <View className="flex-[1.2] bg-gray-100 relative">
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
          <View className="absolute top-1/4 right-1/4">
            <View className="bg-gray-800 rounded-full p-2 shadow-lg">
              <Ionicons name="car" size={16} color="white" />
            </View>
          </View>

          {/* Pickup marker */}
          <View className="absolute bottom-1/3 left-1/4">
            <View className="w-4 h-4 bg-teal-500 rounded-full border-4 border-white shadow-lg" />
          </View>

          {/* Route line (teal) */}
          <View
            className="absolute bottom-1/3 left-1/4 w-40 h-1 bg-teal-500 rounded-full"
            style={{ transform: [{ rotate: "-30deg" }], marginLeft: 10 }}
          />

          {/* Destination marker */}
          <View className="absolute top-1/3 right-1/3">
            <View className="w-4 h-4 bg-teal-500 rounded-full border-4 border-white shadow-lg" />
          </View>
        </View>

        {/* Back button */}
        <TouchableOpacity
          onPress={handleBack}
          className="absolute top-12 left-4 w-10 h-10 bg-white rounded-full items-center justify-center shadow-md"
        >
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Bottom sheet */}
      <View className="bg-white rounded-t-3xl -mt-6 pt-4 pb-6 shadow-lg">
        {/* Handle */}
        <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-5" />

        {/* Vehicle Type Selector */}
        <View className="px-4 mb-5">
          <VehicleTypeSelector
            options={VEHICLE_OPTIONS}
            selectedId={selectedVehicle}
            onSelect={(id) => {
              setSelectedVehicle(id);
              // Map to ride type
              const rideType =
                id === "xl"
                  ? RIDE_TYPES.find((r) => r.id === "premium")
                  : RIDE_TYPES[0];
              setSelectedType(rideType || RIDE_TYPES[0]);
            }}
          />
        </View>

        {/* Filter Chips */}
        <View className="px-4 mb-5">
          <FilterChips
            chips={FILTER_OPTIONS}
            selectedIds={selectedFilters}
            onToggle={handleToggleFilter}
          />
        </View>

        {/* Price Comparison */}
        <View className="px-4 mb-6">
          <PriceComparison
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
            savingsText={`You'll save 20-${savingsPercent}% vs Uber`}
            estimatedMinutes={estimatedDuration || 2}
          />
        </View>

        {/* Request Ride Button */}
        <View className="px-4">
          <TouchableOpacity
            onPress={handleConfirmRide}
            className="bg-teal-500 py-4 rounded-xl items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold">
              {isAuthenticated ? "Request Ride" : "Sign in to Book"}
            </Text>
          </TouchableOpacity>

          {!isAuthenticated && (
            <Text className="text-gray-500 text-sm text-center mt-3">
              You'll need to sign in to confirm your ride
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
