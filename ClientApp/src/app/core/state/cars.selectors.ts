import { createSelector, createMemoizedSelector, createCombinedSelector, createFilteredSelector, createFindSelector } from './signal-selectors';
import { CarsSignalStore } from './cars.store';
import { Car } from '../models/car.model';

/**
 * Cars selectors for accessing car-related state
 */

// Basic state selectors
export const selectCarsState = (store: CarsSignalStore) => store.select(state => state);
export const selectCars = (store: CarsSignalStore) => store.select(state => state.cars);
export const selectSelectedCar = (store: CarsSignalStore) => store.select(state => state.selectedCar);
export const selectIsLoading = (store: CarsSignalStore) => store.select(state => state.isLoading);
export const selectError = (store: CarsSignalStore) => store.select(state => state.error);
export const selectFilters = (store: CarsSignalStore) => store.select(state => state.filters);
export const selectPagination = (store: CarsSignalStore) => store.select(state => state.pagination);
export const selectSorting = (store: CarsSignalStore) => store.select(state => state.sorting);
export const selectFavorites = (store: CarsSignalStore) => store.select(state => state.favorites);
export const selectRecentlyViewed = (store: CarsSignalStore) => store.select(state => state.recentlyViewed);
export const selectSearchHistory = (store: CarsSignalStore) => store.select(state => state.searchHistory);

// Filter selectors
export const selectSearchTerm = (store: CarsSignalStore) => store.select(state => state.filters.searchTerm);
export const selectLocationFilter = (store: CarsSignalStore) => store.select(state => state.filters.location);
export const selectMakeFilter = (store: CarsSignalStore) => store.select(state => state.filters.make);
export const selectModelFilter = (store: CarsSignalStore) => store.select(state => state.filters.model);
export const selectFuelTypeFilter = (store: CarsSignalStore) => store.select(state => state.filters.fuelType);
export const selectTransmissionFilter = (store: CarsSignalStore) => store.select(state => state.filters.transmission);
export const selectPriceRange = (store: CarsSignalStore) => store.select(state => ({
  minPrice: state.filters.minPrice,
  maxPrice: state.filters.maxPrice
}));
export const selectYearFilter = (store: CarsSignalStore) => store.select(state => state.filters.year);
export const selectSeatsFilter = (store: CarsSignalStore) => store.select(state => state.filters.seats);
export const selectFeaturesFilter = (store: CarsSignalStore) => store.select(state => state.filters.features);
export const selectAvailabilityFilter = (store: CarsSignalStore) => store.select(state => state.filters.availability);

// Pagination selectors
export const selectCurrentPage = (store: CarsSignalStore) => store.select(state => state.pagination.page);
export const selectPageSize = (store: CarsSignalStore) => store.select(state => state.pagination.limit);
export const selectTotalItems = (store: CarsSignalStore) => store.select(state => state.pagination.total);
export const selectTotalPages = (store: CarsSignalStore) => store.select(state => state.pagination.totalPages);
export const selectHasNextPage = (store: CarsSignalStore) => store.select(state => state.pagination.hasNext);
export const selectHasPrevPage = (store: CarsSignalStore) => store.select(state => state.pagination.hasPrev);

// Sorting selectors
export const selectSortField = (store: CarsSignalStore) => store.select(state => state.sorting.field);
export const selectSortDirection = (store: CarsSignalStore) => store.select(state => state.sorting.direction);

// Car-specific selectors
export const selectCarById = (carId: string) => (store: CarsSignalStore) =>
  createFindSelector(store.select(state => state.cars), car => car.id === carId);

export const selectFavoriteCars = (store: CarsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.cars),
    car => store.getState().favorites.includes(car.id)
  );

export const selectAvailableCars = (store: CarsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.cars),
    car => car.status === 'available'
  );

export const selectCarsByMake = (make: string) => (store: CarsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.cars),
    car => car.make.toLowerCase() === make.toLowerCase()
  );

export const selectCarsByLocation = (location: string) => (store: CarsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.cars),
    car => car.location.city.toLowerCase().includes(location.toLowerCase()) ||
           car.location.state.toLowerCase().includes(location.toLowerCase())
  );

export const selectCarsInPriceRange = (minPrice: number, maxPrice: number) => (store: CarsSignalStore) =>
  createFilteredSelector(
    store.select(state => state.cars),
    car => car.pricePerDay >= minPrice && car.pricePerDay <= maxPrice
  );

// Combined selectors
export const selectCarsStatus = (store: CarsSignalStore) => createCombinedSelector(
  [selectIsLoading(store), selectError(store), selectCars(store)],
  (...values: any[]) => {
    const [isLoading, error, cars] = values;
    return {
      isLoading,
      error,
      hasError: !!error,
      hasCars: cars.length > 0,
      carsCount: cars.length
    };
  }
);

export const selectPaginationInfo = (store: CarsSignalStore) => createCombinedSelector(
  [selectPagination(store), selectCars(store)],
  (...values: any[]) => {
    const [pagination, cars] = values;
    return {
      ...pagination,
      currentItems: cars.length,
      showing: `Showing ${pagination.page * pagination.limit - pagination.limit + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} cars`
    };
  }
);

