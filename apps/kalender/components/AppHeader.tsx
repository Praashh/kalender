import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';

interface AppHeaderProps {
  title?: string;
  showProfile?: boolean;
  showNotification?: boolean;
  userName?: string;
  userInitial?: string;
  greeting?: string;
}

function getTimeBasedGreeting() {
  const date = new Date();
  const hours = date.getHours();
  let greeting;

  if (hours < 12) {
    greeting = "Good Morning";
  } else if (hours >= 12 && hours <= 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  return greeting;
}

export default function AppHeader({
  title,
  showProfile = false,
  showNotification = true,
  userName = "User",
  userInitial = "U",
  greeting = getTimeBasedGreeting()
}: AppHeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {showProfile ? (
            <>
              <View style={styles.profileImage}>
                <ThemedText style={styles.profileInitial}>{userInitial}</ThemedText>
              </View>
              <View style={styles.greetingContainer}>
                <ThemedText style={styles.greeting}>{greeting}</ThemedText>
                <ThemedText style={styles.userName}>{userName}</ThemedText>
              </View>
            </>
          ) : (
            <ThemedText style={styles.headerText}>{title || "Kalendar"}</ThemedText>
          )}
        </View>

        {showNotification && (
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="white" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#1C1C1E',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  greetingContainer: {
    // Removed flex: 1 to prevent taking up all available space
  },
  greeting: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
});
