import { RideType, Driver, Location } from "@/contexts/RideContext";

// Ride type options
export const RIDE_TYPES: RideType[] = [
  {
    id: "economy",
    name: "Economy",
    description: "Affordable rides for everyday trips",
    seats: 4,
    priceRange: [12, 15],
    eta: 5,
    icon: "car",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Comfortable rides with top-rated drivers",
    seats: 4,
    priceRange: [18, 22],
    eta: 3,
    icon: "car-sport",
  },
  {
    id: "xl",
    name: "XL",
    description: "Extra space for groups up to 6",
    seats: 6,
    priceRange: [25, 30],
    eta: 8,
    icon: "car-outline",
  },
];

// Mock driver for demo
export const MOCK_DRIVER: Driver = {
  id: "driver-1",
  name: "John Smith",
  rating: 4.8,
  trips: 1243,
  photo: "https://randomuser.me/api/portraits/men/32.jpg",
  car: {
    model: "Toyota Camry",
    color: "White",
    plate: "ABC 1234",
  },
  location: {
    latitude: 37.7849,
    longitude: -122.4094,
    address: "Nearby",
  },
};

// Default location (San Francisco)
export const DEFAULT_LOCATION: Location = {
  latitude: 37.7749,
  longitude: -122.4194,
  address: "San Francisco, CA",
  name: "Current Location",
};

// Saved places
export const SAVED_PLACES: Location[] = [
  {
    latitude: 37.7849,
    longitude: -122.4094,
    address: "123 Home Street, San Francisco, CA",
    name: "Home",
  },
  {
    latitude: 37.7899,
    longitude: -122.4014,
    address: "456 Office Blvd, San Francisco, CA",
    name: "Work",
  },
];

// Recent searches
export const RECENT_SEARCHES: Location[] = [
  {
    latitude: 37.7879,
    longitude: -122.4074,
    address: "Union Square, San Francisco, CA",
    name: "Union Square",
  },
  {
    latitude: 37.8024,
    longitude: -122.4058,
    address: "Fisherman's Wharf, San Francisco, CA",
    name: "Fisherman's Wharf",
  },
  {
    latitude: 37.7694,
    longitude: -122.4862,
    address: "Golden Gate Park, San Francisco, CA",
    name: "Golden Gate Park",
  },
];

// Mock search results
export const MOCK_SEARCH_RESULTS: Location[] = [
  {
    latitude: 37.7879,
    longitude: -122.4074,
    address: "Union Square, San Francisco, CA",
    name: "Union Square",
  },
  {
    latitude: 37.8024,
    longitude: -122.4058,
    address: "Fisherman's Wharf, San Francisco, CA",
    name: "Fisherman's Wharf",
  },
  {
    latitude: 37.7694,
    longitude: -122.4862,
    address: "Golden Gate Park, San Francisco, CA",
    name: "Golden Gate Park",
  },
  {
    latitude: 37.7955,
    longitude: -122.3937,
    address: "Ferry Building, San Francisco, CA",
    name: "Ferry Building",
  },
  {
    latitude: 37.8199,
    longitude: -122.4783,
    address: "Golden Gate Bridge, San Francisco, CA",
    name: "Golden Gate Bridge",
  },
  {
    latitude: 37.8083,
    longitude: -122.4156,
    address: "Pier 39, San Francisco, CA",
    name: "Pier 39",
  },
  {
    latitude: 37.7621,
    longitude: -122.4350,
    address: "Twin Peaks, San Francisco, CA",
    name: "Twin Peaks",
  },
  {
    latitude: 37.8029,
    longitude: -122.4484,
    address: "Palace of Fine Arts, San Francisco, CA",
    name: "Palace of Fine Arts",
  },
];

// Onboarding slides data
export const ONBOARDING_SLIDES = [
  {
    id: "1",
    title: "Book Your Ride",
    subtitle: "Get a ride in minutes. Enter your destination and we'll match you with a nearby driver.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=400&fit=crop",
  },
  {
    id: "2",
    title: "Track in Real-time",
    subtitle: "See your driver on the map as they make their way to you. No more waiting in the dark.",
    image: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=400&h=400&fit=crop",
  },
  {
    id: "3",
    title: "Safe & Reliable",
    subtitle: "All drivers are verified and rated by riders like you. Your safety is our priority.",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop",
  },
];

// Tip options
export const TIP_OPTIONS = [
  { label: "$2", value: 2 },
  { label: "$5", value: 5 },
  { label: "$10", value: 10 },
  { label: "Custom", value: -1 },
];
