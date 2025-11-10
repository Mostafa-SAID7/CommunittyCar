import { Car } from '../../core/models/car.model';

export interface CarsState {
  cars: Car[];
  selectedCar: Car | null;
  isLoading: boolean;
  error: string | null;
  filters: CarFilters;
  pagination: CarPagination;
}

export interface CarFilters {
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  fuelType?: string;
  transmission?: string;
  seats?: number;
  location?: string;
}

export interface CarPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const initialCarsState: CarsState = {
  cars: [],
  selectedCar: null,
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};