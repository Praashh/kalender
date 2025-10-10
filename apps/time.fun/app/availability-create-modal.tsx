import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import AppHeader from '@/components/AppHeader';
import { ThemedText } from '@/components/ThemedText';
import { useTabBarHeight } from '@/hooks/useTabBarHeight';
import { useAvailability } from '@/hooks/useAvailability';

const { width } = Dimensions.get('window');

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

    // Get enabled days
    const enabledDays: number[] = [];
    Object.keys(availability).forEach(idxString => {
      const idx = Number(idxString);
      if (availability[idx].enabled) {
        enabledDays.push(idx);
      }
    });

    // Validate at least one day is enabled
    if (enabledDays.length === 0) {
      Alert.alert('No days selected', 'Please enable at least one day');
      return;
    }

    // Validate start < end for all enabled days
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
      // Use the first enabled day's time (since backend expects same time for all days)
      // In a more advanced version, you might want to create multiple availability records
      const firstEnabledDay = enabledDays[0];
      const { start, end } = availability[firstEnabledDay];

      const success = await createAvailabity({
        name: name.trim(),
        days: enabledDays,
        startTime: new Date(start),
        endTime: new Date(end),
        userId: '' // This will be filled by the hook from auth context
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

  // --- Availability editing helpers
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
    <View style={styles.container}>
      <AppHeader title="Create Availability" />

      <ScrollView style={[styles.content, { paddingBottom: contentPaddingBottom }]} showsVerticalScrollIndicator={false}>
        {/* Name Input */}
        <View style={[styles.calendarContainer, { marginTop: 16 }]}>
          <ThemedText style={{ fontWeight: '700', marginBottom: 12 }}>Availability Name</ThemedText>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Enter availability name (e.g., Work Hours, Weekend Availability)"
            placeholderTextColor="#8E8E93"
            maxLength={100}
          />
        </View>

        {/* Weekly Availability Editor */}
        <View style={[styles.calendarContainer, { marginTop: 16 }]}>
          <ThemedText style={{ fontWeight: '700', marginBottom: 12 }}>Weekly Availability</ThemedText>

          {WEEK_DAYS.map((day, idx) => {
            const av = availability[idx];
            if (!av) return null;
            
            return (
              <View key={day} style={styles.weekRow}>
                {/* Toggle */}
                <TouchableOpacity onPress={() => toggleDay(idx)} style={[
                  styles.toggleTrack,
                  av.enabled ? styles.toggleOn : styles.toggleOff
                ]}>
                  <View style={[
                    styles.toggleThumb,
                    av.enabled ? styles.toggleThumbOn : styles.toggleThumbOff
                  ]} />
                </TouchableOpacity>

                <ThemedText style={styles.weekLabel}>{day}</ThemedText>

                {/* Start time */}
                <TouchableOpacity 
                  onPress={() => openTimePicker(idx, 'start')} 
                  style={[
                    styles.timeBox,
                    !av.enabled && styles.timeBoxDisabled
                  ]}
                  disabled={!av.enabled}
                >
                  <ThemedText style={[
                    styles.timeText,
                    !av.enabled && styles.timeTextDisabled
                  ]}>
                    {formatTimeIso(av.start)}
                  </ThemedText>
                </TouchableOpacity>

                <ThemedText style={{ marginHorizontal: 8, color: '#BFBFC3' }}>-</ThemedText>

                {/* End time */}
                <TouchableOpacity 
                  onPress={() => openTimePicker(idx, 'end')} 
                  style={[
                    styles.timeBox,
                    !av.enabled && styles.timeBoxDisabled
                  ]}
                  disabled={!av.enabled}
                >
                  <ThemedText style={[
                    styles.timeText,
                    !av.enabled && styles.timeTextDisabled
                  ]}>
                    {formatTimeIso(av.end)}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            );
          })}

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
            <TouchableOpacity onPress={saveAvailability} style={styles.saveButton}>
              <ThemedText style={{ color: 'black', fontWeight: '600' }}>Save</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* DateTimePicker */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  branding: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  monthYear: {
    fontSize: 16,
    color: '#8E8E93',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  monthButton: {
    backgroundColor: '#3A3A3C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  monthButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  calendarContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  nameInput: {
    backgroundColor: '#1F1F20',
    borderWidth: 1,
    borderColor: '#3A3A3C',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (width - 72) / 7,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 8,
  },
  inactiveDayCell: {
    opacity: 0.5,
  },
  todayCell: {
    backgroundColor: '#3A3A3C',
  },
  selectedCell: {
    backgroundColor: '#3A3A3C',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  inactiveDayText: {
    color: '#8E8E93',
  },
  todayText: {
    color: 'white',
    fontWeight: '600',
  },
  selectedText: {
    color: 'white',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginTop: 2,
  },
  availDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399', // green
    marginTop: 6,
  },

  // availability editor styles
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 20,
    padding: 3,
    marginRight: 12,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: '#fff',
  },
  toggleOff: {
    backgroundColor: '#3A3A3C',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  toggleThumbOn: {
    backgroundColor: '#000',
    alignSelf: 'flex-end',
  },
  toggleThumbOff: {
    backgroundColor: '#111',
    alignSelf: 'flex-start',
  },
  weekLabel: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  timeBox: {
    borderWidth: 1,
    borderColor: '#3A3A3C',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F1F20',
  },
  timeBoxDisabled: {
    opacity: 0.5,
  },
  timeText: {
    color: 'white',
    fontSize: 14,
  },
  timeTextDisabled: {
    color: '#8E8E93',
  },
  saveButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },

  // Existing availabilities styles
  availabilityItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  availabilityDays: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  eventTypeText: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
  },
  availabilityTime: {
    marginBottom: 8,
  },
  availabilityMeta: {
    marginTop: 4,
  },
  metaText: {
    color: '#BFBFC3',
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#4A4A4C',
    marginTop: 12,
  },
});