export const selectFilterSummary = (store: CarsSignalStore) => createCombinedSelector(
  [selectFilters(store)],
  (filters) => {
    const activeFilters: string[] = [];

    if (filters.searchTerm) activeFilters.push(`Search: ${filters.searchTerm}`);
    if (filters.make) activeFilters.push(`Make: ${filters.make}`);
    if (filters.model) activeFilters.push(`Model: ${filters.model}`);
    if (filters.fuelType) activeFilters.push(`Fuel: ${filters.fuelType}`);
    if (filters.transmission) activeFilters.push(`Transmission: ${filters.transmission}`);
    if (filters.location) activeFilters.push(`Location: ${filters.location}`);
    if (filters.year > 0) activeFilters.push(`Year: ${filters.year}`);
    if (filters.seats > 0) activeFilters.push(`Seats: ${filters.seats}`);
    if (filters.minPrice > 0 || filters.maxPrice < 1000) activeFilters.push(`Price: $${filters.minPrice}-$${filters.maxPrice}`);
    if (filters.features.length > 0) activeFilters.push(`Features: ${filters.features.join(', ')}`);
    if (filters.availability.startDate && filters.availability.endDate) {
      activeFilters.push(`Available: ${filters.availability.startDate.toDateString()} - ${filters.availability.endDate.toDateString()}`);
    }

    return {
      filters,
      activeFilters,
      hasActiveFilters: activeFilters.length > 0,
      activeFiltersCount: activeFilters.length
    };
  }
);

export const selectCarDetails = (store: CarsSignalStore) => createCombinedSelector(
  [selectSelectedCar(store), selectFavorites(store)],
  (selectedCar, favorites) => ({
    car: selectedCar,
    isFavorite: selectedCar ? favorites.includes(selectedCar.id) : false,
    isAvailable: selectedCar?.status === 'available',
    hasImages: selectedCar ? selectedCar.images.length > 0 : false,
    rating: selectedCar?.rating || 0,
    reviewCount: selectedCar?.reviewCount || 0
  })
);

// Memoized selectors for performance
export const selectUniqueMakes = (store: CarsSignalStore) => store.select(
  state => Array.from(new Set(state.cars.map(car => car.make))).sort()
);

export const selectUniqueModels = (store: CarsSignalStore) => store.select(
  state => Array.from(new Set(state.cars.map(car => car.model))).sort()
);

export const selectUniqueLocations = (store: CarsSignalStore) => store.select(
  state => Array.from(new Set(state.cars.map(car => `${car.location.city}, ${car.location.state}`))).sort()
);

export const selectPriceRangeStats = (store: CarsSignalStore) => store.select(
  state => {
    if (state.cars.length === 0) return { min: 0, max: 0, avg: 0 };

    const prices = state.cars.map(car => car.pricePerDay);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
    };
  }
);

export const selectTopRatedCars = (store: CarsSignalStore) => store.select(
  state => state.cars
    .filter(car => car.rating >= 4.0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5)
);

export const selectRecentlyAddedCars = (store: CarsSignalStore) => store.select(
  state => state.cars
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
);

export const selectCheapestCars = (store: CarsSignalStore) => store.select(
  state => state.cars
    .sort((a, b) => a.pricePerDay - b.pricePerDay)
    .slice(0, 6)
);

// Search and filter helpers
export const selectFilteredCars = (store: CarsSignalStore) => store.select(
  state => {
    let filtered = [...state.cars];

    const { filters } = state;

    // Apply search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(car =>
        car.make.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        car.description?.toLowerCase().includes(searchLower) ||
        car.location.city.toLowerCase().includes(searchLower) ||
        car.location.state.toLowerCase().includes(searchLower)
      );
    }

    // Apply filters
    if (filters.make) {
      filtered = filtered.filter(car => car.make === filters.make);
    }
    if (filters.model) {
      filtered = filtered.filter(car => car.model === filters.model);
    }
    if (filters.fuelType) {
      filtered = filtered.filter(car => car.fuelType === filters.fuelType);
    }
    if (filters.transmission) {
      filtered = filtered.filter(car => car.transmission === filters.transmission);
    }
    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter(car =>
        car.location.city.toLowerCase().includes(locationLower) ||
        car.location.state.toLowerCase().includes(locationLower)
      );
    }
    if (filters.year > 0) {
      filtered = filtered.filter(car => car.year >= filters.year);
    }
    if (filters.seats > 0) {
      filtered = filtered.filter(car => car.seats >= filters.seats);
    }
    if (filters.minPrice > 0) {
      filtered = filtered.filter(car => car.pricePerDay >= filters.minPrice);
    }
    if (filters.maxPrice < 1000) {
      filtered = filtered.filter(car => car.pricePerDay <= filters.maxPrice);
    }
    if (filters.features.length > 0) {
      filtered = filtered.filter(car =>
        filters.features.every(feature => car.features.includes(feature))
      );
    }

    // Apply availability filter (simplified - in real app would check actual availability)
    if (filters.availability.startDate && filters.availability.endDate) {
      filtered = filtered.filter(car => car.status === 'available');
    }

    return filtered;
  }
);

export const selectSortedAndFilteredCars = (store: CarsSignalStore) => createCombinedSelector(
  [selectFilteredCars(store), selectSorting(store)],
  (...values: any[]) => {
    const [filteredCars, sorting] = values;
    const sorted = [...filteredCars].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sorting.field) {
        case 'price':
          aValue = a.pricePerDay;
          bValue = b.pricePerDay;
          break;
        case 'year':
          aValue = a.year;
          bValue = b.year;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
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
export const selectCacheEntry = (key: string) => (store: CarsSignalStore) =>
  store.select(state => state.cache[key]);

export const selectIsCacheValid = (key: string) => (store: CarsSignalStore) =>
  store.select(state => {
    const entry = state.cache[key];
    return entry && Date.now() <= entry.expiresAt;
  });