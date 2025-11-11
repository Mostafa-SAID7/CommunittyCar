import { createSelector, createMemoizedSelector, createCombinedSelector, createFilteredSelector, createFindSelector } from './signal-selectors';
import { BookingsSignalStore } from './bookings.store';
import { Booking } from '../models/booking.model';

/**
 * Bookings selectors for accessing booking-related state
 */

// Basic state selectors
export const selectBookingsState = (store: BookingsSignalStore) => store.select(state => state);
export const selectBookings = (store: BookingsSignalStore) => store.select(state => state.bookings);
export const selectSelectedBooking = (store: BookingsSignalStore) => store.select(state => state.selectedBooking);
export const selectBookingsIsLoading = (store: BookingsSignalStore) => store.select(state => state.isLoading);
export const selectBookingsError = (store: BookingsSignalStore) => store.select(state => state.error);
export const selectFilters = (store: BookingsSignalStore) => store.select(state => state.filters);
export const selectPagination = (store: BookingsSignalStore) => store.select(state => state.pagination);
export const selectSorting = (store: BookingsSignalStore) => store.select(state => state.sorting);
export const selectBookingsActiveTab = (store: BookingsSignalStore) => store.select(state => state.activeTab);
export const selectStatistics = (store: BookingsSignalStore) => store.select(state => state.statistics);
export const selectRecentActivity = (store: BookingsSignalStore) => store.select(state => state.recentActivity);

// Filter selectors
export const selectStatusFilter = (store: BookingsSignalStore) => store.select(state => state.filters.status);
export const selectDateRangeFilter = (store: BookingsSignalStore) => store.select(state => state.filters.dateRange);
export const selectCarFilter = (store: BookingsSignalStore) => store.select(state => state.filters.carId);
export const selectUserFilter = (store: BookingsSignalStore) => store.select(state => state.filters.userId);
export const selectPaymentStatusFilter = (store: BookingsSignalStore) => store.select(state => state.filters.paymentStatus);
export const selectPriceRangeFilter = (store: BookingsSignalStore) => store.select(state => ({
  minPrice: state.filters.minPrice,
  maxPrice: state.filters.maxPrice
}));
export const selectLocationFilter = (store: BookingsSignalStore) => store.select(state => state.filters.location);

// Pagination selectors
export const selectCurrentPage = (store: BookingsSignalStore) => store.select(state => state.pagination.page);
export const selectPageSize = (store: BookingsSignalStore) => store.select(state => state.pagination.limit);
export const selectTotalItems = (store: BookingsSignalStore) => store.select(state => state.pagination.total);
export const selectTotalPages = (store: BookingsSignalStore) => store.select(state => state.pagination.totalPages);
export const selectHasNextPage = (store: BookingsSignalStore) => store.select(state => state.pagination.hasNext);
export const selectHasPrevPage = (store: BookingsSignalStore) => store.select(state => state.pagination.hasPrev);

// Sorting selectors
export const selectSortField = (store: BookingsSignalStore) => store.select(state => state.sorting.field);
export const selectSortDirection = (store: BookingsSignalStore) => store.select(state => state.sorting.direction);

// Statistics selectors
export const selectTotalBookings = (store: BookingsSignalStore) => store.select(state => state.statistics.totalBookings);
export const selectTotalRevenue = (store: BookingsSignalStore) => store.select(state => state.statistics.totalRevenue);
export const selectActiveBookingsCount = (store: BookingsSignalStore) => store.select(state => state.statistics.activeBookings);
export const selectCompletedBookingsCount = (store: BookingsSignalStore) => store.select(state => state.statistics.completedBookings);
export const selectCancelledBookingsCount = (store: BookingsSignalStore) => store.select(state => state.statistics.cancelledBookings);

// Booking-specific selectors
export const selectBookingById = (bookingId: string) => (store: BookingsSignalStore) =>
  createFindSelector(store.select(state => state.bookings), booking => booking.id === bookingId);

export const selectBookingsByStatus = (status: string) => (store: BookingsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.bookings),
    booking => booking.status === status
  );

export const selectBookingsByUser = (userId: string) => (store: BookingsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.bookings),
    booking => booking.userId === userId
  );

export const selectBookingsByCar = (carId: string) => (store: BookingsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.bookings),
    booking => booking.carId === carId
  );

export const selectUpcomingBookings = (store: BookingsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.bookings),
    booking => booking.status === 'confirmed' && new Date(booking.startDate) > new Date()
  );

export const selectActiveBookings = (store: BookingsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.bookings),
    booking => booking.status === 'active'
  );

