import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

import AppHeader from '@/components/AppHeader';
import { ThemedText } from '@/components/ThemedText';
import { useScreenTracking } from '@/hooks/useNavigationAnalytics';
import { useNavigationState } from '@/hooks/useNavigationState';
import { useTabBarHeight } from '@/hooks/useTabBarHeight';
import { NavigationUtils } from '@/utils/navigationUtils';

interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  attendees: number;
  status: 'upcoming' | 'starting-soon';
}

export default function DashboardScreen() {
  const [hasMeetings] = useState(true);
  const { contentPaddingBottom } = useTabBarHeight();
  
  const navigation = useNavigationState();
  const analytics = useScreenTracking('index');
  
  useEffect(() => {
    analytics.trackScreenView('index', { timestamp: Date.now() });
    
    console.log('Navigation state:', NavigationUtils.getNavigationStateString());
  }, [analytics]);
  
  
  const [meetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Team Standup',
      description: "Daily sync with development team",
      date: 'Today',
      time: '10:00 AM',
      attendees: 5,
      status: 'starting-soon'
    },
    {
      id: '2',
      title: 'Client Review',
      description: "Project milestone review with stakeholders",
      date: 'Today',
      time: '2:30 PM',
      attendees: 3,
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Design Workshop',
      description: "UI/UX design brainstorming session",
      date: 'Tomorrow',
      time: '11:00 AM',
      attendees: 4,
      status: 'upcoming'
    }
  ]);

  const MeetingCard = ({ meeting }: { meeting: Meeting }) => (
    <View className="bg-[#2C2C2E] rounded-2xl p-5 mb-3 shadow-lg shadow-black/30">
      <View className="flex-row items-start mb-4">
        <View className="w-10 h-10 rounded-full bg-[#3A3A3C] justify-center items-center mr-3">
          <Ionicons name="videocam" size={20} color="white" />
        </View>
        <View className="flex-1">
          <ThemedText className="text-white text-base font-semibold mb-1">{meeting.title}</ThemedText>
          <ThemedText className="text-[#8E8E93] text-sm leading-5">{meeting.description}</ThemedText>
        </View>
        {meeting.status === 'starting-soon' && (
          <View className="bg-[#3A3A3C] px-2 py-1 rounded-xl">
            <ThemedText className="text-white text-xs font-semibold">Soon</ThemedText>
          </View>
        )}
      </View>
      
      <View className="flex-row justify-between">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
          <ThemedText className="text-[#8E8E93] text-xs">{meeting.date}</ThemedText>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="time-outline" size={16} color="#8E8E93" />
          <ThemedText className="text-[#8E8E93] text-xs">{meeting.time}</ThemedText>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="people-outline" size={16} color="#8E8E93" />
          <ThemedText className="text-[#8E8E93] text-xs">{meeting.attendees}</ThemedText>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#1C1C1E]">
      <AppHeader showProfile={true} />

      <ScrollView 
        className="flex-1 px-4" 
        style={{ paddingBottom: contentPaddingBottom }} 
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity 
            className="flex-1 bg-[#2C2C2E] rounded-xl p-4 items-center flex-row justify-center"
            onPress={() => navigation.navigate('create')}
          >
            <View className="w-8 h-8 rounded-full bg-[#3A3A3C] justify-center items-center mr-2">
              <Ionicons name="add" size={20} color="white" />
            </View>
            <ThemedText className="text-white text-sm font-semibold">New Meeting</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 bg-[#2C2C2E] rounded-xl p-4 items-center flex-row justify-center"
            onPress={() => navigation.navigate('explore')}
          >
            <View className="w-8 h-8 rounded-full bg-[#3A3A3C] justify-center items-center mr-2">
              <Ionicons name="calendar-outline" size={20} color="white" />
            </View>
            <ThemedText className="text-white text-sm font-semibold">View Calendar</ThemedText>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-[#2C2C2E] rounded-2xl p-5 items-center shadow-lg shadow-black/30">
            <View className="w-10 h-10 rounded-full bg-[#3A3A3C] justify-center items-center mb-3">
              <Ionicons name="today-outline" size={20} color="white" />
            </View>
            <View className="items-center">
              <ThemedText className="text-white text-2xl font-bold mb-1">2</ThemedText>
              <ThemedText className="text-[#8E8E93] text-xs text-center">Today</ThemedText>
            </View>
          </View>
          <View className="flex-1 bg-[#2C2C2E] rounded-2xl p-5 items-center shadow-lg shadow-black/30">
            <View className="w-10 h-10 rounded-full bg-[#3A3A3C] justify-center items-center mb-3">
              <Ionicons name="calendar-outline" size={20} color="white" />
            </View>
            <View className="items-center">
              <ThemedText className="text-white text-2xl font-bold mb-1">8</ThemedText>
              <ThemedText className="text-[#8E8E93] text-xs text-center">This Week</ThemedText>
            </View>
          </View>
          <View className="flex-1 bg-[#2C2C2E] rounded-2xl p-5 items-center shadow-lg shadow-black/30">
            <View className="w-10 h-10 rounded-full bg-[#3A3A3C] justify-center items-center mb-3">
              <Ionicons name="people-outline" size={20} color="white" />
            </View>
            <View className="items-center">
              <ThemedText className="text-white text-2xl font-bold mb-1">24</ThemedText>
              <ThemedText className="text-[#8E8E93] text-xs text-center">Total</ThemedText>
            </View>
          </View>
        </View>

        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-white text-lg font-bold">Upcoming</ThemedText>
            <TouchableOpacity>
              <ThemedText className="text-white text-sm font-semibold">See all</ThemedText>
            </TouchableOpacity>
          </View>

          {hasMeetings ? (
            <View className="gap-3">
              {meetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </View>
          ) : (
            <View className="items-center py-15">
              <View className="mb-4">
                <Ionicons name="calendar-outline" size={48} color="#8E8E93" />
              </View>
              <ThemedText className="text-white text-lg font-semibold mb-2">No meetings scheduled</ThemedText>
              <ThemedText className="text-[#8E8E93] text-sm text-center mb-6">Create your first meeting to get started</ThemedText>
              <TouchableOpacity className="bg-white py-3 px-6 rounded-lg">
                <ThemedText className="text-[#1C1C1E] text-sm font-semibold">Create Meeting</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Remove the entire StyleSheet.create block since we're using Tailwind CSS