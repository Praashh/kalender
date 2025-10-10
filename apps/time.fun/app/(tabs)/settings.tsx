import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View, Alert } from 'react-native';

import AppHeader from '@/components/AppHeader';
import { useTabBarHeight } from '@/hooks/useTabBarHeight';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { contentPaddingBottom } = useTabBarHeight();
  const { user, logout } = useAuth();
  
  const [notifications, setNotifications] = useState({
    meetingReminders: true,
    meetingInvitation: true,
    dailyAgenda: true,
    weeklyDigest: true
  });

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };


  return (
    <View style={styles.container}>
      <AppHeader title="Profile" />

      <ScrollView style={[styles.content, { paddingBottom: contentPaddingBottom }]} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            <Ionicons name="people" size={40} color="#666" />
          </View>
          <ThemedText style={styles.profileName}>{user?.name || 'User'}</ThemedText>
          <ThemedText style={styles.profileEmail}>{user?.email || 'user@example.com'}</ThemedText>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Profile Information</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.editButton}>Edit</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Full Name:</ThemedText>
              <ThemedText style={styles.infoValue}>{user?.name || 'Not set'}</ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Email Address:</ThemedText>
              <ThemedText style={styles.infoValue}>{user?.email || 'Not set'}</ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Timezone:</ThemedText>
              <ThemedText style={styles.infoValue}>UTC-5 (Eastern)</ThemedText>
            </View>
            <View style={styles.infoItem}>
              <ThemedText style={styles.infoLabel}>Working Hours:</ThemedText>
              <ThemedText style={styles.infoValue}>09:00 - 17:00</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Notification Settings</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.editButton}>Edit</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.notificationContainer}>
            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <ThemedText style={styles.notificationTitle}>Meeting Reminders: Get Notified 15 minutes before.</ThemedText>
              </View>
              <Switch
                value={notifications.meetingReminders}
                onValueChange={(value) => setNotifications({...notifications, meetingReminders: value})}
                trackColor={{ false: '#3A3A3C', true: 'white' }}
                thumbColor={notifications.meetingReminders ? '#1C1C1E' : '#8E8E93'}
                ios_backgroundColor="#3A3A3C"
              />
            </View>
            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <ThemedText style={styles.notificationTitle}>Meeting Invitation: Receive notifications for new meeting invites.</ThemedText>
              </View>
              <Switch
                value={notifications.meetingInvitation}
                onValueChange={(value) => setNotifications({...notifications, meetingInvitation: value})}
                trackColor={{ false: '#3A3A3C', true: 'white' }}
                thumbColor={notifications.meetingInvitation ? '#1C1C1E' : '#8E8E93'}
                ios_backgroundColor="#3A3A3C"
              />
            </View>
            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <ThemedText style={styles.notificationTitle}>Daily Agenda: Get your daily meeting summary each morning.</ThemedText>
              </View>
              <Switch
                value={notifications.dailyAgenda}
                onValueChange={(value) => setNotifications({...notifications, dailyAgenda: value})}
                trackColor={{ false: '#3A3A3C', true: 'white' }}
                thumbColor={notifications.dailyAgenda ? '#1C1C1E' : '#8E8E93'}
                ios_backgroundColor="#3A3A3C"
              />
            </View>
            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <ThemedText style={styles.notificationTitle}>Weekly Digest: Receive weekly meetings statistics and insights.</ThemedText>
              </View>
              <Switch
                value={notifications.weeklyDigest}
                onValueChange={(value) => setNotifications({...notifications, weeklyDigest: value})}
                trackColor={{ false: '#3A3A3C', true: 'white' }}
                thumbColor={notifications.weeklyDigest ? '#1C1C1E' : '#8E8E93'}
                ios_backgroundColor="#3A3A3C"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Calendar Integrations</ThemedText>
          </View>
          <View style={styles.integrationContainer}>
            <View style={styles.integrationItem}>
              <View style={styles.integrationInfo}>
                <ThemedText style={styles.integrationTitle}>Google Calendar: Sync your meetings with Google Calendar</ThemedText>
              </View>
              <TouchableOpacity style={styles.connectedButton}>
                <ThemedText style={styles.connectedButtonText}>Connected</ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.integrationItem}>
              <View style={styles.integrationInfo}>
                <ThemedText style={styles.integrationTitle}>Outlook Calendar: Sync your meetings with Outlook Calendar</ThemedText>
              </View>
              <TouchableOpacity style={styles.connectButton}>
                <ThemedText style={styles.connectButtonText}>Connect</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    // paddingBottom is now set dynamically via useTabBarHeight hook
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#8E8E93',
  },
  section: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  infoContainer: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  infoValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  notificationContainer: {
    gap: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 14,
    color: 'white',
  },
  integrationContainer: {
    gap: 16,
  },
  integrationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  integrationInfo: {
    flex: 1,
    marginRight: 16,
  },
  integrationTitle: {
    fontSize: 14,
    color: 'white',
  },
  connectedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  connectedButtonText: {
    fontSize: 12,
    color: '#1C1C1E',
    fontWeight: '600',
  },
  connectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  connectButtonText: {
    fontSize: 12,
    color: '#1C1C1E',
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
}); 