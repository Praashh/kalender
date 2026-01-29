import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRide, Location } from "@/contexts/RideContext";
import {
  SAVED_PLACES,
  RECENT_SEARCHES,
  MOCK_SEARCH_RESULTS,
} from "@/constants/mockData";

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ preselected?: string }>();
  const { pickup, setDestination } = useRide();
  const inputRef = useRef<TextInput>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Location[]>([]);

  // Auto-focus the input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  // Handle preselected destination from params
  useEffect(() => {
    if (params.preselected) {
      try {
        const place = JSON.parse(params.preselected) as Location;
        handleSelectDestination(place);
      } catch (e) {
        console.error("Error parsing preselected place:", e);
      }
    }
  }, [params.preselected]);

  // Filter search results based on query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = MOCK_SEARCH_RESULTS.filter(
        (place) =>
          place.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSelectDestination = (place: Location) => {
    Keyboard.dismiss();
    setDestination(place);
    router.replace("/select-rider");
  };

  const handleClose = () => {
    router.back();
  };

  const renderLocationItem = ({
    item,
    icon,
    iconColor = "#6b7280",
    iconBg = "bg-gray-100",
  }: {
    item: Location;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    iconBg?: string;
  }) => (
    <TouchableOpacity
      onPress={() => handleSelectDestination(item)}
      className="flex-row items-center py-4 border-b border-gray-100"
      activeOpacity={0.7}
    >
      <View className={`w-10 h-10 ${iconBg} rounded-full items-center justify-center mr-4`}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-gray-900 font-medium">{item.name}</Text>
        <Text className="text-gray-400 text-sm mt-0.5" numberOfLines={1}>
          {item.address}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-2 pb-4 border-b border-gray-100">
        {/* Close button and title */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={handleClose} className="p-2 -ml-2">
            <Ionicons name="close" size={28} color="#374151" />
          </TouchableOpacity>
          <Text className="text-gray-900 text-lg font-semibold ml-2">
            Choose destination
          </Text>
        </View>

        {/* Pickup and Destination inputs */}
        <View className="bg-gray-50 rounded-2xl p-3">
          {/* Pickup */}
          <View className="flex-row items-center">
            <View className="w-8 items-center">
              <View className="w-3 h-3 bg-teal-500 rounded-full" />
            </View>
            <View className="flex-1 py-2">
              <Text className="text-gray-400 text-xs font-medium">Pickup</Text>
              <Text className="text-gray-900 font-medium">
                {pickup?.name || pickup?.address || "Current Location"}
              </Text>
            </View>
          </View>

          {/* Divider with line */}
          <View className="flex-row items-center">
            <View className="w-8 items-center">
              <View className="w-0.5 h-4 bg-gray-300" />
            </View>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Destination */}
          <View className="flex-row items-center">
            <View className="w-8 items-center">
              <View className="w-3 h-3 bg-teal-500 rounded-full" />
            </View>
            <TextInput
              ref={inputRef}
              className="flex-1 py-2 text-gray-900 text-base"
              placeholder="Where to?"
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={
          searchResults.length > 0
            ? searchResults
            : searchQuery.length === 0
              ? [...SAVED_PLACES, ...RECENT_SEARCHES]
              : []
        }
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => {
          let icon: keyof typeof Ionicons.glyphMap = "time-outline";
          let iconColor = "#6b7280";
          let iconBg = "bg-gray-100";

          if (item.name === "Home") {
            icon = "home";
            iconColor = "#14B8A6";
            iconBg = "bg-teal-100";
          } else if (item.name === "Work") {
            icon = "briefcase";
            iconColor = "#14B8A6";
            iconBg = "bg-teal-100";
          } else if (searchResults.length > 0) {
            icon = "location";
            iconColor = "#14B8A6";
            iconBg = "bg-teal-100";
          }

          return renderLocationItem({ item, icon, iconColor, iconBg });
        }}
        ListHeaderComponent={
          searchQuery.length === 0 ? (
            <View className="px-4 pt-4">
              <Text className="text-gray-400 text-xs font-semibold mb-2 tracking-wide">
                {SAVED_PLACES.some((p) => p.name === "Home" || p.name === "Work")
                  ? "SAVED & RECENT"
                  : "RECENT SEARCHES"}
              </Text>
            </View>
          ) : searchResults.length > 0 ? (
            <View className="px-4 pt-4">
              <Text className="text-gray-400 text-xs font-semibold mb-2 tracking-wide">
                SEARCH RESULTS
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          searchQuery.length > 0 ? (
            <View className="items-center py-12">
              <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="search" size={32} color="#9ca3af" />
              </View>
              <Text className="text-gray-500 text-center">
                No results found for "{searchQuery}"
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}
