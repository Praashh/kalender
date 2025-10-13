import { useAuth } from "@/contexts/AuthContext";
import { getBaseUrl } from "@/utils/base-url";
import { TOKEN_KEY } from "@/utils/tokenStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { DeviceEventEmitter } from "react-native";
import { Toast } from "toastify-react-native";

interface IEvent {
  id: string;
  title: string;
  duration: number;
  price: number;
  slug: string;
}

interface CreateEventData {
  title: string;
  duration: number;
  price?: number;
  slug: string;
}

interface UpdateEventData {
  title?: string;
  duration?: number;
  price?: number;
  slug: string;
}

interface UseEventsReturn {
  events: ArrayLike<IEvent>;
  loading: boolean;
  error: string | null;
  createEvent: (data: CreateEventData) => Promise<boolean>;
  updateEvent: (id: string, data: UpdateEventData) => Promise<boolean>;
  deleteEvent: (id: string) => Promise<boolean>;
  refreshEvents: () => Promise<void>;
  clearError: () => void;
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();

  const getAuthHeaders = useCallback(async () => {
    const accessToken = await AsyncStorage.getItem(TOKEN_KEY);
    return {
      Authorization: accessToken,
    };
  }, []);

  const handleApiError = useCallback((operation: string, error: any) => {
    console.error(`Error ${operation}:`, error);
    const errorMessage = error.response?.data?.message || `Failed to ${operation}`;
    setError(errorMessage);
    Toast.error(`Error: ${errorMessage}`);
    return false;
  }, []);

  const fetchEvents = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const baseUrl = getBaseUrl();
      const headers = await getAuthHeaders();

      const response = await axios.get(`${baseUrl}/api/event/getAll/${user.id}`, { headers });

      console.log("response.data", response.data);

      if (response.data && response.data.eventTypes) {
        setEvents(response.data.eventTypes);
      } else {
        setEvents([]);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await logout();
        setEvents([]);
        return;
      }
      handleApiError("fetch events", error);
    } finally {
      setLoading(false);
    }
  }, [user, getAuthHeaders, handleApiError, logout]);

  const createEvent = useCallback(async (data: CreateEventData): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      setLoading(true);
      setError(null);
      const baseUrl = getBaseUrl();
      const headers = await getAuthHeaders();

      const response = await axios.post(`${baseUrl}/api/event/create`, { ...data, userId: user.id }, { headers });

      if (response.data) {
        setEvents(prev => [...prev, response.data.event]);
        Toast.success("Event created successfully!");
        return true;
      }
      return false;
    } catch (error) {
      return handleApiError("create event", error);
    } finally {
      setLoading(false);
    }
  }, [user, getAuthHeaders, handleApiError]);

  const updateEvent = useCallback(
    async (id: string, data: UpdateEventData): Promise<boolean> => {
      if (!user?.id) return false;

      try {
        setError(null);
        const baseUrl = getBaseUrl();
        const headers = await getAuthHeaders();

        // optimistic update
        setEvents(prev => prev.map(event => (event.id === id ? { ...event, ...data } : event)));
        DeviceEventEmitter.emit("events:update-optimistic", { id, data });

        const response = await axios.put(`${baseUrl}/api/event/update/${id}`, data, { headers });

        if (response.data) {
          setEvents(prev => prev.map(event => (event.id === id ? response.data.event : event)));
          Toast.success("Event updated successfully!");
          return true;
        }
        return false;
      } catch (error) {
        await fetchEvents();
        return handleApiError("update event", error);
      }
    },
    [user, getAuthHeaders, handleApiError, fetchEvents]
  );

  const deleteEvent = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user?.id) return false;

      try {
        setError(null);
        const baseUrl = getBaseUrl();
        const headers = await getAuthHeaders();

        // optimistic update
        setEvents(prev => prev.filter(e => e.id !== id));

        const response = await axios.delete(`${baseUrl}/api/event/delete/${id}`, { headers });

        if (response.data) {
          Toast.success("Event deleted successfully!");
          return true;
        }
        return false;
      } catch (error) {
        await fetchEvents();
        return handleApiError("delete event", error);
      }
    },
    [user, getAuthHeaders, handleApiError, fetchEvents]
  );

  const refreshEvents = useCallback(async (): Promise<void> => {
    await fetchEvents();
  }, [fetchEvents]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchEvents();
    }
  }, [user?.id, fetchEvents]);

  // listen for optimistic updates from other screens
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("events:update-optimistic", ({ id, data }: { id: string; data: UpdateEventData }) => {
      setEvents(prev => prev.map(ev => (ev.id === id ? { ...ev, ...data } : ev)));
    });
    return () => sub.remove();
  }, []);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents,
    clearError,
  };
}
