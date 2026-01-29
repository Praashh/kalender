import { useAuth } from "@/contexts/AuthContext";
import { getBaseUrl } from "@/utils/base-url";
import { TOKEN_KEY } from "@/utils/tokenStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useCallback } from "react";

interface BookingData{
    id: string;
    guestName: string;
    guestEmail: string;
    guestId?: string;
    hostId: string;
    slug: string;
    startTime: Date,
    addtionalNote?: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

interface UseBookingReturn{
    createBooking: (data: Omit<BookingData, 'id' | 'status'>) => Promise<BookingData>;
    getAllBookings: (hostId: string) => Promise<BookingData[]>;
}

const useBooking = ():UseBookingReturn => {
    const { user } = useAuth();

    const getAuthHeaders = useCallback(async () => {
        const accessToken = await AsyncStorage.getItem(TOKEN_KEY);
        return {
            Authorization: accessToken,
            userId: user!.id
        };
    }, [user]);


    const createBooking = async (data: Omit<BookingData, 'id' | 'status'>): Promise<BookingData> => {
        const headers = await getAuthHeaders();
        const baseUrl = getBaseUrl();
        const apiUrl = baseUrl + '/api/booking/create';
        console.log("headers =====>", headers)
        console.log("booking data =====>", data)
        console.log("apiUrl =====>", apiUrl)
        const response = await axios.post(apiUrl,{
            ...data
        }, {headers})

        if (response.status !== 200 && response.status !==201) {
            throw new Error('Failed to create booking');
        }
        console.log("new booking  =====>", response.data)
        return response.data.booking();
    }

    const getAllBookings = async (hostId: string): Promise<BookingData[]> => {  
        const response = await fetch(`/api/booking/getAll/${hostId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch bookings');
        }
        return response.json();
    }
return {
    createBooking,
    getAllBookings
}
}

export default useBooking;