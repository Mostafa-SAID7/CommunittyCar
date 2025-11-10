import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingApiService {
  constructor(private http: HttpClient) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>('/api/bookings');
  }

  getBooking(id: string): Observable<Booking> {
    return this.http.get<Booking>(`/api/bookings/${id}`);
  }

  createBooking(booking: Omit<Booking, 'id'>): Observable<Booking> {
    return this.http.post<Booking>('/api/bookings', booking);
  }

  updateBooking(id: string, booking: Partial<Booking>): Observable<Booking> {
    return this.http.put<Booking>(`/api/bookings/${id}`, booking);
  }

  cancelBooking(id: string): Observable<void> {
    return this.http.delete<void>(`/api/bookings/${id}`);
  }
}