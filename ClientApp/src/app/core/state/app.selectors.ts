import { createCombinedSelector } from './signal-selectors';
import { AppSignalStore } from './app.store';
import { selectIsAuthenticated, selectUser, selectIsLoading as selectAuthLoading, selectError as selectAuthError } from './auth.selectors';
import { selectUiIsLoading, selectHasOpenModals, selectHasNotifications, selectTheme } from './ui.selectors';
import { selectIsLoading as selectCarsLoading, selectError as selectCarsError, selectCars } from './cars.selectors';
import { selectBookingsIsLoading, selectBookingsError, selectBookings } from './bookings.selectors';
import { Booking } from '../models/booking.model';

/**
 * App-level selectors for global state management and cross-store selectors
 */

// Basic app state selectors
export const selectAppState = (store: AppSignalStore) => ({
  auth: store.auth.getState(),
  ui: store.ui.getState(),
  cars: store.cars.getState(),
  bookings: store.bookings.getState()
});

// Global status selectors
export const selectGlobalLoading = (store: AppSignalStore) =>
  createCombinedSelector(
    [selectAuthLoading(store.auth), selectUiIsLoading(store.ui), selectCarsLoading(store.cars), selectBookingsIsLoading(store.bookings)],
    (authLoading, uiLoading, carsLoading, bookingsLoading) =>
      authLoading || uiLoading || carsLoading || bookingsLoading
  );

export const selectGlobalError = (store: AppSignalStore) =>
  createCombinedSelector(
    [selectAuthError(store.auth), selectCarsError(store.cars), selectBookingsError(store.bookings)],
    (authError, carsError, bookingsError) =>
      authError || carsError || bookingsError || null
  );

export const selectAppStatus = (store: AppSignalStore) =>
  createCombinedSelector(
    [selectIsAuthenticated(store.auth), selectGlobalLoading(store), selectGlobalError(store)],
    (isAuthenticated, isLoading, error) => ({
      isAuthenticated,
      isLoading,
      hasError: !!error,
      error,
      isReady: !isLoading && !error
    })
  );

// User and authentication selectors
export const selectCurrentUser = (store: AppSignalStore) => selectUser(store.auth);

export const selectAppUserProfile = (store: AppSignalStore) =>
  createCombinedSelector(
    [selectUser(store.auth), selectTheme(store.ui)],
    (user, theme) => ({
      user,
      theme,
      isAuthenticated: !!user,
      displayName: user?.name || user?.email?.split('@')[0] || 'User'
    })
  );

// UI state selectors
export const selectAppUiState = (store: AppSignalStore) =>
  createCombinedSelector(
    [selectUiIsLoading(store.ui), selectHasOpenModals(store.ui), selectHasNotifications(store.ui)],
    (isLoading, hasOpenModals, hasNotifications) => ({
      isLoading,
      hasOpenModals,
      hasNotifications,
      isBusy: isLoading || hasOpenModals
    })
  );

// Cross-store business logic selectors
export const selectDashboardData = (store: AppSignalStore) =>
  createCombinedSelector(
    [selectUser(store.auth), selectCars(store.cars), selectBookings(store.bookings)],
    (user, cars, bookings: Booking[]) => ({
      user,
      recentCars: cars.slice(0, 5),
      recentBookings: bookings.slice(0, 5),
      totalCars: cars.length,
      totalBookings: bookings.length,
      activeBookings: bookings.filter((b: Booking) => b.status === 'active' || b.status === 'confirmed').length
    })
  );

export const selectUserActivity = (store: AppSignalStore) =>
  createCombinedSelector(
    [selectUser(store.auth), selectBookings(store.bookings)],
    (user, bookings: Booking[]) => {
      if (!user) return null;

      const userBookings = bookings.filter((b: Booking) => b.userId === user.id);
      return {
        user,
        totalBookings: userBookings.length,
        activeBookings: userBookings.filter((b: Booking) => b.status === 'active' || b.status === 'confirmed').length,
        completedBookings: userBookings.filter((b: Booking) => b.status === 'completed').length,
        recentBookings: userBookings.slice(0, 3)
      };
    }
  );

export const selectCarBookingStats = (store: AppSignalStore) =>
  createCombinedSelector(
    [selectCars(store.cars), selectBookings(store.bookings)],
    (cars, bookings) => {
      const stats = cars.map(car => {
        const carBookings = bookings.filter(b => b.carId === car.id);
        return {
          car,
          totalBookings: carBookings.length,
          activeBookings: carBookings.filter(b => b.status === 'active' || b.status === 'confirmed').length,
          revenue: carBookings
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + b.totalPrice, 0)
        };
      });

      return stats.sort((a, b) => b.totalBookings - a.totalBookings);
    }
  );

// Search and filter selectors
export const selectGlobalSearchResults = (store: AppSignalStore) =>
  createCombinedSelector(
    [selectCars(store.cars), selectBookings(store.bookings)],
    (cars, bookings) => ({
      cars,
      bookings,
      totalResults: cars.length + bookings.length
    })
  );

// Notification and modal selectors
export const selectAppNotifications = (store: AppSignalStore) =>
  createCombinedSelector(
    [selectHasNotifications(store.ui)],
    (hasNotifications) => ({
      hasNotifications,
      // Could combine with booking notifications, car alerts, etc.
    })
  );

// Performance and caching selectors
export const selectAppCacheStatus = (store: AppSignalStore) => ({
  carsCache: store.cars.getState().cache,
  bookingsCache: store.bookings.getState().cache
});

// Admin selectors
export const selectAdminOverview = (store: AppSignalStore) =>
  createCombinedSelector(
    [selectUser(store.auth), selectCars(store.cars), selectBookings(store.bookings)],
    (user, cars, bookings: Booking[]) => {
      if (!user || !user.roles.includes('admin')) return null;

      return {
        totalUsers: 1, // Would need user store
        totalCars: cars.length,
        totalBookings: bookings.length,
        activeBookings: bookings.filter((b: Booking) => b.status === 'active' || b.status === 'confirmed').length,
        totalRevenue: bookings
          .filter((b: Booking) => b.status === 'completed')
          .reduce((sum: number, b: Booking) => sum + b.totalPrice, 0),
        recentActivity: bookings.slice(0, 10)
      };
    }
  );

// Utility selectors
export const selectAppReadiness = (store: AppSignalStore) =>
  createCombinedSelector(
    [selectIsAuthenticated(store.auth), selectGlobalLoading(store)],
    (isAuthenticated, isLoading) => ({
      isReady: !isLoading,
      needsAuth: !isAuthenticated,
      canLoadData: !isLoading && isAuthenticated
    })
  );