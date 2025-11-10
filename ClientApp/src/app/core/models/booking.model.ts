export interface Booking {
  id: string;
  userId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  pickupLocation: Location;
  dropoffLocation: Location;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface BookingRequest {
  carId: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: Location;
  dropoffLocation: Location;
  specialRequests?: string;
}