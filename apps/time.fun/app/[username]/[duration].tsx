import { useAvailability } from '@/hooks/useAvailability';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function SessionScreen() {
  const { username, duration } = useLocalSearchParams();
  const [availabilities, setAvailabilities] = useState<any>();
  const [eventTypes, setEventTypes] = useState<any>();
  const { fetchEventAvailability } = useAvailability();

  useEffect(() => {
    (async () => {
      if (username && duration) {
        const data = await fetchEventAvailability(username as string, duration as string);
        setAvailabilities(data.availabilities);
        setEventTypes(data.eventTypes);
      }
    })();
  }, [username, duration]);

  return (
    <ScrollView className="flex-1 bg-[#1C1C1E] px-5 py-6">
      {/* Profile Section */}
      <View className="flex-row items-center mb-5">
        <Image
          source={{ uri: 'https://via.placeholder.com/60' }} // dummy image
          className="w-14 h-14 rounded-full mr-4"
        />
        <View>
          <Text className="text-white text-lg font-semibold">{username || 'Prashant Varma'}</Text>
          <Text className="text-gray-400 mt-1">30 Min Meeting</Text>
        </View>
      </View>

      {/* Calendar */}
      <View className="mb-5">
        <Calendar
          theme={{
            backgroundColor: '#1C1C1E',
            calendarBackground: '#1C1C1E',
            dayTextColor: '#FFFFFF',
            monthTextColor: '#FFFFFF',
            selectedDayBackgroundColor: '#2563EB',
            selectedDayTextColor: '#FFFFFF',
            arrowColor: '#FFFFFF',
          }}
          current={'2025-10-14'}
          markedDates={{
            '2025-10-14': { selected: true, marked: true, selectedColor: '#2563EB' },
            '2025-10-15': { marked: true },
            '2025-10-16': { marked: true },
          }}
          onDayPress={day => console.log('selected day', day)}
          style={{
            borderRadius: 12,
          }}
        />
      </View>

      {/* Time Slots */}
      <Text className="text-white font-semibold mb-3">Tue 14</Text>
      <View className="flex-row mb-4">
        <TouchableOpacity className="bg-[#2C2C2E] rounded-md px-3 py-1 mr-2">
          <Text className="text-gray-300 text-sm">12h</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-[#3A3A3C] rounded-md px-3 py-1">
          <Text className="text-white text-sm">24h</Text>
        </TouchableOpacity>
      </View>

      <View className="space-y-3">
        {['9:00am', '9:30am', '10:00am', '10:30am'].map((time, i) => (
          <TouchableOpacity key={i} className="bg-[#2C2C2E] rounded-lg px-4 py-3 flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-3" />
            <Text className="text-white text-base">{time}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
