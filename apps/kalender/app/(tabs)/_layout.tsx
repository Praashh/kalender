import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigationAnalytics } from '@/hooks/useNavigationAnalytics';

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTabs = withLayoutContext(Navigator);
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const analytics = useNavigationAnalytics();

  const handleTabPress = (tabName: string) => {
    analytics.trackNavigationEvent('tab_press', { tabName });
  };

  return (
    <MaterialTabs
      tabBarPosition="bottom"
      screenOptions={{
        animationEnabled: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#8E8E93',
        swipeEnabled: true,
        tabBarShowIcon: true,
        tabBarIndicatorStyle: {
          backgroundColor: 'white',
          height: 2,
        },
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: '#1C1C1E',
            borderTopWidth: 0,
            height: 85 + insets.bottom,
            paddingBottom: 25 + insets.bottom,
            paddingTop: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
            position: 'absolute',
          },
          android: {
            backgroundColor: '#1C1C1E',
            borderTopWidth: 0,
            height: 70 + insets.bottom,
            paddingBottom: 15 + insets.bottom,
            paddingTop: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          },
        }),
      }}>
      <MaterialTabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('index'),
        }}
      />
      <MaterialTabs.Screen
        name="availability"
        options={{
          title: 'Availability',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons 
              name={focused ? "time-sharp" : "time-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('explore'),
        }}
      />
      <MaterialTabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons 
              name={focused ? "add-circle" : "add-circle-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('create'),
        }}
      />
      <MaterialTabs.Screen
        name="meetings"
        options={{
          title: 'Meetings',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons 
              name={focused ? "list" : "list-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('meetings'),
        }}
      />
      <MaterialTabs.Screen
        name="settings"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress('settings'),
        }}
      />
    </MaterialTabs>
  );
}
