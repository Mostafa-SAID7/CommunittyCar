import { Injectable, inject } from '@angular/core';
import { BaseSignalStore } from './base-signal-store';
import { CarsState, initialCarsState, CarFilters, CarSorting } from '../../state/cars/cars.state';
import { Car } from '../models/car.model';
import { CarApiService, CarSearchParams } from '../services/api/car-api.service';

/**
 * Cars signal store for managing car listings, filters, search, and car-related operations
 */
@Injectable({
  providedIn: 'root'
})
export class CarsSignalStore extends BaseSignalStore<CarsState> {
  private carApiService = inject(CarApiService);

  constructor() {
    super(initialCarsState);
  }

  /**
   * Reset cars state to initial values
   */
  reset(): void {
    this.setState(initialCarsState);
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

  // Car Listings Management
  /**
   * Load cars with optional search parameters
   */
  loadCars(params?: CarSearchParams): void {
    this.setLoading(true);
    this.clearError();

    this.carApiService.getCars(params).subscribe({
      next: (response) => {
        this.updateState(currentState => ({
          ...currentState,
          cars: response.cars,
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
        this.setError(error.message || 'Failed to load cars');
        this.setLoading(false);
      }
    });
  }

  /**
   * Load a single car by ID
   */
  loadCar(id: string): void {
    this.setLoading(true);
    this.clearError();

    this.carApiService.getCar(id).subscribe({
      next: (car) => {
        this.patchState({
          selectedCar: car,
          isLoading: false,
          error: null
        });
        this.addToRecentlyViewed(car);
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load car');
        this.setLoading(false);
      }
    });
  }

  /**
   * Set selected car
   */
  setSelectedCar(car: Car | null): void {
    this.patchState({ selectedCar: car });
    if (car) {
      this.addToRecentlyViewed(car);
    }
  }

  // Filter Management
  /**
   * Update filters
   */
  updateFilters(filters: Partial<CarFilters>): void {
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
      filters: initialCarsState.filters
    }));
  }

  /**
   * Set search term
   */
  setSearchTerm(searchTerm: string): void {
    this.updateFilters({ searchTerm });
  }

  /**
   * Set location filter
   */
  setLocation(location: string): void {
    this.updateFilters({ location });
  }

  /**
   * Set price range
   */
  setPriceRange(minPrice: number, maxPrice: number): void {
    this.updateFilters({ minPrice, maxPrice });
  }

  /**
   * Set availability dates
   */
  setAvailability(startDate: Date | null, endDate: Date | null): void {
    this.updateFilters({
      availability: { startDate, endDate }
    });
  }

  // Sorting Management
  /**
   * Update sorting
   */
  updateSorting(sorting: Partial<CarSorting>): void {
    this.updateState(currentState => ({
      ...currentState,
      sorting: { ...currentState.sorting, ...sorting }
    }));
  }

  /**
   * Set sort field
   */
  setSortField(field: CarSorting['field']): void {
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

  // Favorites Management
  /**
   * Toggle favorite status for a car
   */
  toggleFavorite(carId: string): void {
    this.carApiService.toggleFavorite(carId).subscribe({
      next: (response) => {
        this.updateState(currentState => ({
          ...currentState,
          favorites: response.isFavorite
            ? [...currentState.favorites, carId]
            : currentState.favorites.filter(id => id !== carId)
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to toggle favorite');
      }
    });
  }

  /**
   * Load user's favorite cars
   */
  loadFavorites(): void {
    this.carApiService.getFavorites().subscribe({
      next: (cars) => {
        this.updateState(currentState => ({
          ...currentState,
          favorites: cars.map(car => car.id)
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to load favorites');
      }
    });
  }

  /**
   * Check if a car is favorited
   */
  isFavorite(carId: string): boolean {
    const state = this.getState();
    return state.favorites.includes(carId);
  }

  // Recently Viewed Management
  /**
   * Add car to recently viewed
   */
  addToRecentlyViewed(car: Car): void {
    this.updateState(currentState => {
      const filtered = currentState.recentlyViewed.filter(c => c.id !== car.id);
      return {
        ...currentState,
        recentlyViewed: [car, ...filtered].slice(0, 10) // Keep only last 10
      };
    });
  }

  /**
   * Clear recently viewed cars
   */
  clearRecentlyViewed(): void {
    this.patchState({ recentlyViewed: [] });
  }

  // Search History Management
  /**
   * Add search term to history
   */
  addToSearchHistory(searchTerm: string): void {
    if (!searchTerm.trim()) return;

    this.updateState(currentState => {
      const filtered = currentState.searchHistory.filter(term => term !== searchTerm);
      return {
        ...currentState,
        searchHistory: [searchTerm, ...filtered].slice(0, 10) // Keep only last 10
      };
    });
  }

  /**
   * Clear search history
   */
  clearSearchHistory(): void {
    this.patchState({ searchHistory: [] });
  }

  // Car CRUD Operations
  /**
   * Add a new car
   */
  addCar(car: Omit<Car, 'id'>): void {
    this.setLoading(true);
    this.clearError();

    this.carApiService.addCar(car).subscribe({
      next: (newCar) => {
        this.updateState(currentState => ({
          ...currentState,
          cars: [newCar, ...currentState.cars],
          isLoading: false
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to add car');
        this.setLoading(false);
      }
    });
  }

  /**
   * Update an existing car
   */
  updateCar(id: string, updates: Partial<Car>): void {
    this.setLoading(true);
    this.clearError();

    this.carApiService.updateCar(id, updates).subscribe({
      next: (updatedCar) => {
        this.updateState(currentState => ({
          ...currentState,
          cars: currentState.cars.map(car => car.id === id ? updatedCar : car),
          selectedCar: currentState.selectedCar?.id === id ? updatedCar : currentState.selectedCar,
          isLoading: false
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to update car');
        this.setLoading(false);
      }
    });
  }

  /**
   * Delete a car
   */
  deleteCar(id: string): void {
    this.setLoading(true);
    this.clearError();

    this.carApiService.deleteCar(id).subscribe({
      next: () => {
        this.updateState(currentState => ({
          ...currentState,
          cars: currentState.cars.filter(car => car.id !== id),
          selectedCar: currentState.selectedCar?.id === id ? null : currentState.selectedCar,
          favorites: currentState.favorites.filter(favId => favId !== id),
          recentlyViewed: currentState.recentlyViewed.filter(car => car.id !== id),
          isLoading: false
        }));
      },
      error: (error) => {
        this.setError(error.message || 'Failed to delete car');
        this.setLoading(false);
      }
    });
  }

  // Cache Management
  /**
   * Cache search results
   */
  cacheResults(key: string, results: Car[], ttlMinutes: number = 5): void {
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
  getCachedResults(key: string): Car[] | null {
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