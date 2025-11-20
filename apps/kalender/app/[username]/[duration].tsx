import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useLocalSearchParams } from 'expo-router';
import { useAvailability } from '@/hooks/useAvailability';
import useBooking from '@/hooks/useBooking';
import { useAuth } from '@/contexts/AuthContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

function getPartsFromISO(iso: string, timeZone: string) {
  const dt = new Date(iso);
  const parts = new Intl.DateTimeFormat('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).formatToParts(dt);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
  return { hour, minute };
}

function dateStrToYMD(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { y, m, d };
}

function buildLocalDateFromYMDAndTimeZone(dateStr: string, hour: number, minute: number) {
  const { y, m, d } = dateStrToYMD(dateStr);
  return new Date(y, m - 1, d, hour, minute, 0, 0);
}

function formatSlotLabel(date: Date, timeZone: string, use24h: boolean) {
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24h,
    timeZone,
  });
}

function jsWeekdayFromDataDay(dayNumber: number) {
  return dayNumber === 7 ? 0 : dayNumber;
}

export default function SessionScreen() {
  const { username: qsUsername, duration: qsDuration } = useLocalSearchParams();
  const username = typeof qsUsername === 'string' ? qsUsername : 'unknown';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const duration = typeof qsDuration === 'string' ? qsDuration : '15';
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  });
  const [availabilities, setAvailabilities] = useState<any[] | null>(null);
  const [eventTypes, setEventTypes] = useState<any[] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const { fetchEventAvailability } = useAvailability();
  const {user} = useAuth();
  const { createBooking } =  useBooking()
  const [use24h, setUse24h] = useState(false);

  useEffect(() => {
    fetchEventAvailability(username, duration)
      .then((data) => {
        console.log('Fetched event availability data:', data?.availabilities, data?.eventTypes);
        setAvailabilities(data?.availabilities ?? []);
        setEventTypes(data?.eventTypes ?? []);
      })
      .catch((err) => {
        console.error('Failed to fetch event availability:', err);
      });
  }, []);

  const durationMinutes = useMemo(() => {
    const qd = Number(qsDuration);
    if (qd && !isNaN(qd)) return qd;
    if (eventTypes && eventTypes.length > 0) return eventTypes[0].duration ?? 15;
    return 15;
  }, [qsDuration, eventTypes]);

  const slotsForSelectedDate = useMemo(() => {
    if (!availabilities || availabilities.length === 0) return [];

    const ymd = dateStrToYMD(selectedDate);
    const jsWeekday = new Date(ymd.y, ymd.m - 1, ymd.d).getDay();
    const slots: { id: string; label: string; iso: string }[] = [];

    availabilities.forEach((av: any) => {
      const tz = av.timezone ?? 'UTC';
      const allowedJsDays = (av.days ?? []).map((d: any) => jsWeekdayFromDataDay(d));
      if (!allowedJsDays.includes(jsWeekday)) return;

      const { hour: startHour, minute: startMinute } = getPartsFromISO(av.startTime, tz);
      const { hour: endHour, minute: endMinute } = getPartsFromISO(av.endTime, tz);

      const startLocal = buildLocalDateFromYMDAndTimeZone(selectedDate, startHour, startMinute);
      const endLocal = buildLocalDateFromYMDAndTimeZone(selectedDate, endHour, endMinute);
      if (endLocal.getTime() <= startLocal.getTime()) endLocal.setDate(endLocal.getDate() + 1);

      let cursor = new Date(startLocal.getTime());
      let idx = 0;
      while (cursor.getTime() + durationMinutes * 60 * 1000 <= endLocal.getTime()) {
        const label = formatSlotLabel(cursor, tz, use24h);
        const iso = cursor.toISOString();
        slots.push({ id: `${av.id}-${idx}`, label, iso });
        cursor = new Date(cursor.getTime() + durationMinutes * 60 * 1000);
        idx += 1;
      }
    });

    return slots;
  }, [availabilities, selectedDate, durationMinutes, use24h]);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    if (!availabilities) return marks;

    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const weekday = d.getDay();
      const anyAvail = availabilities.some((av: any) => {
        const allowed = (av.days ?? []).map((ds: number) => jsWeekdayFromDataDay(ds));
        return allowed.includes(weekday);
      });
      if (anyAvail) marks[key] = { marked: true };
    }
    marks[selectedDate] = { ...(marks[selectedDate] ?? {}), selected: true, selectedColor: '#FFFFFF' };
    return marks;
  }, [availabilities, selectedDate]);

  const handleConfirm = () => {
    console.log('Booking confirmed:', {
      slot: selectedSlot,
      name,
      email,
      notes,
    });
    createBooking({
      guestName: name,
      guestEmail: email,
      addtionalNote: notes, 
      slug: duration.toString(),
      hostId: user!.id,
      startTime: selectedSlot.iso
    })
    setSelectedSlot(null); // Close modal after confirm
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1 px-5 py-6">
        {/* Profile */}
        <View className="flex-row items-center mb-5">
          <Image source={{ uri: 'https://via.placeholder.com/60' }} className="w-14 h-14 rounded-full mr-4" />
          <View>
            <Text className="text-white text-lg font-semibold">{username}</Text>
            <Text className="text-gray-400 mt-1">{durationMinutes} Min Meeting</Text>
          </View>
        </View>

        {/* Calendar */}
        <View className="mb-5">
          <Calendar
            theme={{
              backgroundColor: 'black',
              calendarBackground: 'black',
              dayTextColor: 'white',
              monthTextColor: 'white',
              selectedDayBackgroundColor: 'white',
              selectedDayTextColor: 'black',
              arrowColor: 'white',
            }}
            current={selectedDate}
            markedDates={markedDates}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setSelectedSlot(null);
            }}
            style={{ borderRadius: 12 }}
          />
        </View>

        {/* Time format toggle */}
        <View className="flex-row mb-4">
          <TouchableOpacity
            onPress={() => setUse24h(false)}
            className={`rounded-md px-3 py-1 mr-2 ${!use24h ? 'bg-white' : 'bg-[#1C1C1C]'}`}
          >
            <Text className={`${!use24h ? 'text-black' : 'text-gray-300'} text-sm`}>12h</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUse24h(true)}
            className={`rounded-md px-3 py-1 ${use24h ? 'bg-white' : 'bg-[#1C1C1C]'}`}
          >
            <Text className={`${use24h ? 'text-black' : 'text-gray-300'} text-sm`}>24h</Text>
          </TouchableOpacity>
        </View>

        {/* Slots */}
        <Text className="text-white font-semibold mb-3">
          {new Date(selectedDate).toLocaleDateString(undefined, {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
        </Text>

        {slotsForSelectedDate.length === 0 ? (
          <View className="py-6 items-center">
            <Text className="text-gray-400">No available slots on this date.</Text>
          </View>
        ) : (
          <View className="space-y-3 mb-20">
            {slotsForSelectedDate.map((s) => (
              <TouchableOpacity
                key={s.id}
                onPress={() => setSelectedSlot(s)}
                className={`rounded-lg px-4 py-3 flex-row items-center justify-between ${
                  selectedSlot?.id === s.id ? 'bg-white' : 'bg-[#1C1C1C]'
                }`}
              >
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-white mr-3" />
                  <Text className={`${selectedSlot?.id === s.id ? 'text-black' : 'text-white'} text-base`}>
                    {s.label}
                  </Text>
                </View>
                {selectedSlot?.id === s.id && <Text className="text-black text-sm font-medium">Selected</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        visible={!!selectedSlot}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedSlot(null)}
      >
        <Pressable
          onPress={() => setSelectedSlot(null)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            justifyContent: 'flex-end',
          }}
        >
          <Pressable
            style={{
              backgroundColor: 'black',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: SCREEN_HEIGHT * 0.8,
            }}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-white text-lg font-semibold mb-4">Confirm your details</Text>

              <Text className="text-gray-300 mb-2">
                {new Date(selectedSlot?.iso ?? '').toLocaleString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text className="text-gray-400 mb-4">{durationMinutes}m Meeting</Text>

              <TextInput
                className="h-12 border border-[#3A3A3C] rounded-xl px-4 text-base text-white bg-[#1C1C1E] mb-3"
                placeholder="Your name"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                className="h-12 border border-[#3A3A3C] rounded-xl px-4 text-base text-white bg-[#1C1C1E] mb-3"
                placeholder="Email address"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                className="h-20 border border-[#3A3A3C] rounded-xl px-4 py-3 text-base text-white bg-[#1C1C1E] mb-4"
                placeholder="Additional notes (optional)"
                placeholderTextColor="#666"
                multiline
                value={notes}
                onChangeText={setNotes}
              />

              <TouchableOpacity className="flex-row items-center mb-5">
                <Text className="text-white text-base">＋ Add guests</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleConfirm} className="bg-white py-4 rounded-lg items-center">
                <Text className="text-black text-lg font-semibold">Confirm</Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
