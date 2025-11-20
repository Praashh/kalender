import { useAuth } from "@/contexts/AuthContext";
import { getBaseUrl } from "@/utils/base-url";
import { TOKEN_KEY } from "@/utils/tokenStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Toast } from "toastify-react-native";

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

interface CreateBookingData {
  eventTypeId: string;
  guestEmail: string;
  startTime: Date;
  endTime: Date;
}

interface UpdateBookingData {
  startTime: Date;
  endTime: Date;
}

interface UserBookingReturn {
  bookings: IBooking[];
  loading: boolean;
  error: string | null;
  createBooking: (data: CreateBookingData) => Promise<boolean>;
  updateBooking: (id: string, data: UpdateBookingData) => Promise<boolean>;
  refreshBookings: () => Promise<void>;
  clearError: () => void;
}

const useMeeting = (): UserBookingReturn => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getAuthHeaders = useCallback(async () => {
    const accessToken = await AsyncStorage.getItem(TOKEN_KEY);
    return {
      Authorization: accessToken,
      userId: user!.id,
    };
  }, [user]);

  const handleApiError = useCallback((operation: string, error: any) => {
    console.error(`Error ${operation}:`, error);
    const errorMessage =
      error.response?.data?.message || `Failed to ${operation}`;
    setError(errorMessage);
    Toast.error(`Error: ${errorMessage}`);
    return false;
  }, []);

  const fetchBookings = useCallback(async (): Promise<void> => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const baseUrl = getBaseUrl();
      const headers = await getAuthHeaders();
      const response = await axios.get(
        `${baseUrl}/api/booking/getAll/${user.id}`,
        { headers }
      );

      if (response.data && response.data.bookings) {
        setBookings(response.data.bookings);
      } else {
        setBookings([]);
      }
    } catch (error) {
      handleApiError("fetch bookings", error);
    } finally {
      setLoading(false);
    }
  }, [user, getAuthHeaders, handleApiError]);

  const refreshBookings = useCallback(async (): Promise<void> => {
    await fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    if (user?.id) {
      fetchBookings();
    }
  }, [user?.id, fetchBookings]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const createBooking = useCallback(
    async (data: CreateBookingData): Promise<boolean> => {
      if (!user?.id) return false;
      try {
        setLoading(true);
        setError(null);
        const baseUrl = getBaseUrl();
        const headers = await getAuthHeaders();
        const response = await axios.post(
          `${baseUrl}/api/booking/create`,
          { ...data, hostId: user.id },
          { headers }
        );

        if (response.data && response.data.booking) {
          setBookings((prev) => [...prev, response.data.booking]);
          Toast.success("Booking created successfully!");
          return true;
        }
        return false;
      } catch (error) {
        return handleApiError("create booking", error);
      } finally {
        setLoading(false);
      }
    },
    [user, getAuthHeaders, handleApiError]
  );

  const updateBooking = useCallback(
    async (id: string, data: UpdateBookingData): Promise<boolean> => {
      if (!user?.id) return false;
      try {
        setError(null);
        const baseUrl = getBaseUrl();
        const headers = await getAuthHeaders();

        // Optimistic UI update
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, ...data } : b))
        );

        const response = await axios.put(
          `${baseUrl}/api/booking/update/${id}`,
          data,
          { headers }
        );

        if (response.data && response.data.booking) {
          setBookings((prev) =>
            prev.map((b) => (b.id === id ? response.data.booking : b))
          );
          Toast.success("Booking updated successfully!");
          return true;
        }
        return false;
      } catch (error) {
        await fetchBookings(); // Rollback on error
        return handleApiError("update booking", error);
      }
    },
    [user, getAuthHeaders, handleApiError, fetchBookings]
  );

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBooking,
    refreshBookings,
    clearError,
  };
};

export default useMeeting;