export const selectCompletedBookings = (store: BookingsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.bookings),
    booking => booking.status === 'completed'
  );

export const selectCancelledBookings = (store: BookingsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.bookings),
    booking => booking.status === 'cancelled'
  );

export const selectPendingBookings = (store: BookingsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.bookings),
    booking => booking.status === 'pending'
  );

export const selectPaidBookings = (store: BookingsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.bookings),
    booking => booking.paymentStatus === 'paid'
  );

export const selectUnpaidBookings = (store: BookingsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.bookings),
    booking => booking.paymentStatus === 'pending'
  );

// Combined selectors
export const selectBookingsStatus = (store: BookingsSignalStore) => createCombinedSelector(
  [selectBookingsIsLoading(store), selectBookingsError(store), selectBookings(store)],
  (...values: any[]) => {
    const [isLoading, error, bookings] = values;
    return {
      isLoading,
      error,
      hasError: !!error,
      hasBookings: bookings.length > 0,
      bookingsCount: bookings.length
    };
  }
);

export const selectPaginationInfo = (store: BookingsSignalStore) => createCombinedSelector(
  [selectPagination(store), selectBookings(store)],
  (...values: any[]) => {
    const [pagination, bookings] = values;
    return {
      ...pagination,
      currentItems: bookings.length,
      showing: `Showing ${pagination.page * pagination.limit - pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} bookings`
    };
  }
);

export const selectFilterSummary = (store: BookingsSignalStore) => createCombinedSelector(
  [selectFilters(store)],
  (filters) => {
    const activeFilters: string[] = [];

    if (filters.status) activeFilters.push(`Status: ${filters.status}`);
    if (filters.carId) activeFilters.push(`Car: ${filters.carId}`);
    if (filters.userId) activeFilters.push(`User: ${filters.userId}`);
    if (filters.paymentStatus) activeFilters.push(`Payment: ${filters.paymentStatus}`);
    if (filters.location) activeFilters.push(`Location: ${filters.location}`);
    if (filters.minPrice > 0 || filters.maxPrice < 10000) activeFilters.push(`Price: $${filters.minPrice}-$${filters.maxPrice}`);
    if (filters.dateRange.start && filters.dateRange.end) {
      activeFilters.push(`Date: ${filters.dateRange.start.toDateString()} - ${filters.dateRange.end.toDateString()}`);
    }

    return {
      filters,
      activeFilters,
      hasActiveFilters: activeFilters.length > 0,
      activeFiltersCount: activeFilters.length
    };
  }
);

