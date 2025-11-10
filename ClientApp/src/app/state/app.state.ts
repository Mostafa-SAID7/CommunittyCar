import { AuthState } from './auth/auth.state';
import { CarsState } from './cars/cars.state';
import { BookingsState } from './bookings/bookings.state';

export interface AppState {
  auth: AuthState;
  cars: CarsState;
  bookings: BookingsState;
}