import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
} from 'react-native';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import AppHeader from '@/components/AppHeader';
import { ThemedText } from '@/components/ThemedText';
import { useTabBarHeight } from '@/hooks/useTabBarHeight';
import { useAvailability } from '@/hooks/useAvailability';
import { useAuth } from '@/contexts/AuthContext';


type DayAvailability = {
  enabled: boolean;
  start: string; 
  end: string;   
};

const WEEK_DAYS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CreateAvailabilityModal() {
  const { contentPaddingBottom } = useTabBarHeight();
  const {
    refreshAvailabilities,
    createAvailabity
  } = useAvailability();

  const {user} = useAuth();

  const [name, setName] = useState('');
  const [availability, setAvailability] = useState<Record<number, DayAvailability>>({});
  const [pickerState, setPickerState] = useState<{
    visible: boolean;
    dayIndex: number | null;
    mode: 'start' | 'end';
  }>({ visible: false, dayIndex: null, mode: 'start' });

  const defaultAvailability = useMemo<Record<number, DayAvailability>>(() => {
    const defaults: Record<number, DayAvailability> = {};
    WEEK_DAYS.forEach((_, i) => {
      const start = new Date();
      start.setHours(i >= 1 && i <= 5 ? 9 : 0, 0, 0, 0);
      const end = new Date();
      end.setHours(i >= 1 && i <= 5 ? 17 : 0, 0, 0, 0);
      defaults[i] = {
        enabled: i >= 1 && i <= 5,
        start: start.toISOString(),
        end: end.toISOString(),
      };
    });
    return defaults;
  }, []);

  useEffect(() => {
    refreshAvailabilities();
    setAvailability(defaultAvailability);
  }, [refreshAvailabilities, defaultAvailability]);

  // Format time from ISO string to readable format
  const formatAvailabilityTime = (isoString: string): string => {
    try {
      return format(new Date(isoString), 'h:mma').toLowerCase();
    } catch {
      return '--:--';
    }
  };

  const saveAvailability = async () => {
    // Validate name
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a name for your availability');
      return;
    }

    const enabledDays: number[] = [];
    Object.keys(availability).forEach(idxString => {
      const idx = Number(idxString);
      if (availability[idx].enabled) {
        enabledDays.push(idx);
      }
    });

    if (enabledDays.length === 0) {
      Alert.alert('No days selected', 'Please enable at least one day');
      return;
    }

    for (const idx of enabledDays) {
      const av = availability[idx];
      const s = new Date(av.start);
      const e = new Date(av.end);
      if (s.getTime() === e.getTime() || s.getTime() > e.getTime()) {
        Alert.alert('Invalid time', `${WEEK_DAYS[idx]}: start time must be before end time`);
        return;
      }
    }

    try {
      const firstEnabledDay = enabledDays[0];
      const { start, end } = availability[firstEnabledDay];

      const success = await createAvailabity({
        name: name.trim(),
        days: enabledDays,
        startTime: new Date(start),
        endTime: new Date(end),
        userId: ''
      });

      if (success) {
        Alert.alert('Saved', 'Availability saved successfully!');
        setName(''); // Reset form
        setAvailability(defaultAvailability);
      }
    } catch (e) {
      console.warn('Failed to save availability', e);
      Alert.alert('Error', 'Failed to save availability');
    }
  };

  const toggleDay = (dayIndex: number) => {
    setAvailability(prev => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        enabled: !prev[dayIndex].enabled,
      },
    }));
  };

  const openTimePicker = (dayIndex: number, mode: 'start' | 'end') => {
    setPickerState({ visible: true, dayIndex, mode });
  };

  const onTimeChange = (event: DateTimePickerEvent, selected?: Date | undefined) => {
    setPickerState(prev => ({ ...prev, visible: false }));

    if (!selected || pickerState.dayIndex === null) return;

    const dayIndex = pickerState.dayIndex;
    const iso = selected.toISOString();

    setAvailability(prev => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        [pickerState.mode]: iso,
      },
    }));
  };

  const formatTimeIso = (iso: string) => {
    try {
      return format(new Date(iso), 'h:mma').toLowerCase();
    } catch {
      return '--:--';
    }
  };

  return (
    <View className="flex-1 bg-[#1C1C1E]">
      <AppHeader title="Create Availability"  userName={user?.name} userInitial={user?.name.charAt(0)} />

      <ScrollView 
        className="flex-1 px-4"
        style={{ paddingBottom: contentPaddingBottom }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-[#2C2C2E] rounded-xl p-4 mt-4 shadow-lg shadow-black/30">
          <ThemedText className="font-bold mb-3 text-white">Availability Name</ThemedText>
          <TextInput
            className="bg-[#1F1F20] border border-[#3A3A3C] rounded-lg p-3 text-white text-base"
            value={name}
            onChangeText={setName}
            placeholder="Enter availability name (e.g., Work Hours, Weekend Availability)"
            placeholderTextColor="#8E8E93"
            maxLength={100}
          />
        </View>

        <View className="bg-[#2C2C2E] rounded-xl p-4 mt-4 shadow-lg shadow-black/30">
          <ThemedText className="font-bold mb-3 text-white">Weekly Availability</ThemedText>

          {WEEK_DAYS.map((day, idx) => {
            const av = availability[idx];
            if (!av) return null;
            
            return (
              <View key={day} className="flex-row items-center mb-3">
                <TouchableOpacity 
                  onPress={() => toggleDay(idx)} 
                  className={`w-12 h-7 rounded-full p-1 mr-3 ${
                    av.enabled ? 'bg-white' : 'bg-[#3A3A3C]'
                  }`}
                >
                  <View className={`w-5 h-5 rounded-full ${
                    av.enabled ? 'bg-black self-end' : 'bg-[#111] self-start'
                  }`} />
                </TouchableOpacity>

                <ThemedText className="flex-1 text-white text-base">{day}</ThemedText>

                <TouchableOpacity 
                  onPress={() => openTimePicker(idx, 'start')} 
                  className={`border border-[#3A3A3C] px-3 py-2 rounded-lg min-w-20 items-center justify-center bg-[#1F1F20] ${
                    !av.enabled && 'opacity-50'
                  }`}
                  disabled={!av.enabled}
                >
                  <ThemedText className={`text-sm ${
                    !av.enabled ? 'text-[#8E8E93]' : 'text-white'
                  }`}>
                    {formatTimeIso(av.start)}
                  </ThemedText>
                </TouchableOpacity>

                <ThemedText className="mx-2 text-[#BFBFC3]">-</ThemedText>

                <TouchableOpacity 
                  onPress={() => openTimePicker(idx, 'end')} 
                  className={`border border-[#3A3A3C] px-3 py-2 rounded-lg min-w-20 items-center justify-center bg-[#1F1F20] ${
                    !av.enabled && 'opacity-50'
                  }`}
                  disabled={!av.enabled}
                >
                  <ThemedText className={`text-sm ${
                    !av.enabled ? 'text-[#8E8E93]' : 'text-white'
                  }`}>
                    {formatTimeIso(av.end)}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            );
          })}

          <View className="flex-row justify-end mt-2">
            <TouchableOpacity onPress={saveAvailability} className="bg-white px-4 py-2.5 rounded-lg">
              <ThemedText className="text-black font-semibold">Save</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {pickerState.visible && pickerState.dayIndex !== null && (
          <DateTimePicker
            value={new Date(availability[pickerState.dayIndex][pickerState.mode])}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={onTimeChange}
          />
        )}
      </ScrollView>
    </View>
  );
}
