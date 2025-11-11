import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Booking } from '../../models/booking.model';
import { environment } from '../../../../environments/environment';

export interface BookingSearchParams {
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  carId?: string;
  userId?: string;
  paymentStatus?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BookingListResponse {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statistics?: {
    totalBookings: number;
    totalRevenue: number;
    activeBookings: number;
    completedBookings: number;
    cancelledBookings: number;
  };
}

export interface CreateBookingRequest {
  carId: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  dropoffLocation: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  specialRequests?: string;
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingApiService {
  private readonly apiUrl = `${environment.apiUrl}/Bookings`;

  constructor(private http: HttpClient) {}

  getBookings(params?: BookingSearchParams): Observable<BookingListResponse> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof BookingSearchParams];
        if (value !== undefined && value !== null) {
          if (typeof value === 'object' && 'start' in value) {
            // Handle dateRange object
            const dateRange = value as { start: Date; end: Date };
            httpParams = httpParams.set('startDate', dateRange.start.toISOString());
            httpParams = httpParams.set('endDate', dateRange.end.toISOString());
          } else if (typeof value === 'object' && (value as any) instanceof Date) {
            httpParams = httpParams.set(key, (value as Date).toISOString());
          } else {
            httpParams = httpParams.set(key, String(value));
          }
        }
      });
    }

    return this.http.get<BookingListResponse>(`${this.apiUrl}`, { params: httpParams });
  }

  getBooking(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  createBooking(bookingData: CreateBookingRequest): Observable<{ success: boolean; message: string; booking?: Booking; paymentUrl?: string }> {
    return this.http.post<{ success: boolean; message: string; booking?: Booking; paymentUrl?: string }>(`${this.apiUrl}`, bookingData);
  }

  updateBooking(id: string, bookingData: Partial<Booking>): Observable<{ success: boolean; message: string; booking?: Booking }> {
    return this.http.put<{ success: boolean; message: string; booking?: Booking }>(`${this.apiUrl}/${id}`, bookingData);
  }

  cancelBooking(id: string, reason?: string): Observable<{ success: boolean; message: string }> {
    const params = reason ? new HttpParams().set('reason', reason) : new HttpParams();
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`, { params });
  }

  confirmBooking(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/${id}/confirm`, {});
  }

  extendBooking(id: string, newEndDate: Date): Observable<{ success: boolean; message: string; booking?: Booking }> {
    return this.http.post<{ success: boolean; message: string; booking?: Booking }>(`${this.apiUrl}/${id}/extend`, { newEndDate: newEndDate.toISOString() });
  }

  getBookingHistory(userId?: string, page: number = 1, limit: number = 10): Observable<BookingListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (userId) {
      params.set('userId', userId);
    }

    return this.http.get<BookingListResponse>(`${this.apiUrl}/history`, { params });
  }

  getUpcomingBookings(userId?: string): Observable<Booking[]> {
    const params = userId ? new HttpParams().set('userId', userId) : new HttpParams();
    return this.http.get<Booking[]>(`${this.apiUrl}/upcoming`, { params });
  }

  getActiveBookings(userId?: string): Observable<Booking[]> {
    const params = userId ? new HttpParams().set('userId', userId) : new HttpParams();
    return this.http.get<Booking[]>(`${this.apiUrl}/active`, { params });
  }

  calculateBookingPrice(carId: string, startDate: Date, endDate: Date): Observable<{ totalPrice: number; pricePerDay: number; totalDays: number; taxes: number; fees: number }> {
    const params = new HttpParams()
      .set('carId', carId)
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<{ totalPrice: number; pricePerDay: number; totalDays: number; taxes: number; fees: number }>(`${this.apiUrl}/calculate-price`, { params });
  }

  processPayment(bookingId: string, paymentData: any): Observable<{ success: boolean; message: string; transactionId?: string }> {
    return this.http.post<{ success: boolean; message: string; transactionId?: string }>(`${this.apiUrl}/${bookingId}/payment`, paymentData);
  }

  getPaymentStatus(bookingId: string): Observable<{ status: string; transactionId?: string; amount?: number }> {
    return this.http.get<{ status: string; transactionId?: string; amount?: number }>(`${this.apiUrl}/${bookingId}/payment-status`);
  }

  addBookingReview(bookingId: string, review: { rating: number; comment: string }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/${bookingId}/review`, review);
  }

  getBookingStatistics(userId?: string): Observable<{
    totalBookings: number;
    totalSpent: number;
    activeBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    averageRating: number;
  }> {
    const params = userId ? new HttpParams().set('userId', userId) : new HttpParams();
    return this.http.get<{
      totalBookings: number;
      totalSpent: number;
      activeBookings: number;
      completedBookings: number;
      cancelledBookings: number;
      averageRating: number;
    }>(`${this.apiUrl}/statistics`, { params });
  }
}