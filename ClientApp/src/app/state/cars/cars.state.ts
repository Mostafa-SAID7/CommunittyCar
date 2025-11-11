import { Car } from '../../../core/models/car.model';

export interface CarFilters {
  searchTerm: string;
  make: string;
  model: string;
  fuelType: string;
  transmission: string;
  minPrice: number;
  maxPrice: number;
  location: string;
  year: number;
  seats: number;
  features: string[];
  availability: {
    startDate: Date | null;
    endDate: Date | null;
  };
}

export interface CarPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CarSorting {
  field: 'price' | 'year' | 'rating' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface CarsState {
  cars: Car[];
  selectedCar: Car | null;
  isLoading: boolean;
  error: string | null;
  filters: CarFilters;
  pagination: CarPagination;
  sorting: CarSorting;
  favorites: string[]; // car IDs
  recentlyViewed: Car[];
  searchHistory: string[];
  cache: {
    [key: string]: {
      data: Car[];
      timestamp: number;
      expiresAt: number;
    };
  };
}

export const initialCarsState: CarsState = {
  cars: [],
  selectedCar: null,
  isLoading: false,
  error: null,
  filters: {
    searchTerm: '',
    make: '',
    model: '',
    fuelType: '',
    transmission: '',
    minPrice: 0,
    maxPrice: 1000,
    location: '',
    year: 0,
    seats: 0,
    features: [],
    availability: {
      startDate: null,
      endDate: null
    }
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  },
  sorting: {
    field: 'createdAt',
    direction: 'desc'
  },
  favorites: [],
  recentlyViewed: [],
  searchHistory: [],
  cache: {}
};