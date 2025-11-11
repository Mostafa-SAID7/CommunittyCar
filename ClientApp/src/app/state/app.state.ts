import { AuthState } from '../core/state/auth.state';
import { CarsState } from './cars/cars.state';
import { BookingsState } from './bookings/bookings.state';
import { UiState } from './ui/ui.state';

export interface AppState {
  auth: AuthState;
  ui: UiState;
  cars: CarsState;
  bookings: BookingsState;
}