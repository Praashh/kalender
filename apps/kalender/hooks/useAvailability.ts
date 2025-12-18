import { useAuth } from "@/contexts/AuthContext";
import { getBaseUrl } from "@/utils/base-url";
import { TOKEN_KEY } from "@/utils/tokenStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Toast } from "toastify-react-native";

interface IAvailability {
    id: string;
    days: number[];
    name: string;
    startTime: Date;
    endTime: Date;
    timezone: string
}

interface CreateAvailabityData {
    days: number[];
    startTime: Date;
    endTime: Date;
    userId: string;
    name?: string;
    eventTypeId?: string
}

interface UpdateAvailabityData {
    days: number[];
    startTime: Date;
    endTime: Date;
}

interface UserAvailabilitiesReturn {
    availabilities: IAvailability[],
    loading: boolean,
    error: string | null,
    createAvailabity: (data: CreateAvailabityData) => Promise<boolean>;
    updateAvailabity: (id: string, data: UpdateAvailabityData) => Promise<boolean>;
    fetchEventAvailability: (username: string, slug: string) => Promise<{ availabilities: any; eventTypes: any } | undefined>;
    refreshAvailabilities: () => Promise<void>;
    clearError: () => void;
}
export function useAvailability(): UserAvailabilitiesReturn {
    const [availabilities, setAvailabilies] = useState<IAvailability[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    const getAuthHeaders = useCallback(async () => {
        const accessToken = await AsyncStorage.getItem(TOKEN_KEY);
        return {
            Authorization: accessToken,
            userId: user!.id
        };
    }, [user]);


    const handleApiError = useCallback((operation: string, error: any) => {
        console.error(`Error ${operation}:`, error);
        const errorMessage = error.response?.data?.message || `Failed to ${operation}`;
        setError(errorMessage);
        Toast.error(`Error: ${errorMessage}`);
        return false;
    }, []);


    const fetchAvailabilites = useCallback(async (): Promise<void> =>{
        if (!user?.id) return;

        try {
            setLoading(true);
            setError(null);
            const baseUrl = getBaseUrl();
            const headers = await getAuthHeaders();
            console.log("baseUrl", baseUrl);
            console.log('headers', headers);
            const response = await axios.get(
                `${baseUrl}/api/availability/getAll/${user.id}`,
                { headers }
            );
            if (response.data && response.data.availabilities) {
                setAvailabilies(response.data.availabilities);
            } else {
                setAvailabilies([]);
            }
        } catch (error) {
            handleApiError('fetch events', error);
        } finally {
            setLoading(false);
        }
    }, [user, getAuthHeaders, handleApiError])

    const fetchEventAvailability = async (username: string, slug: string) => {
        const headers = await getAuthHeaders();
        const baseUrl = getBaseUrl();
        const apiUrl = baseUrl + '/api/event/availability';
        console.log('apiUrl', apiUrl)
console.log("headers", headers)
        try {
            console.log("username", username)
            console.log("slug", slug)
            const response = await axios.post(apiUrl,  {
                username,
                slug
            },
            {
                headers
            });
    
            console.log("response inside Fetch me ========", response.data)
            if(response.status !== 200){
                Toast.error("Something went wrong");
            }
    
            return {availabilities: response.data.availabilities, eventTypes: response.data.eventTypes}
            
        } catch (error) {
            console.log("error", error)
            Toast.error("Something went wrong");
        }
    }

    const refreshAvailabilities = useCallback(async (): Promise<void> => {
        await fetchAvailabilites();
    }, [fetchAvailabilites]);

    useEffect(() => {
        if (user?.id) {
            fetchAvailabilites();
        }
    }, [user?.id, fetchAvailabilites]);

    const clearError = useCallback((): void => {
        setError(null);
    }, []);


    const createAvailabity = useCallback(async (data: CreateAvailabityData): Promise<boolean> => {
        if (!user?.id) return false;

        try {
            setLoading(true);
            setError(null);
            const baseUrl = getBaseUrl();
            const headers = await getAuthHeaders();
            
            const response = await axios.post(
                `${baseUrl}/api/availability/create`,
                {
                    ...data,
                    userId: user.id
                },
                { headers }
            );

            if (response.data) {
                setAvailabilies(prev => [...prev, response.data.availabilities]);
                Toast.success('Event created successfully!');
                return true;
            }
            return false;
        } catch (error) {
            return handleApiError('create event', error);
        } finally {
            setLoading(false);
        }
    }, [user, getAuthHeaders, handleApiError]);


    const updateAvailabity = useCallback(async (id: string, data: UpdateAvailabityData): Promise<boolean> => {
        if (!user?.id) return false;

        try {
            setError(null);
            const baseUrl = getBaseUrl();
            const headers = await getAuthHeaders();
            
            setAvailabilies(prev => 
                prev.map(event => 
                    event.id === id ? { ...event, ...data } : event
                )
            );

            const response = await axios.put(
                `${baseUrl}/api/availability/update/${id}`,
                data,
                { headers }
            );

            if (response.data) {
                setAvailabilies(prev => 
                    prev.map(event => 
                        event.id === id ? response.data.event : event
                    )
                );
                Toast.success('Event updated successfully!');
                return true;
            }
            return false;
        } catch (error) {
            await fetchAvailabilites();
            return handleApiError('update event', error);
        }
    }, [user, getAuthHeaders, handleApiError, fetchAvailabilites]);


    return {
        error,
        availabilities,
        fetchEventAvailability,
        createAvailabity,
        updateAvailabity,
        refreshAvailabilities,
        clearError,
        loading
    }

}   