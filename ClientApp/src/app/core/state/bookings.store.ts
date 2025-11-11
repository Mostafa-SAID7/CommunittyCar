import { Injectable, inject } from '@angular/core';
import { BaseSignalStore } from './base-signal-store';
import { BookingsState, initialBookingsState, BookingFilters, BookingSorting } from '../../state/bookings/bookings.state';
import { Booking, BookingRequest } from '../models/booking.model';
import { BookingApiService, BookingSearchParams, CreateBookingRequest } from '../services/api/booking-api.service';

/**
 * Bookings signal store for managing booking operations, status tracking, and booking-related state
 */
@Injectable({
  providedIn: 'root'
})
export class BookingsSignalStore extends BaseSignalStore<BookingsState> {
  private bookingApiService = inject(BookingApiService);

  constructor() {
    super(initialBookingsState);
  }

  /**
   * Reset bookings state to initial values
   */
  reset(): void {
    this.setState(initialBookingsState);
  }

  // Loading and Error Management
  /**
   * Set loading state
   */
  setLoading(isLoading: boolean): void {
    this.patchState({ isLoading });
  }

  /**
   * Set error state
   */
  setError(error: string | null): void {
    this.patchState({ error });
  }

  /**
   * Clear error state
   */
  clearError(): void {
    this.patchState({ error: null });
  }

  // Booking Listings Management
  /**
   * Load bookings with optional search parameters
   */
  loadBookings(params?: BookingSearchParams): void {
    this.setLoading(true);
    this.clearError();

    this.bookingApiService.getBookings(params).subscribe({
      next: (response) => {
        this.updateState(currentState => ({
          ...currentState,
          bookings: response.bookings,
          pagination: {
            page: response.page,
            limit: response.limit,
            total: response.total,
            totalPages: response.totalPages,
            hasNext: response.page < response.totalPages,
            hasPrev: response.page > 1
          },
          statistics: response.statistics || currentState.statistics,
          isLoading: false,
          error: null
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load bookings');
        this.setLoading(false);
      }
    });
  }

  /**
   * Load a single booking by ID
   */
  loadBooking(id: string): void {
    this.setLoading(true);
    this.clearError();

    this.bookingApiService.getBooking(id).subscribe({
      next: (booking) => {
        this.patchState({
          selectedBooking: booking,
          isLoading: false,
          error: null
        });
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load booking');
        this.setLoading(false);
      }
    });
  }

  /**
   * Set selected booking
   */
  setSelectedBooking(booking: Booking | null): void {
    this.patchState({ selectedBooking: booking });
  }

  // Filter Management
  /**
   * Update filters
   */
  updateFilters(filters: Partial<BookingFilters>): void {
    this.updateState(currentState => ({
      ...currentState,
      filters: { ...currentState.filters, ...filters }
    }));
  }

  /**
   * Reset filters to default values
   */
  resetFilters(): void {
    this.updateState(currentState => ({
      ...currentState,
      filters: initialBookingsState.filters
    }));
  }

  /**
   * Set status filter
   */
  setStatusFilter(status: string): void {
    this.updateFilters({ status });
  }

  /**
   * Set date range filter
   */
  setDateRange(startDate: Date | null, endDate: Date | null): void {
    this.updateFilters({
      dateRange: { start: startDate, end: endDate }
    });
  }

  /**
   * Set car filter
   */
  setCarFilter(carId: string): void {
    this.updateFilters({ carId });
  }

  /**
   * Set user filter
   */
  setUserFilter(userId: string): void {
    this.updateFilters({ userId });
  }

  /**
   * Set payment status filter
   */
  setPaymentStatusFilter(paymentStatus: string): void {
    this.updateFilters({ paymentStatus });
  }

  /**
   * Set price range filter
   */
  setPriceRange(minPrice: number, maxPrice: number): void {
    this.updateFilters({ minPrice, maxPrice });
  }

  /**
   * Set location filter
   */
  setLocationFilter(location: string): void {
    this.updateFilters({ location });
  }

  // Sorting Management
  /**
   * Update sorting
   */
  updateSorting(sorting: Partial<BookingSorting>): void {
    this.updateState(currentState => ({
      ...currentState,
      sorting: { ...currentState.sorting, ...sorting }
    }));
  }

  /**
   * Set sort field
   */
  setSortField(field: BookingSorting['field']): void {
    this.updateSorting({ field });
  }

  /**
   * Toggle sort direction
   */
  toggleSortDirection(): void {
    this.updateState(currentState => ({
      ...currentState,
      sorting: {
        ...currentState.sorting,
        direction: currentState.sorting.direction === 'asc' ? 'desc' : 'asc'
      }
    }));
  }

  // Pagination Management
  /**
   * Set current page
   */
  setPage(page: number): void {
    this.updateState(currentState => ({
      ...currentState,
      pagination: { ...currentState.pagination, page }
    }));
  }

  /**
   * Set page size
   */
  setPageSize(limit: number): void {
    this.updateState(currentState => ({
      ...currentState,
      pagination: { ...currentState.pagination, page: 1, limit }
    }));
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    const state = this.getState();
    if (state.pagination.hasNext) {
      this.setPage(state.pagination.page + 1);
    }
  }

  /**
   * Go to previous page
   */
  prevPage(): void {
    const state = this.getState();
    if (state.pagination.hasPrev) {
      this.setPage(state.pagination.page - 1);
    }
  }

  // Tab Management
  /**
   * Set active tab
   */
  setActiveTab(tab: BookingsState['activeTab']): void {
    this.patchState({ activeTab: tab });
  }

  // Booking CRUD Operations
  /**
   * Create a new booking
   */
  createBooking(bookingData: CreateBookingRequest): void {
    this.setLoading(true);
    this.clearError();

    this.bookingApiService.createBooking(bookingData).subscribe({
      next: (response) => {
        if (response.success && response.booking) {
          this.updateState(currentState => ({
            ...currentState,
            bookings: [response.booking, ...currentState.bookings],
            selectedBooking: response.booking,
            isLoading: false
          }));
        } else {
          this.setError(response.message || 'Failed to create booking');
          this.setLoading(false);
        }
      },
      error: (error) => {
        this.setError(error.message || 'Failed to create booking');
        this.setLoading(false);
      }
    });
  }

  /**
   * Update an existing booking
   */
  updateBooking(id: string, updates: Partial<Booking>): void {
    this.setLoading(true);
    this.clearError();

    this.bookingApiService.updateBooking(id, updates).subscribe({
      next: (response) => {
        if (response.success && response.booking) {
          this.updateState(currentState => ({
            ...currentState,
            bookings: currentState.bookings.map(booking =>
              booking.id === id ? response.booking! : booking
            ),
            selectedBooking: currentState.selectedBooking?.id === id ? response.booking : currentState.selectedBooking,
            isLoading: false
          }));
        } else {
          this.setError(response.message || 'Failed to update booking');
          this.setLoading(false);
        }
      },
      error: (error) => {
        this.setError(error.message || 'Failed to update booking');
        this.setLoading(false);
      }
    });
  }

  /**
   * Cancel a booking
   */
  cancelBooking(id: string, reason?: string): void {
    this.setLoading(true);
    this.clearError();

    this.bookingApiService.cancelBooking(id, reason).subscribe({
      next: (response) => {
        if (response.success) {
          this.updateState(currentState => ({
            ...currentState,
            bookings: currentState.bookings.map(booking =>
              booking.id === id ? { ...booking, status: 'cancelled' as const } : booking
            ),
            selectedBooking: currentState.selectedBooking?.id === id
              ? { ...currentState.selectedBooking, status: 'cancelled' as const }
              : currentState.selectedBooking,
            isLoading: false
          }));
        } else {
          this.setError(response.message || 'Failed to cancel booking');
          this.setLoading(false);
        }
      },
      error: (error) => {
        this.setError(error.message || 'Failed to cancel booking');
        this.setLoading(false);
      }
    });
  }

  /**
   * Confirm a booking
   */
  confirmBooking(id: string): void {
    this.setLoading(true);
    this.clearError();

    this.bookingApiService.confirmBooking(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.updateState(currentState => ({
            ...currentState,
            bookings: currentState.bookings.map(booking =>
              booking.id === id ? { ...booking, status: 'confirmed' as const } : booking
            ),
            selectedBooking: currentState.selectedBooking?.id === id
              ? { ...currentState.selectedBooking, status: 'confirmed' as const }
              : currentState.selectedBooking,
            isLoading: false
          }));
        } else {
          this.setError(response.message || 'Failed to confirm booking');
          this.setLoading(false);
        }
      },
      error: (error) => {
        this.setError(error.message || 'Failed to confirm booking');
        this.setLoading(false);
      }
    });
  }

