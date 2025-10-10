import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import AppHeader from '@/components/AppHeader';
import { ThemedText } from '@/components/ThemedText';
import { useDeepLinking } from '@/hooks/useDeepLinking';
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
  const deepLinking = useDeepLinking();
  
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
    <View style={styles.meetingCard}>
      <View style={styles.meetingHeader}>
        <View style={styles.meetingIcon}>
          <Ionicons name="videocam" size={20} color="white" />
        </View>
        <View style={styles.meetingInfo}>
          <ThemedText style={styles.meetingTitle}>{meeting.title}</ThemedText>
          <ThemedText style={styles.meetingDescription}>{meeting.description}</ThemedText>
        </View>
        {meeting.status === 'starting-soon' && (
          <View style={styles.statusBadge}>
            <ThemedText style={styles.statusText}>Soon</ThemedText>
          </View>
        )}
      </View>
      
      <View style={styles.meetingDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color="#8E8E93" />
          <ThemedText style={styles.detailText}>{meeting.date}</ThemedText>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#8E8E93" />
          <ThemedText style={styles.detailText}>{meeting.time}</ThemedText>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color="#8E8E93" />
          <ThemedText style={styles.detailText}>{meeting.attendees}</ThemedText>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader showProfile={true} />

      <ScrollView style={[styles.content, { paddingBottom: contentPaddingBottom }]} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('create')}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="add" size={20} color="white" />
            </View>
            <ThemedText style={styles.quickActionText}>New Meeting</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('explore')}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="calendar-outline" size={20} color="white" />
            </View>
            <ThemedText style={styles.quickActionText}>View Calendar</ThemedText>
          </TouchableOpacity>
        </View>


        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="today-outline" size={20} color="white" />
            </View>
            <View style={styles.statContent}>
              <ThemedText style={styles.statNumber}>2</ThemedText>
              <ThemedText style={styles.statLabel}>Today</ThemedText>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="calendar-outline" size={20} color="white" />
            </View>
            <View style={styles.statContent}>
              <ThemedText style={styles.statNumber}>8</ThemedText>
              <ThemedText style={styles.statLabel}>This Week</ThemedText>
            </View>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="people-outline" size={20} color="white" />
            </View>
            <View style={styles.statContent}>
              <ThemedText style={styles.statNumber}>24</ThemedText>
              <ThemedText style={styles.statLabel}>Total</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.meetingsSection}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Upcoming</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.viewAllText}>See all</ThemedText>
            </TouchableOpacity>
          </View>

          {hasMeetings ? (
            <View style={styles.meetingsList}>
              {meetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </View>
          ) : (
            <View style={styles.noMeetingsContainer}>
              <View style={styles.emptyStateIcon}>
                <Ionicons name="calendar-outline" size={48} color="#8E8E93" />
              </View>
              <ThemedText style={styles.noMeetingsText}>No meetings scheduled</ThemedText>
              <ThemedText style={styles.noMeetingsSubtext}>Create your first meeting to get started</ThemedText>
              <TouchableOpacity style={styles.createButton}>
                <ThemedText style={styles.createButtonText}>Create Meeting</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  quickActionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  greetingSection: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  meetingsSection: {
    marginBottom: 30,
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
  viewAllText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  meetingsList: {
    gap: 12,
  },
  meetingCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  meetingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  meetingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  meetingDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  statusBadge: {
    backgroundColor: '#3A3A3C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  meetingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  startingSoonBanner: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  startingSoonText: {
    color: '#1C1C1E',
    fontSize: 12,
    fontWeight: '600',
  },
  noMeetingsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  noMeetingsText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  noMeetingsSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#1C1C1E',
    fontSize: 14,
    fontWeight: '600',
  },
});

