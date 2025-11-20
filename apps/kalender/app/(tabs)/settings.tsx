import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

import AppHeader from "@/components/AppHeader";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfileScreen() {
  const { contentPaddingBottom } = useTabBarHeight();
  const { user, logout } = useAuth();

  const [notifications, setNotifications] = useState({
    meetingReminders: true,
    meetingInvitation: true,
    dailyAgenda: true,
    weeklyDigest: true,
  });

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  return (
    <View className="flex-1 bg-[#1C1C1E]">
      <AppHeader title="Profile"  userName={user?.name} userInitial={user?.name.charAt(0)}/>

      <ScrollView
        className="flex-1 px-4"
        style={{ paddingBottom: contentPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center pt-5 pb-8">
          <View className="w-20 h-20 rounded-full bg-[#3A3A3C] justify-center items-center mb-4">
            <Ionicons name="people" size={40} color="#666" />
          </View>
          <ThemedText className="text-white text-xl font-bold mb-1">
            {user?.name || "User"}
          </ThemedText>
          <ThemedText className="text-[#8E8E93] text-base">
            {user?.email || "user@example.com"}
          </ThemedText>
        </View>

        <View className="bg-[#2C2C2E] rounded-xl p-5 mb-5 shadow-lg shadow-black/30">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-white text-lg font-bold">
              Profile Information
            </ThemedText>
            <TouchableOpacity>
              <ThemedText className="text-white text-sm font-semibold">
                Edit
              </ThemedText>
            </TouchableOpacity>
          </View>
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <ThemedText className="text-[#8E8E93] text-sm">
                Full Name:
              </ThemedText>
              <ThemedText className="text-white text-sm font-medium">
                {user?.name || "Not set"}
              </ThemedText>
            </View>
            <View className="flex-row justify-between items-center">
              <ThemedText className="text-[#8E8E93] text-sm">
                Email Address:
              </ThemedText>
              <ThemedText className="text-white text-sm font-medium">
                {user?.email || "Not set"}
              </ThemedText>
            </View>
            <View className="flex-row justify-between items-center">
              <ThemedText className="text-[#8E8E93] text-sm">
                Timezone:
              </ThemedText>
              <ThemedText className="text-white text-sm font-medium">
                UTC-5 (Eastern)
              </ThemedText>
            </View>
            <View className="flex-row justify-between items-center">
              <ThemedText className="text-[#8E8E93] text-sm">
                Working Hours:
              </ThemedText>
              <ThemedText className="text-white text-sm font-medium">
                09:00 - 17:00
              </ThemedText>
            </View>
          </View>
        </View>

        <View className="bg-[#2C2C2E] rounded-xl p-5 mb-5 shadow-lg shadow-black/30">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-white text-lg font-bold">
              Notification Settings
            </ThemedText>
            <TouchableOpacity>
              <ThemedText className="text-white text-sm font-semibold">
                Edit
              </ThemedText>
            </TouchableOpacity>
          </View>
          <View className="gap-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-1 mr-4">
                <ThemedText className="text-white text-sm">
                  Meeting Reminders: Get Notified 15 minutes before.
                </ThemedText>
              </View>
              <Switch
                value={notifications.meetingReminders}
                onValueChange={(value) =>
                  setNotifications({
                    ...notifications,
                    meetingReminders: value,
                  })
                }
                trackColor={{ false: "#3A3A3C", true: "white" }}
                thumbColor={
                  notifications.meetingReminders ? "#1C1C1E" : "#8E8E93"
                }
                ios_backgroundColor="#3A3A3C"
              />
            </View>
            <View className="flex-row justify-between items-center">
              <View className="flex-1 mr-4">
                <ThemedText className="text-white text-sm">
                  Meeting Invitation: Receive notifications for new meeting
                  invites.
                </ThemedText>
              </View>
              <Switch
                value={notifications.meetingInvitation}
                onValueChange={(value) =>
                  setNotifications({
                    ...notifications,
                    meetingInvitation: value,
                  })
                }
                trackColor={{ false: "#3A3A3C", true: "white" }}
                thumbColor={
                  notifications.meetingInvitation ? "#1C1C1E" : "#8E8E93"
                }
                ios_backgroundColor="#3A3A3C"
              />
            </View>
            <View className="flex-row justify-between items-center">
              <View className="flex-1 mr-4">
                <ThemedText className="text-white text-sm">
                  Daily Agenda: Get your daily meeting summary each morning.
                </ThemedText>
              </View>
              <Switch
                value={notifications.dailyAgenda}
                onValueChange={(value) =>
                  setNotifications({ ...notifications, dailyAgenda: value })
                }
                trackColor={{ false: "#3A3A3C", true: "white" }}
                thumbColor={notifications.dailyAgenda ? "#1C1C1E" : "#8E8E93"}
                ios_backgroundColor="#3A3A3C"
              />
            </View>
            <View className="flex-row justify-between items-center">
              <View className="flex-1 mr-4">
                <ThemedText className="text-white text-sm">
                  Weekly Digest: Receive weekly meetings statistics and
                  insights.
                </ThemedText>
              </View>
              <Switch
                value={notifications.weeklyDigest}
                onValueChange={(value) =>
                  setNotifications({ ...notifications, weeklyDigest: value })
                }
                trackColor={{ false: "#3A3A3C", true: "white" }}
                thumbColor={notifications.weeklyDigest ? "#1C1C1E" : "#8E8E93"}
                ios_backgroundColor="#3A3A3C"
              />
            </View>
          </View>
        </View>

        <View className="bg-[#2C2C2E] rounded-xl p-5 mb-5 shadow-lg shadow-black/30">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-white text-lg font-bold">
              Calendar Integrations
            </ThemedText>
          </View>
          <View className="gap-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-1 mr-4">
                <ThemedText className="text-white text-sm">
                  Google Calendar: Sync your meetings with Google Calendar
                </ThemedText>
              </View>
              <TouchableOpacity className="bg-white px-3 py-1.5 rounded-lg">
                <ThemedText className="text-[#1C1C1E] text-xs font-semibold" style={{color: 'black'}}>
                  Connected
                </ThemedText>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between items-center">
              <View className="flex-1 mr-4">
                <ThemedText className="text-white text-sm">
                  Outlook Calendar: Sync your meetings with Outlook Calendar
                </ThemedText>
              </View>
              <TouchableOpacity className="bg-white px-3 py-1.5 rounded-lg">
                <ThemedText className="text-[#1C1C1E] text-xs font-semibold"  style={{color: 'black'}}>
                  Connect
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-[#FF3B30] py-4 rounded-xl items-center mb-8"
          onPress={handleLogout}
        >
          <ThemedText className="text-white text-base font-semibold">
            Sign Out
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
