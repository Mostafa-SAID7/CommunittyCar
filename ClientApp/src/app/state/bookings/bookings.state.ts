import { Booking } from '../../models/booking.model';

export interface BookingFilters {
  status: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  carId: string;
  userId: string;
  paymentStatus: string;
  minPrice: number;
  maxPrice: number;
  location: string;
}

export interface BookingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BookingSorting {
  field: 'createdAt' | 'startDate' | 'endDate' | 'totalPrice';
  direction: 'asc' | 'desc';
}

export interface BookingsState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  activeTab: 'upcoming' | 'completed' | 'cancelled' | 'all';
  filters: BookingFilters;
  pagination: BookingPagination;
  sorting: BookingSorting;
  statistics: {
    totalBookings: number;
    totalRevenue: number;
    activeBookings: number;
    completedBookings: number;
    cancelledBookings: number;
  };
  recentActivity: Booking[];
  cache: {
    [key: string]: {
      data: Booking[];
      timestamp: number;
      expiresAt: number;
    };
  };
}

export const initialBookingsState: BookingsState = {
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,
  activeTab: 'upcoming',
  filters: {
    status: '',
    dateRange: {
      start: null,
      end: null
    },
    carId: '',
    userId: '',
    paymentStatus: '',
    minPrice: 0,
    maxPrice: 10000,
    location: ''
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  },
  sorting: {
    field: 'createdAt',
    direction: 'desc'
  },
  statistics: {
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0
  },
  recentActivity: [],
  cache: {}
};