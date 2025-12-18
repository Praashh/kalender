import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

import AppHeader from "@/components/AppHeader";
import { ThemedText } from "@/components/ThemedText";
import { useTabBarHeight } from "@/hooks/useTabBarHeight";
import { useEvents } from "@/hooks/useEvents";
import { Toast } from "toastify-react-native";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

interface MeetingForm {
  title: string;
  slug: string;
  duration: number;
}

interface FormErrors {
  title?: string;
  slug?: string;
  date?: string;
  time?: string;
  attendees?: string;
}

interface IEvent {
  id: string;
  title: string;
  slug: string;
  duration: number;
  price: number;
}

export default function CreateMeetingScreen() {
  const { contentPaddingBottom } = useTabBarHeight();
  const router = useRouter();
  const [form, setForm] = useState<MeetingForm>({
    title: "",
    slug: "",
    duration: 15,
  });

  const createDurationAnchorRef = useRef<View>(null);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [createDropdownPos, setCreateDropdownPos] = useState<{
    x: number;
    y: number;
    width: number;
    flip?: boolean;
  } | null>(null);
  const { user } = useAuth();
  const [errors, setErrors] = useState<FormErrors>({});
  const {
    events,
    loading,
    createEvent,
    deleteEvent,
    refreshEvents,
    updateEvent,
  } = useEvents();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editDuration, setEditDuration] = useState<number>(15);
  const [editDropdownOpen, setEditDropdownOpen] = useState(false);
  const durationAnchorRef = useRef<View>(null);
  const [dropdownPos, setDropdownPos] = useState<{
    x: number;
    y: number;
    width: number;
    flip?: boolean;
  } | null>(null);

  const openEdit = (item: IEvent) => {
    setEditingEvent(item);
    setEditTitle(item.title);
    setEditSlug(item.slug);
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
    if (!editTitle || !editSlug || !editDuration) {
    Toast.show({
      type: 'error',
      text1: 'Please fill all fields',
      position: 'top',
      theme: 'dark',          
      backgroundColor: '#1e1e1e', 
      textColor: '#fff',          
    });
      return;
    }
    const ok = await updateEvent(editingEvent.id, {
      title: editTitle,
      slug: editSlug,
      duration: editDuration,
      price: editingEvent.price ?? 0,
    });
    if (ok) {
      refreshEvents();
      Toast.success("Event Updated Successfully");
      closeEdit();
    } else {
      Toast.error("Error While Updating event");
    }
  };

  const durationOptions = [15, 30, 45, 60];

  const confirmDeleteEvent = (item: IEvent) => {
    Alert.alert(`Delete "${item.title}"`, "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const ok = await deleteEvent(item.id);
          if (ok) {
            refreshEvents();
          }
        },
      },
    ]);
  };

  const handleEventShare = async (item: IEvent) => {
    console.log("user?.username", user)
    if (user?.username) {
      console.log(`/${user.username}/${item.slug}`);
      router.push(`/${user.username}/${item.slug}`);
    } else {
      Alert.alert('Error', 'User not found');
    }
  };

  const handleCreateMeeting = async () => {
    if (!form.title || !form.slug || !form.duration) {
      Toast.show({
        type: 'error',
        text1: 'Please fill all fields',
        position: 'top',
        theme: 'dark',          
        backgroundColor: '#1e1e1e', 
        textColor: '#fff',          
      });
      return;
    }

    // Validate slug format (alphanumeric and hyphens only)
    const slugRegex = /^[a-zA-Z0-9-]+$/;
    if (!slugRegex.test(form.slug)) {
      Toast.error("Slug can only contain letters, numbers, and hyphens");
      return;
    }

    const success = await createEvent({
      title: form.title,
      slug: form.slug,
      duration: form.duration,
    });

    if (success) {
      refreshEvents();
      setForm({ title: "", slug: "", duration: 15 });
      Toast.show({
        type: 'success',
        text1: 'Event created successfully',
        position: 'top',
        theme: 'dark',          
        backgroundColor: 'green', 
        textColor: '#fff',          
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error creating an event',
        position: 'top',
        theme: 'dark',          
        backgroundColor: '#1e1e1e', 
        textColor: '#fff',          
      });
    }
  };

  // Function to generate slug from title
  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const renderEventItem = ({ item }: { item: IEvent }) => (
    <View className="flex-row justify-between items-center p-4 border-b border-[#3A3A3C]">
      <View className="flex-1">
        <ThemedText className="text-white text-base font-semibold mb-1">
          {item?.title}
        </ThemedText>
        <ThemedText className="text-[#8E8E93] text-sm">
          {item?.duration} minutes • {item?.slug}
        </ThemedText>
      </View>
      <View className="flex-row gap-3">
        <TouchableOpacity className="p-2" onPress={() => openEdit(item)}>
          <Ionicons name="pencil-sharp" size={20} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity
          className="p-2"
          onPress={() => handleEventShare(item)}
        >
          <Ionicons name="share-outline" size={20} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity
          className="p-2"
          onPress={() => confirmDeleteEvent(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#FF453A" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#1C1C1E]">
      <AppHeader title="EventType"  userName={user?.name} userInitial={user?.name.charAt(0)}/>

      <ScrollView
        className="flex-1 px-4"
        style={{ paddingBottom: contentPaddingBottom ?? 0 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-5 pb-8">
          <ThemedText className="text-white text-2xl font-bold mb-2">
            Create a new event
          </ThemedText>
        </View>

        <View className="bg-[#2C2C2E] rounded-xl p-5 mb-8 shadow-lg shadow-black/30">
          <View className="mb-5">
            <ThemedText className="text-white text-base font-semibold mb-2">
              EventType Title
            </ThemedText>
            <TextInput
              className={`h-12 border rounded-xl px-4 text-base text-white bg-[#1C1C1E] ${
                errors.title ? "border-[#FF3B30]" : "border-[#3A3A3C]"
              }`}
              value={form.title}
              onChangeText={(text) => {
                setForm({ ...form, title: text });
                if (errors.title) {
                  setErrors({ ...errors, title: undefined });
                }
                // Auto-generate slug if slug is empty or matches the previously generated one
                if (!form.slug || form.slug === generateSlugFromTitle(form.title)) {
                  setForm(prev => ({ 
                    ...prev, 
                    title: text,
                    slug: generateSlugFromTitle(text)
                  }));
                } else {
                  setForm(prev => ({ ...prev, title: text }));
                }
              }}
              placeholder="Enter meeting title"
              placeholderTextColor="#8E8E93"
            />
            {errors.title && (
              <ThemedText className="text-[#FF3B30] text-sm mt-1">
                {errors.title}
              </ThemedText>
            )}
          </View>

          <View className="mb-5">
            <ThemedText className="text-white text-base font-semibold mb-2">
              Slug
            </ThemedText>
            <TextInput
              className={`h-12 border rounded-xl px-4 text-base text-white bg-[#1C1C1E] ${
                errors.slug ? "border-[#FF3B30]" : "border-[#3A3A3C]"
              }`}
              value={form.slug}
              onChangeText={(text) => {
                setForm({ ...form, slug: text });
                if (errors.slug) {
                  setErrors({ ...errors, slug: undefined });
                }
              }}
              placeholder="Enter URL slug"
              placeholderTextColor="#8E8E93"
            />
            {errors.slug && (
              <ThemedText className="text-[#FF3B30] text-sm mt-1">
                {errors.slug}
              </ThemedText>
            )}
          </View>

          <View className="mb-5">
            <ThemedText className="text-white text-base font-semibold mb-2">
              Duration
            </ThemedText>
            <View ref={createDurationAnchorRef}>
              <TouchableOpacity
                className="flex-row items-center justify-between h-12 border border-[#3A3A3C] rounded-xl px-4 bg-[#1C1C1E]"
                onPress={() => {
                  if (!createDropdownOpen) {
                    createDurationAnchorRef.current?.measureInWindow(
                      (x, y, width, height) => {
                        const screenHeight = Dimensions.get("window").height;
                        const desiredY = y + height;
                        const listHeight = 200;
                        const flip = desiredY + listHeight > screenHeight - 24;
                        setCreateDropdownPos({
                          x,
                          y: flip ? y - listHeight : desiredY,
                          width,
                          flip,
                        });
                        setCreateDropdownOpen(true);
                      }
                    );
                  } else {
                    setCreateDropdownOpen(false);
                    setCreateDropdownPos(null);
                  }
                }}
              >
                <ThemedText className="text-white text-base">
                  {form.duration} minutes
                </ThemedText>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-white py-4 rounded-xl items-center mb-8"
          onPress={handleCreateMeeting}
        >
          <ThemedText className="text-black text-base font-semibold" style={{color: 'black'}}>
            Create EventType
          </ThemedText>
        </TouchableOpacity>

        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <ThemedText className="text-white text-xl font-bold">
              Your EventTypes
            </ThemedText>
            <TouchableOpacity onPress={refreshEvents} className="p-2">
              <Ionicons name="refresh" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ThemedText className="text-[#8E8E93] text-center py-5">
              Loading events...
            </ThemedText>
          ) : events.length > 0 ? (
            <FlatList
              data={events}
              renderItem={renderEventItem}
              keyExtractor={(item) => item?.id}
              scrollEnabled={false}
              className="bg-[#2C2C2E] rounded-xl overflow-hidden"
            />
          ) : (
            <View className="items-center py-10 bg-[#2C2C2E] rounded-xl">
              <Ionicons name="calendar-outline" size={48} color="#8E8E93" />
              <ThemedText className="text-white text-base font-semibold mt-4 mb-2">
                No events created yet
              </ThemedText>
              <ThemedText className="text-[#8E8E93] text-sm text-center px-4">
                Create your first event type above to get started
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      {createDropdownOpen && createDropdownPos && (
        <TouchableWithoutFeedback
          onPress={() => {
            setCreateDropdownOpen(false);
            setCreateDropdownPos(null);
          }}
        >
          <View className="absolute inset-0 z-50" pointerEvents="box-none">
            <View
              className="absolute z-50"
              style={{
                top: createDropdownPos.y,
                left: createDropdownPos.x,
                width: createDropdownPos.width,
              }}
            >
              <View className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl shadow-lg shadow-black/40">
                {durationOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    className="px-4 py-3 border-b border-[#3A3A3C] last:border-b-0"
                    onPress={() => {
                      setForm({ ...form, duration: opt });
                      setCreateDropdownOpen(false);
                      setCreateDropdownPos(null);
                    }}
                  >
                    <ThemedText className="text-white text-base">
                      {opt} minutes
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}

      <Modal
        visible={isEditOpen}
        transparent
        animationType="fade"
        onRequestClose={closeEdit}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-4">
          {editDropdownOpen && dropdownPos && (
            <View
              className="absolute z-50"
              style={{
                top: dropdownPos.y,
                left: dropdownPos.x,
                width: dropdownPos.width,
              }}
            >
              <View className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-xl shadow-lg shadow-black/40">
                {[15, 30, 45, 60].map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    className="px-4 py-3 border-b border-[#3A3A3C] last:border-b-0"
                    onPress={() => {
                      setEditDuration(opt);
                      setEditDropdownOpen(false);
                      setDropdownPos(null);
                    }}
                  >
                    <ThemedText className="text-white text-base">
                      {opt} minutes
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          <View className="w-full max-w-[520px] bg-[#1C1C1E] rounded-2xl overflow-visible border border-[#3A3A3C]">
            <View className="flex-row justify-between items-center px-4 py-3 border-b border-[#3A3A3C]">
              <TouchableOpacity onPress={closeEdit} className="p-2">
                <ThemedText className="text-[#0A84FF] text-base">
                  Cancel
                </ThemedText>
              </TouchableOpacity>
              <ThemedText className="text-white text-lg font-bold">
                Edit Event
              </ThemedText>
              <TouchableOpacity onPress={submitEdit} className="p-2">
                <ThemedText className="text-[#0A84FF] text-base font-semibold">
                  Update
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View className="px-4 py-4 overflow-visible">
              <View className="mb-5">
                <ThemedText className="text-white text-base font-semibold mb-2">
                  Meeting Title
                </ThemedText>
                <TextInput
                  className="h-12 border border-[#3A3A3C] rounded-xl px-4 text-base text-white bg-[#1C1C1E]"
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="Enter meeting title"
                  placeholderTextColor="#8E8E93"
                />
              </View>

              <View className="mb-5">
                <ThemedText className="text-white text-base font-semibold mb-2">
                  Slug
                </ThemedText>
                <TextInput
                  className="h-12 border border-[#3A3A3C] rounded-xl px-4 text-base text-white bg-[#1C1C1E]"
                  value={editSlug}
                  onChangeText={setEditSlug}
                  placeholder="Enter URL slug"
                  placeholderTextColor="#8E8E93"
                />
                <ThemedText className="text-[#8E8E93] text-xs mt-1">
                  This will be used in your booking URL: /yourname/{editSlug || 'slug'}
                </ThemedText>
              </View>

              <View className={`mb-5 ${editDropdownOpen ? "z-30" : ""}`}>
                <ThemedText className="text-white text-base font-semibold mb-2">
                  Duration
                </ThemedText>
                <View ref={durationAnchorRef}>
                  <TouchableOpacity
                    className="flex-row items-center justify-between h-12 border border-[#3A3A3C] rounded-xl px-4 bg-[#1C1C1E]"
                    onPress={() => {
                      if (!editDropdownOpen) {
                        durationAnchorRef.current?.measureInWindow(
                          (x, y, width, height) => {
                            const screenHeight =
                              Dimensions.get("window").height;
                            const desiredY = y + height;
                            const listHeight = 200;
                            const flip =
                              desiredY + listHeight > screenHeight - 24;
                            setDropdownPos({
                              x,
                              y: flip ? y - listHeight : desiredY,
                              width,
                              flip,
                            });
                            setEditDropdownOpen(true);
                          }
                        );
                      } else {
                        setEditDropdownOpen(false);
                        setDropdownPos(null);
                      }
                    }}
                  >
                    <ThemedText className="text-white text-base">
                      {editDuration} minutes
                    </ThemedText>
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