  /**
   * Extend a booking
   */
  extendBooking(id: string, newEndDate: Date): void {
    this.setLoading(true);
    this.clearError();

    this.bookingApiService.extendBooking(id, newEndDate).subscribe({
      next: (response) => {
        if (response.success && response.booking) {
          this.updateState(currentState => ({
            ...currentState,
            bookings: currentState.bookings.map(booking =>
              booking.id === id ? response.booking! : booking
            ),
            selectedBooking: currentState.selectedBooking?.id === id ? response.booking : currentState.selectedBooking,
            isLoading: false
          }));
        } else {
          this.setError(response.message || 'Failed to extend booking');
          this.setLoading(false);
        }
      },
      error: (error) => {
        this.setError(error.message || 'Failed to extend booking');
        this.setLoading(false);
      }
    });
  }

  // Specialized Loading Methods
  /**
   * Load user's booking history
   */
  loadBookingHistory(userId?: string, page: number = 1, limit: number = 10): void {
    this.setLoading(true);
    this.clearError();

    this.bookingApiService.getBookingHistory(userId, page, limit).subscribe({
      next: (response) => {
        this.updateState(currentState => ({
          ...currentState,
          bookings: response.bookings,
          pagination: {
            page: response.page,
            limit: response.limit,
            total: response.total,
            totalPages: response.totalPages,
            hasNext: response.page < response.totalPages,
            hasPrev: response.page > 1
          },
          isLoading: false,
          error: null
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load booking history');
        this.setLoading(false);
      }
    });
  }

  /**
   * Load upcoming bookings
   */
  loadUpcomingBookings(userId?: string): void {
    this.setLoading(true);
    this.clearError();

    this.bookingApiService.getUpcomingBookings(userId).subscribe({
      next: (bookings) => {
        this.patchState({
          recentActivity: bookings.slice(0, 5), // Store recent upcoming bookings
          isLoading: false,
          error: null
        });
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load upcoming bookings');
        this.setLoading(false);
      }
    });
  }

  /**
   * Load active bookings
   */
  loadActiveBookings(userId?: string): void {
    this.setLoading(true);
    this.clearError();

    this.bookingApiService.getActiveBookings(userId).subscribe({
      next: (bookings) => {
        this.updateState(currentState => ({
          ...currentState,
          bookings: bookings,
          isLoading: false,
          error: null
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load active bookings');
        this.setLoading(false);
      }
    });
  }

  // Payment Operations
  /**
   * Process payment for a booking
   */
  processPayment(bookingId: string, paymentData: any): void {
    this.setLoading(true);
    this.clearError();

    this.bookingApiService.processPayment(bookingId, paymentData).subscribe({
      next: (response) => {
        if (response.success) {
          this.updateState(currentState => ({
            ...currentState,
            bookings: currentState.bookings.map(booking =>
              booking.id === bookingId ? { ...booking, paymentStatus: 'paid' as const } : booking
            ),
            selectedBooking: currentState.selectedBooking?.id === bookingId
              ? { ...currentState.selectedBooking, paymentStatus: 'paid' as const }
              : currentState.selectedBooking,
            isLoading: false
          }));
        } else {
          this.setError(response.message || 'Payment failed');
          this.setLoading(false);
        }
      },
      error: (error) => {
        this.setError(error.message || 'Payment processing failed');
        this.setLoading(false);
      }
    });
  }

  /**
   * Get payment status for a booking
   */
  getPaymentStatus(bookingId: string): void {
    this.bookingApiService.getPaymentStatus(bookingId).subscribe({
      next: (status) => {
        this.updateState(currentState => ({
          ...currentState,
          bookings: currentState.bookings.map(booking =>
            booking.id === bookingId ? { ...booking, paymentStatus: status.status as any } : booking
          ),
          selectedBooking: currentState.selectedBooking?.id === bookingId
            ? { ...currentState.selectedBooking, paymentStatus: status.status as any }
            : currentState.selectedBooking
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to get payment status');
      }
    });
  }

  // Review Operations
  /**
   * Add review to a booking
   */
  addBookingReview(bookingId: string, review: { rating: number; comment: string }): void {
    this.bookingApiService.addBookingReview(bookingId, review).subscribe({
      next: (response) => {
        if (response.success) {
          // Could update booking with review data if needed
          this.clearError();
        } else {
          this.setError(response.message || 'Failed to add review');
        }
      },
      error: (error) => {
        this.setError(error.message || 'Failed to add review');
      }
    });
  }

  // Statistics
  /**
   * Load booking statistics
   */
  loadBookingStatistics(userId?: string): void {
    this.bookingApiService.getBookingStatistics(userId).subscribe({
      next: (statistics) => {
        this.patchState({
          statistics: {
            totalBookings: statistics.totalBookings,
            totalRevenue: statistics.totalSpent,
            activeBookings: statistics.activeBookings,
            completedBookings: statistics.completedBookings,
            cancelledBookings: statistics.cancelledBookings
          }
        });
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load statistics');
      }
    });
  }

  // Price Calculation
  /**
   * Calculate booking price
   */
  calculateBookingPrice(carId: string, startDate: Date, endDate: Date): void {
    this.bookingApiService.calculateBookingPrice(carId, startDate, endDate).subscribe({
      next: (priceInfo) => {
        // Store calculated price in state if needed
        this.patchState({
          // Could add a calculatedPrice field to state
        });
      },
      error: (error) => {
        this.setError(error.message || 'Failed to calculate price');
      }
    });
  }

  // Cache Management
  /**
   * Cache search results
   */
  cacheResults(key: string, results: Booking[], ttlMinutes: number = 5): void {
    const now = Date.now();
    const expiresAt = now + (ttlMinutes * 60 * 1000);

    this.updateState(currentState => ({
      ...currentState,
      cache: {
        ...currentState.cache,
        [key]: {
          data: results,
          timestamp: now,
          expiresAt
        }
      }
    }));
  }

  /**
   * Get cached results if not expired
   */
  getCachedResults(key: string): Booking[] | null {
    const state = this.getState();
    const cached = state.cache[key];

    if (!cached || Date.now() > cached.expiresAt) {
      return null;
    }

    return cached.data;
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache(): void {
    const now = Date.now();

    this.updateState(currentState => {
      const newCache = { ...currentState.cache };
      Object.keys(newCache).forEach(key => {
        if (now > newCache[key].expiresAt) {
          delete newCache[key];
        }
      });

      return {
        ...currentState,
        cache: newCache
      };
    });
  }
}