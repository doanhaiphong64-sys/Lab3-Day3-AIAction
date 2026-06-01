export type ViewState = 'home' | 'flight_results' | 'hotel_results' | 'itinerary' | 'hotel_detail' | 'destination_detail' | 'admin_dashboard';

export interface SearchCriteria {
  origin?: string;
  destination?: string;
  date?: string;
  guests?: number;
}

export interface Flight {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  departTime: string;
  arriveTime: string;
  price: number;
}

export interface Room {
  id: string;
  name: string;
  image: string;
  images?: string[];
  type: string;
  bedType: string;
  maxGuests: number;
  price: number;
  amenities: string[];
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
  images?: string[];
  description?: string;
  amenities?: string[];
  rooms?: Room[];
}

export interface ItineraryItem {
    id: string;
    type: 'flight' | 'hotel';
    flight?: Flight;
    hotel?: Hotel;
    bookedAt: string;
    status?: 'paid' | 'pending';
}

export interface Destination {
  id: string;
  name: string;
  image: string;
  deals: number;
  description?: string;
  topAttractions?: string[];
}
