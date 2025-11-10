export interface Car {
  id: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  mileage: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  seats: number;
  pricePerDay: number;
  description?: string;
  images: string[];
  features: string[];
  location: Location;
  availability: Availability[];
  rating: number;
  reviewCount: number;
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

export interface Availability {
  startDate: Date;
  endDate: Date;
  isAvailable: boolean;
}