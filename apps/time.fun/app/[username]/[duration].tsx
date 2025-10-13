import { useAvailability } from '@/hooks/useAvailability';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';


export default function SessionScreen() {
  const { username, duration } = useLocalSearchParams();
  const [availabilities, setAvailabilities] = useState<any>();
console.log('username=======', username)
console.log('duration=======', duration)
const {
  fetchEventAvailability
} =  useAvailability();

useEffect(() => {
  (async () => {
    if (username && duration) {
      const ab = await fetchEventAvailability(username as string, duration as string);
      setAvailabilities(ab);
    }
  })();
}, [username, duration]);


console.log(availabilities)

  return (
    <View className="flex-1 bg-[#1C1C1E]">
      <Text className='text-white'>User: {username}</Text>
      <Text className='text-white'>Duration: {duration}</Text>
      <Calendar
  // Customize the appearance of the calendar
  style={{
    borderWidth: 1,
    borderColor: 'gray',
    height: 350
  }}
  // Specify the current date
  current={'2012-03-01'}
  // Callback that gets called when the user selects a day
  onDayPress={day => {
    console.log('selected day', day);
  }}
  // Mark specific dates as marked
  markedDates={{
    '2025-10-12': {selected: true, marked: true, selectedColor: 'blue'},
    '2025-10-13': {marked: true},
    '2025-10-14': {selected: true, marked: true, selectedColor: 'blue'}
  }}
/>
{
  availabilities?.availabilities?.availabilities?.map((item: any, index: number) => (
    <View key={item.id || index} style={{ marginVertical: 8 }}>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        {item.name}
      </Text>
      <Text style={{ color: 'white' }}>
        Days: {item.days.join(', ')}
      </Text>
      <Text style={{ color: 'white' }}>
        Time: {new Date(item.startTime).toLocaleTimeString()} - {new Date(item.endTime).toLocaleTimeString()}
      </Text>
      <Text style={{ color: 'white' }}>
        Timezone: {item.timezone}
      </Text>
    </View>
  ))
}

    </View>
  );
}