export const selectBookingDetails = (store: BookingsSignalStore) => createCombinedSelector(
  [selectSelectedBooking(store)],
  (selectedBooking) => ({
    booking: selectedBooking,
    isUpcoming: selectedBooking ? new Date(selectedBooking.startDate) > new Date() : false,
    isActive: selectedBooking?.status === 'active',
    isCompleted: selectedBooking?.status === 'completed',
    isCancelled: selectedBooking?.status === 'cancelled',
    isPaid: selectedBooking?.paymentStatus === 'paid',
    daysUntilStart: selectedBooking ? Math.ceil((new Date(selectedBooking.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0,
    duration: selectedBooking ? Math.ceil((new Date(selectedBooking.endDate).getTime() - new Date(selectedBooking.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
  })
);

export const selectStatisticsSummary = (store: BookingsSignalStore) => createCombinedSelector(
  [selectStatistics(store)],
  (statistics) => ({
    ...statistics,
    completionRate: statistics.totalBookings > 0 ? (statistics.completedBookings / statistics.totalBookings) * 100 : 0,
    cancellationRate: statistics.totalBookings > 0 ? (statistics.cancelledBookings / statistics.totalBookings) * 100 : 0,
    averageRevenuePerBooking: statistics.totalBookings > 0 ? statistics.totalRevenue / statistics.totalBookings : 0
  })
);

// Memoized selectors for performance
export const selectBookingsByTab = (store: BookingsSignalStore) => store.select(
  state => {
    switch (state.activeTab) {
      case 'upcoming':
        return state.bookings.filter(booking =>
          booking.status === 'confirmed' && new Date(booking.startDate) > new Date()
        );
      case 'completed':
        return state.bookings.filter(booking => booking.status === 'completed');
      case 'cancelled':
        return state.bookings.filter(booking => booking.status === 'cancelled');
      case 'all':
      default:
        return state.bookings;
    }
  }
);

export const selectRecentBookings = (store: BookingsSignalStore) => store.select(
  state => state.bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
);

export const selectBookingsThisMonth = (store: BookingsSignalStore) => store.select(
  state => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return state.bookings.filter(booking => new Date(booking.createdAt) >= startOfMonth);
  }
);

export const selectBookingsThisWeek = (store: BookingsSignalStore) => store.select(
  state => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);
    return state.bookings.filter(booking => new Date(booking.createdAt) >= startOfWeek);
  }
);

export const selectTotalRevenueThisMonth = (store: BookingsSignalStore) => store.select(
  state => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return state.bookings
      .filter(booking => new Date(booking.createdAt) >= startOfMonth && booking.status === 'completed')
      .reduce((total, booking) => total + booking.totalPrice, 0);
  }
);

export const selectAverageBookingValue = (store: BookingsSignalStore) => store.select(
  state => {
    const completedBookings = state.bookings.filter(booking => booking.status === 'completed');
    if (completedBookings.length === 0) return 0;
    return completedBookings.reduce((total, booking) => total + booking.totalPrice, 0) / completedBookings.length;
  }
);

export const selectBookingsByMonth = (store: BookingsSignalStore) => store.select(
  state => {
    const monthlyData: { [key: string]: number } = {};
    state.bookings.forEach(booking => {
      const monthKey = new Date(booking.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });
    return monthlyData;
  }
);

export const selectRevenueByMonth = (store: BookingsSignalStore) => store.select(
  state => {
    const monthlyRevenue: { [key: string]: number } = {};
    state.bookings
      .filter(booking => booking.status === 'completed')
      .forEach(booking => {
        const monthKey = new Date(booking.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + booking.totalPrice;
      });
    return monthlyRevenue;
  }
);

// Search and filter helpers
export const selectFilteredBookings = (store: BookingsSignalStore) => store.select(
  state => {
    let filtered = [...state.bookings];

    const { filters } = state;

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Apply car filter
    if (filters.carId) {
      filtered = filtered.filter(booking => booking.carId === filters.carId);
    }

    // Apply user filter
    if (filters.userId) {
      filtered = filtered.filter(booking => booking.userId === filters.userId);
    }

    // Apply payment status filter
    if (filters.paymentStatus) {
      filtered = filtered.filter(booking => booking.paymentStatus === filters.paymentStatus);
    }

    // Apply location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.pickupLocation.city.toLowerCase().includes(locationLower) ||
        booking.pickupLocation.state.toLowerCase().includes(locationLower) ||
        booking.dropoffLocation.city.toLowerCase().includes(locationLower) ||
        booking.dropoffLocation.state.toLowerCase().includes(locationLower)
      );
    }

    // Apply price range filter
    if (filters.minPrice > 0) {
      filtered = filtered.filter(booking => booking.totalPrice >= filters.minPrice);
    }
    if (filters.maxPrice < 10000) {
      filtered = filtered.filter(booking => booking.totalPrice <= filters.maxPrice);
    }

    // Apply date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(booking => new Date(booking.startDate) >= filters.dateRange.start!);
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(booking => new Date(booking.endDate) <= filters.dateRange.end!);
    }

    return filtered;
  }
);

export const selectSortedAndFilteredBookings = (store: BookingsSignalStore) => createCombinedSelector(
  [selectFilteredBookings(store), selectSorting(store)],
  (...values: any[]) => {
    const [filteredBookings, sorting] = values;
    const sorted = [...filteredBookings].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sorting.field) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'startDate':
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.startDate).getTime();
          break;
        case 'endDate':
          aValue = new Date(a.endDate).getTime();
          bValue = new Date(b.endDate).getTime();
          break;
        case 'totalPrice':
          aValue = a.totalPrice;
          bValue = b.totalPrice;
          break;
        default:
          return 0;
      }

      if (sorting.direction === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return sorted;
  }
);

// Cache selectors
export const selectCacheEntry = (key: string) => (store: BookingsSignalStore) =>
  store.select(state => state.cache[key]);

export const selectIsCacheValid = (key: string) => (store: BookingsSignalStore) =>
  store.select(state => {
    const entry = state.cache[key];
    return entry && Date.now() <= entry.expiresAt;
  });

// Validation selectors
export const selectBookingsHasValidationErrors = (store: BookingsSignalStore) => store.select(
  state => !!(state.error && state.error.length > 0)
);

export const selectCanCreateBooking = (store: BookingsSignalStore) => store.select(
  state => !state.isLoading && !state.error
);

export const selectCanUpdateBooking = (store: BookingsSignalStore) => store.select(
  state => !state.isLoading && !!state.selectedBooking
);