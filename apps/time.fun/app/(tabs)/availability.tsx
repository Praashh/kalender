import { format } from 'date-fns';
import React, { useCallback, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';


import AppHeader from '@/components/AppHeader';
import { ThemedText } from '@/components/ThemedText';
import { useTabBarHeight } from '@/hooks/useTabBarHeight';
import { useAvailability } from '@/hooks/useAvailability';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Constants
const WEEK_DAYS = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

// Types
type DayAvailability = {
  enabled: boolean;
  start: string;
  end: string;
};



// Helper functions
const formatAvailabilityTime = (isoString: string): string => {
  try {
    return format(new Date(isoString), 'h:mma').toLowerCase();
  } catch {
    return '--:--';
  }
};



// Sub-components
const NewAvailabilityButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <View style={styles.newButtonContainer}>
    <TouchableOpacity style={styles.newButton} onPress={onPress}>
      <Ionicons name="add-circle-outline" size={24} color="black" />
      <ThemedText style={styles.newButtonText}>New</ThemedText>
    </TouchableOpacity>
  </View>
);

const ExistingAvailabilityItem: React.FC<{
  availability: any; // Replace with proper type from useAvailability hook
  isLast: boolean;
}> = ({ availability, isLast }) => (
  <View style={styles.availabilityItem}>
    <View style={styles.availabilityTime}>
    <ThemedText style={styles.nameText}>
        Name: {availability.name}
      </ThemedText>
      <ThemedText style={styles.timeText}>
        {formatAvailabilityTime(availability.startTime.toString())} -{' '}
        {formatAvailabilityTime(availability.endTime.toString())}
      </ThemedText>
    </View>
    
    <View style={styles.availabilityMeta}>
      <ThemedText style={styles.metaText}>
        Timezone: {availability.timezone}
      </ThemedText>
      {!isLast && <View style={styles.separator} />}
    </View>
  </View>
);

const ExistingAvailabilitiesList: React.FC<{ availabilities: any[] }> = ({ 
  availabilities 
}) => {
  if (availabilities.length === 0) {
    return null;
  }

  return (
    <View style={styles.existingAvailabilitiesContainer}>
      <ThemedText style={styles.sectionTitle}>
        Existing Availabilities
      </ThemedText>
      
      {availabilities.map((availability, index) => (
        <ExistingAvailabilityItem
          key={availability.id}
          availability={availability}
          isLast={index === availabilities.length - 1}
        />
      ))}
    </View>
  );
};

// Main Component
export default function CalendarScreen() {
  // Hooks
  const { contentPaddingBottom } = useTabBarHeight();
  const {  availabilities, refreshAvailabilities } = useAvailability();
  const handleNewAvailability = useCallback(() => {
    router.push('/availability-create-modal')
  }, []);

  useEffect(()=>{
    (async () =>{
      refreshAvailabilities()
    })()
}, [])

  return (
    <View style={styles.container}>
      <AppHeader title="Availability" />

      <ScrollView 
        style={[styles.content, { paddingBottom: contentPaddingBottom }]} 
        showsVerticalScrollIndicator={false}
      >
        <NewAvailabilityButton onPress={handleNewAvailability} />
        
        <ExistingAvailabilitiesList availabilities={availabilities} />
      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  newButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  newButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  newButtonText: {
    color: 'black',
    marginLeft: 4,
  },
  existingAvailabilitiesContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
    fontSize: 16,
  },
  availabilityItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
  },
  availabilityTime: {
    marginBottom: 8,
  },
  nameText:{
color: 'white',
fontSize: 16,
fontWeight: '600'
  },
  timeText: {
    marginTop: 5,
    color: 'white',
    fontSize: 15,
    fontWeight: '300',
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