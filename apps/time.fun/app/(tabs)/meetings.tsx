import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useMemo } from "react";
import { ScrollView, TextInput, View } from "react-native";

import AppHeader from "@/components/AppHeader";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import useMeeting from "@/hooks/useMeeting";

interface IBooking {
  id: string;
  eventTypeId: string;
  hostId: string;
  guestId?: string;
  guestEmail: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  startTime: Date;
  endTime: Date;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  attendees: number;
  status: "upcoming" | "starting-soon";
}

export default function MeetingsScreen() {
  const { contentPaddingBottom } = useTabBarHeight();
  const { bookings } = useMeeting();
  const [searchQuery, setSearchQuery] = useState("");

  // Convert bookings into the Meeting shape
  const formattedBookings: Meeting[] = useMemo(
    () =>
      bookings.map((booking: IBooking) => ({
        id: booking.id,
        title: `Meeting with ${booking.guestEmail}`,
        date: new Date(booking.startTime).toLocaleDateString(),
        time: new Date(booking.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        attendees: booking.guestEmail ? 2 : 1,
        status: booking.status === "CONFIRMED" ? "upcoming" : "starting-soon",
      })),
    [bookings]
  );

  const allMeetings = useMemo(
    () => [...formattedBookings],
    [formattedBookings]
  );

  const filteredMeetings = allMeetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MeetingCard = ({
    meeting,
    index,
  }: {
    meeting: Meeting;
    index: number;
  }) => (
    <View className="bg-[#2C2C2E] rounded-xl p-4 mb-3 shadow-lg shadow-black/30">
      <ThemedText className="text-white text-base font-bold mb-2">
        {meeting.title}
      </ThemedText>
      <View className="flex-row gap-4">
        <View className="flex-row items-center gap-1">
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <ThemedText className="text-[#8E8E93] text-xs">
            {meeting.date}
          </ThemedText>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="time-outline" size={16} color="#666" />
          <ThemedText className="text-[#8E8E93] text-xs">
            {meeting.time}
          </ThemedText>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="people-outline" size={16} color="#666" />
          <ThemedText className="text-[#8E8E93] text-xs">
            {meeting.attendees} attendees
          </ThemedText>
        </View>
      </View>
      {meeting.status === "starting-soon" && (
        <View className="bg-white py-2 px-3 rounded-lg mt-3 self-start">
          <ThemedText className="text-[#1C1C1E] text-xs font-semibold">
            Starting soon
          </ThemedText>
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-[#1C1C1E]">
      <AppHeader title="Meetings" />

      <ScrollView
        className="flex-1 px-4"
        style={{ paddingBottom: contentPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-5 pb-5">
          <ThemedText className="text-white text-2xl font-bold mb-2">
            All Meetings ({filteredMeetings.length})
          </ThemedText>
          <ThemedText className="text-[#8E8E93] text-base">
            View and manage all your meetings.
          </ThemedText>
        </View>

        <View className="mb-5">
          <TextInput
            className="h-12 border border-[#3A3A3C] rounded-xl px-4 text-base text-white bg-[#2C2C2E]"
            placeholder="Search with meeting name or attendee name.."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View className="gap-3 pb-8">
          {filteredMeetings.length > 0 ? (
            filteredMeetings.map((meeting, index) => (
              <MeetingCard key={meeting.id} meeting={meeting} index={index} />
            ))
          ) : (
            <ThemedText className="text-[#8E8E93] text-center mt-5">
              No meetings found.
            </ThemedText>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
