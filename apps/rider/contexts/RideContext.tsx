import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  name?: string;
}

export interface RideType {
  id: string;
  name: string;
  description: string;
  seats: number;
  priceRange: [number, number];
  eta: number; // minutes
  icon: string;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  trips: number;
  photo: string;
  car: {
    model: string;
    color: string;
    plate: string;
  };
  location: Location;
}

export type RideStatus =
  | "idle"
  | "searching"
  | "finding_driver"
  | "driver_assigned"
  | "driver_arriving"
  | "in_progress"
  | "completed"
  | "cancelled";

interface RideContextType {
  // Locations
  pickup: Location | null;
  destination: Location | null;
  setPickup: (location: Location | null) => void;
  setDestination: (location: Location | null) => void;

  // Ride selection
  selectedRideType: RideType | null;
  setSelectedRideType: (rideType: RideType | null) => void;

  // Ride status
  rideStatus: RideStatus;
  setRideStatus: (status: RideStatus) => void;

  // Driver
  driver: Driver | null;
  setDriver: (driver: Driver | null) => void;

  // Trip info
  estimatedPrice: number | null;
  estimatedDuration: number | null; // minutes
  estimatedDistance: number | null; // km

  // Actions
  resetRide: () => void;
  calculateEstimates: () => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const useRide = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error("useRide must be used within a RideProvider");
  }
  return context;
};

interface RideProviderProps {
  children: ReactNode;
}

export const RideProvider: React.FC<RideProviderProps> = ({ children }) => {
  // State
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedRideType, setSelectedRideType] = useState<RideType | null>(null);
  const [rideStatus, setRideStatus] = useState<RideStatus>("idle");
  const [driver, setDriver] = useState<Driver | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [estimatedDuration, setEstimatedDuration] = useState<number | null>(null);
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(null);

  // Calculate mock estimates based on pickup/destination
  const calculateEstimates = () => {
    if (!pickup || !destination) return;

    // Mock distance calculation (Haversine formula simplified)
    const R = 6371; // Earth's radius in km
    const dLat = ((destination.latitude - pickup.latitude) * Math.PI) / 180;
    const dLon = ((destination.longitude - pickup.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pickup.latitude * Math.PI) / 180) *
        Math.cos((destination.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Mock: ~30 km/h average speed in city
    const duration = Math.round((distance / 30) * 60);

    // Mock price: base $5 + $1.5/km
    const price = Math.round(5 + distance * 1.5);

    setEstimatedDistance(Math.round(distance * 10) / 10);
    setEstimatedDuration(Math.max(duration, 5)); // Minimum 5 minutes
    setEstimatedPrice(price);
  };

  // Reset all ride state
  const resetRide = () => {
    setPickup(null);
    setDestination(null);
    setSelectedRideType(null);
    setRideStatus("idle");
    setDriver(null);
    setEstimatedPrice(null);
    setEstimatedDuration(null);
    setEstimatedDistance(null);
  };

  const value: RideContextType = {
    pickup,
    destination,
    setPickup,
    setDestination,
    selectedRideType,
    setSelectedRideType,
    rideStatus,
    setRideStatus,
    driver,
    setDriver,
    estimatedPrice,
    estimatedDuration,
    estimatedDistance,
    resetRide,
    calculateEstimates,
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
};
