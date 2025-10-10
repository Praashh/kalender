import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View, FlatList, Alert, Modal, Dimensions, TouchableWithoutFeedback } from 'react-native';

import AppHeader from '@/components/AppHeader';
import { ThemedText } from '@/components/ThemedText';
import { useTabBarHeight } from '@/hooks/useTabBarHeight';
import { useEvents } from '@/hooks/useEvents';
import { Toast } from 'toastify-react-native';
import * as Clipboard from 'expo-clipboard';
import { getBaseUrl } from '@/utils/base-url';
 


interface MeetingForm {
  title: string;
  duration: number;
}

interface FormErrors {
  title?: string;
  date?: string;
  time?: string;
  attendees?: string;
}

interface IEvent {
  id: string;
  title: string;
  duration: number;
  price: number;
}

export default function CreateMeetingScreen() {
  const { contentPaddingBottom } = useTabBarHeight();
  
  const [form, setForm] = useState<MeetingForm>({
    title: '',
    duration: 15,
  });

  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const createDurationAnchorRef = useRef<View>(null);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [createDropdownPos, setCreateDropdownPos] = useState<{ x: number; y: number; width: number; flip?: boolean } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const {
    events,
    loading,
    createEvent,
    deleteEvent,
    refreshEvents,
    updateEvent,
} = useEvents();
  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDuration, setEditDuration] = useState<number>(15);
  const [editDropdownOpen, setEditDropdownOpen] = useState(false);
  const durationAnchorRef = useRef<View>(null);
  const [dropdownPos, setDropdownPos] = useState<{ x: number; y: number; width: number; flip?: boolean } | null>(null);

  const openEdit = (item: IEvent) => {
    setEditingEvent(item);
    setEditTitle(item.title);
    setEditDuration(item.duration);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditDropdownOpen(false);
    setEditingEvent(null);
    setDropdownPos(null);
  };

  const submitEdit = async () => {
    if (!editingEvent) return;
    if (!editTitle || !editDuration) {
      Toast.error('Please fill all fields');
      return;
    }
    const ok = await updateEvent(editingEvent.id, {
      title: editTitle,
      duration: editDuration,
      price: editingEvent.price ?? 0,
    });
    if (ok) {
      refreshEvents();
      Toast.success('Event Updated Successfully');
      closeEdit();
    } else {
      Toast.error('Error While Updating event');
    }
  };

  const durationOptions = [15, 30, 45, 60];

  

  const confirmDeleteEvent = (item: IEvent) => {
    Alert.alert(
      `Delete "${item.title}"`,
      'This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
            const ok = await deleteEvent(item.id);
            if (ok) {
              refreshEvents();
            }
        } }
      ]
    );
  };

  const handleEventShare = async (item: IEvent) => {
    const baseUrl = getBaseUrl();
    const shareURl = baseUrl + '/event/share/' + item.id + '?duration=' + item.duration;
    await Clipboard.setStringAsync(shareURl);
  }

  const handleCreateMeeting = async () => {
    if(!form.title || !form.duration){
      Toast.error("Invalid inputs")
      return;
    }
        
    const success = await createEvent({
        title: form.title,
        duration: form.duration
    });
    
    if (success) {
      refreshEvents();
        setForm({ title: '', duration: 15 });
    }
  };

  const renderEventItem = ({ item }: { item: IEvent }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventInfo}>
        <ThemedText style={styles.eventTitle}>{item?.title}</ThemedText>
        <ThemedText style={styles.eventDuration}>{item?.duration} minutes</ThemedText>
      </View>
      <View style={styles.eventActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => openEdit(item)}>
          <Ionicons name="pencil-sharp" size={20} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={ ()=> handleEventShare(item)}>
          <Ionicons name="share-outline" size={20} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => confirmDeleteEvent(item)}>
          <Ionicons name="trash-outline" size={20} color="#FF453A" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="EventType" />

      <ScrollView style={[styles.content, { paddingBottom: contentPaddingBottom  ?? 0 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <ThemedText style={styles.title}>Create Meeting</ThemedText>
          <ThemedText style={styles.subtitle}>Schedule a meeting and send invitations to attendees.</ThemedText>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Meeting Title</ThemedText>
            <TextInput
              style={[styles.textInput, errors.title && styles.errorInput]}
              value={form.title}
              onChangeText={(text) => {
                setForm({ ...form, title: text });
                if (errors.title) {
                  setErrors({ ...errors, title: undefined });
                }
              }}
              placeholder="Enter meeting title"
              placeholderTextColor="#8E8E93"
            />
            {errors.title && <ThemedText style={styles.errorText}>{errors.title}</ThemedText>}
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Duration</ThemedText>
            <View ref={createDurationAnchorRef}>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => {
                  if (!createDropdownOpen) {
                    createDurationAnchorRef.current?.measureInWindow((x, y, width, height) => {
                      const screenHeight = Dimensions.get('window').height;
                      const desiredY = y + height;
                      const listHeight = 200;
                      const flip = desiredY + listHeight > screenHeight - 24;
                      setCreateDropdownPos({ x, y: flip ? y - listHeight : desiredY, width, flip });
                      setCreateDropdownOpen(true);
                    });
                  } else {
                    setCreateDropdownOpen(false);
                    setCreateDropdownPos(null);
                  }
                }}
              >
                <ThemedText style={styles.dropdownText}>{form.duration} minutes</ThemedText>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateMeeting}>
          <ThemedText style={styles.createButtonText}>Create EventType</ThemedText>
        </TouchableOpacity>

        {/* Events List Section */}
        <View style={styles.eventsSection}>
          <View style={styles.eventsHeader}>
            <ThemedText style={styles.eventsTitle}>Your EventTypes</ThemedText>
            <TouchableOpacity onPress={refreshEvents} style={styles.refreshButton}>
              <Ionicons name="refresh" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <ThemedText style={styles.loadingText}>Loading events...</ThemedText>
          ) : events.length > 0 ? (
            <FlatList
              data={events}
              renderItem={renderEventItem}
              keyExtractor={(item) => item?.id}
              scrollEnabled={false}
              style={styles.eventsList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#8E8E93" />
              <ThemedText style={styles.emptyStateText}>No events created yet</ThemedText>
              <ThemedText style={styles.emptyStateSubtext}>
                Create your first event type above to get started
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>
      {/* Floating dropdown for create form */}
      {createDropdownOpen && createDropdownPos && (
        <TouchableWithoutFeedback onPress={() => { setCreateDropdownOpen(false); setCreateDropdownPos(null); }}>
          <View style={styles.portalOverlay} pointerEvents="box-none">
            <View style={[styles.dropdownPortal, { top: createDropdownPos.y, left: createDropdownPos.x, width: createDropdownPos.width }]}>
              <View style={styles.dropdownListPortal}>
                {durationOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setForm({ ...form, duration: opt });
                      setCreateDropdownOpen(false);
                      setCreateDropdownPos(null);
                    }}
                  >
                    <ThemedText style={styles.dropdownItemText}>{opt} minutes</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      {/* Edit Modal */}
      <Modal visible={isEditOpen} transparent animationType="fade" onRequestClose={closeEdit}>
        <View style={styles.modalOverlay}>
          {/* Floating dropdown portal */}
          {editDropdownOpen && dropdownPos && (
            <View style={[styles.dropdownPortal, { top: dropdownPos.y, left: dropdownPos.x, width: dropdownPos.width }]}>
              <View style={styles.dropdownListPortal}>
                {[15,30,45,60].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setEditDuration(opt);
                      setEditDropdownOpen(false);
                      setDropdownPos(null);
                    }}
                  >
                    <ThemedText style={styles.dropdownItemText}>{opt} minutes</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeEdit} style={styles.cancelButton}>
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.modalTitle}>Edit Event</ThemedText>
              <TouchableOpacity onPress={submitEdit} style={styles.updateButton}>
                <ThemedText style={styles.updateButtonText}>Update</ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Meeting Title</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="Enter meeting title"
                  placeholderTextColor="#8E8E93"
                />
              </View>

              <View style={[styles.inputGroup, editDropdownOpen && styles.dropdownOpen]}>
                <ThemedText style={styles.label}>Duration</ThemedText>
                <View ref={durationAnchorRef}>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => {
                    if (!editDropdownOpen) {
                      // measure and open
                      durationAnchorRef.current?.measureInWindow((x, y, width, height) => {
                        const screenHeight = Dimensions.get('window').height;
                        const desiredY = y + height;
                        const listHeight = 200; // approximate
                        const flip = desiredY + listHeight > screenHeight - 24;
                        setDropdownPos({ x, y: flip ? y - listHeight : desiredY, width, flip });
                        setEditDropdownOpen(true);
                      });
                    } else {
                      setEditDropdownOpen(false);
                      setDropdownPos(null);
                    }
                  }}
                >
                  <ThemedText style={styles.dropdownText}>{editDuration} minutes</ThemedText>
                  <Ionicons name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 30,
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
  formContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
    position: 'relative',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'white',
    backgroundColor: '#1C1C1E',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderWidth: 1,
    borderColor: '#3A3A3C',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1C1C1E',
  },
  dropdownText: {
    fontSize: 16,
    color: 'white',
  },
  createButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  dropdownList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#3A3A3C',
    borderRadius: 12,
    zIndex: 9999,
    elevation: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  dropdownItemText: {
    fontSize: 16,
    color: 'white',
  },
  errorInput: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  // Events List Styles
  eventsSection: {
    marginBottom: 30,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  refreshButton: {
    padding: 8,
  },
  eventsList: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  eventDuration: {
    fontSize: 14,
    color: '#8E8E93',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    color: '#8E8E93',
    padding: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    overflow: 'visible',
  },
  dropdownOpen: {
    zIndex: 3000,
  },
  dropdownPortal: {
    position: 'absolute',
    zIndex: 100000,
    elevation: 100,
  },
  dropdownListPortal: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#3A3A3C',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: '#0A84FF',
    fontSize: 16,
  },
  updateButton: {
    padding: 8,
  },
  updateButtonText: {
    color: '#0A84FF',
    fontSize: 16,
    fontWeight: '600',
  },
  portalOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
});