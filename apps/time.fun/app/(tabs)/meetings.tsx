import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import AppHeader from '@/components/AppHeader';
import { useTabBarHeight } from '@/hooks/useTabBarHeight';
import useMeeting from '@/hooks/useMeeting';

interface IBooking {
  id: string;
  eventTypeId: string;
  hostId: string;
  guestId?: string;
  guestEmail: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  startTime: Date;
  endTime: Date;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: number;
  status: 'upcoming' | 'starting-soon';
}

export default function MeetingsScreen() {
  const { contentPaddingBottom } = useTabBarHeight();
  const { bookings } = useMeeting();
  const [searchQuery, setSearchQuery] = useState('');

  // Convert bookings into the Meeting shape
  const formattedBookings: Meeting[] = useMemo(
    () =>
      bookings.map((booking: IBooking) => ({
        id: booking.id,
        title: `Meeting with ${booking.guestEmail}`,
        date: new Date(booking.startTime).toLocaleDateString(),
        time: new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        attendees: booking.guestEmail ? 2 : 1,
        status: booking.status === 'CONFIRMED' ? 'upcoming' : 'starting-soon',
      })),
    [bookings]
  );

  // Combine mock + real data
  const allMeetings = useMemo(() => [...formattedBookings], [formattedBookings]);

  // Filter meetings based on search
  const filteredMeetings = allMeetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const MeetingCard = ({ meeting, index }: { meeting: Meeting; index: number }) => (
    <View style={styles.meetingCard}>
      <ThemedText style={styles.meetingTitle}>{meeting.title}</ThemedText>
      <View style={styles.meetingDetails}>
        <View style={styles.meetingDetail}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <ThemedText style={styles.meetingDetailText}>{meeting.date}</ThemedText>
        </View>
        <View style={styles.meetingDetail}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <ThemedText style={styles.meetingDetailText}>{meeting.time}</ThemedText>
        </View>
        <View style={styles.meetingDetail}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <ThemedText style={styles.meetingDetailText}>{meeting.attendees} attendees</ThemedText>
        </View>
      </View>
      {meeting.status === 'starting-soon' && (
        <View style={styles.startingSoonBanner}>
          <ThemedText style={styles.startingSoonText}>Starting soon</ThemedText>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="Meetings" />

      <ScrollView
        style={[styles.content, { paddingBottom: contentPaddingBottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <ThemedText style={styles.title}>All Meetings ({filteredMeetings.length})</ThemedText>
          <ThemedText style={styles.subtitle}>View and manage all your meetings.</ThemedText>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search with meeting name or attendee name.."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.meetingsList}>
          {filteredMeetings.length > 0 ? (
            filteredMeetings.map((meeting, index) => (
              <MeetingCard key={meeting.id} meeting={meeting} index={index} />
            ))
          ) : (
            <ThemedText style={{ color: '#8E8E93', textAlign: 'center', marginTop: 20 }}>
              No meetings found.
            </ThemedText>
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
  },
  titleSection: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'white',
    backgroundColor: '#2C2C2E',
  },
  meetingsList: {
    gap: 12,
    paddingBottom: 30,
  },
  meetingCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  meetingDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  meetingDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  meetingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meetingDetailText: {
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
});
