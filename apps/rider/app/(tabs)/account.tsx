import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showChevron?: boolean;
}

export default function AccountScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const menuItems: MenuItem[] = [
    {
      icon: "card-outline",
      title: "Payment",
      subtitle: "Manage payment methods",
      onPress: () => Alert.alert("Coming Soon", "Payment settings coming soon!"),
      showChevron: true,
    },
    {
      icon: "location-outline",
      title: "Saved Places",
      subtitle: "Home, Work, and more",
      onPress: () => Alert.alert("Coming Soon", "Saved places coming soon!"),
      showChevron: true,
    },
    {
      icon: "shield-checkmark-outline",
      title: "Safety",
      subtitle: "Emergency contacts & safety tools",
      onPress: () => Alert.alert("Coming Soon", "Safety features coming soon!"),
      showChevron: true,
    },
    {
      icon: "notifications-outline",
      title: "Notifications",
      subtitle: "Manage your notifications",
      onPress: () =>
        Alert.alert("Coming Soon", "Notification settings coming soon!"),
      showChevron: true,
    },
    {
      icon: "help-circle-outline",
      title: "Help",
      subtitle: "Get support and FAQs",
      onPress: () => Alert.alert("Coming Soon", "Help center coming soon!"),
      showChevron: true,
    },
    {
      icon: "information-circle-outline",
      title: "About",
      subtitle: "Version 1.0.0",
      onPress: () => Alert.alert("Zipo", "Version 1.0.0\nSave more on every ride"),
      showChevron: true,
    },
  ];

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-24 h-24 bg-teal-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="person-outline" size={48} color="#14B8A6" />
          </View>
          <Text className="text-gray-900 text-2xl font-bold text-center mb-3">
            Your Account
          </Text>
          <Text className="text-gray-500 text-center text-base mb-8">
            Sign in to access your profile, payment methods, and ride history.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/auth")}
            className="bg-teal-500 py-4 px-8 rounded-2xl w-full"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-lg text-center">
              Sign In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/auth?mode=register")}
            className="py-4 px-8 mt-3"
            activeOpacity={0.8}
          >
            <Text className="text-teal-500 font-semibold text-base text-center">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="px-4 py-6 bg-white border-b border-gray-100">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-teal-500 rounded-full items-center justify-center mr-4">
              <Text className="text-white text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 text-xl font-bold">
                {user?.name || "User"}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {user?.email || ""}
              </Text>
            </View>
            <TouchableOpacity className="p-2">
              <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </TouchableOpacity>
          </View>

          {/* Rating */}
          <View className="flex-row items-center mt-4 bg-gray-50 rounded-2xl p-4">
            <Ionicons name="star" size={20} color="#facc15" />
            <Text className="text-gray-900 font-semibold ml-2">4.95</Text>
            <Text className="text-gray-500 ml-2">Rating</Text>
            <View className="flex-1" />
            <Text className="text-gray-500">24 trips</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-4 py-4">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className="flex-row items-center py-4 bg-white mb-2 px-4 rounded-2xl"
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 bg-teal-50 rounded-full items-center justify-center mr-4">
                <Ionicons name={item.icon} size={20} color="#14B8A6" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-medium">{item.title}</Text>
                {item.subtitle && (
                  <Text className="text-gray-400 text-sm mt-0.5">
                    {item.subtitle}
                  </Text>
                )}
              </View>
              {item.showChevron && (
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              )}
            </TouchableOpacity>
          ))}

          {/* Sign Out Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center py-4 mt-4 bg-red-50 px-4 rounded-2xl"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-4">
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            </View>
            <Text className="text-red-500 font-medium">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding for tab bar */}
        <View className="h-32" />
      </ScrollView>
    </SafeAreaView>
  );
}
