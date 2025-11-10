import { Booking } from '../../core/models/booking.model';

export interface BookingsState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
  filters: BookingFilters;
  pagination: BookingPagination;
}

export interface BookingFilters {
  status?: string;
  startDate?: Date;
  endDate?: Date;
  carId?: string;
  userId?: string;
}

export interface BookingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const initialBookingsState: BookingsState = {
  bookings: [],
  selectedBooking: null,
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