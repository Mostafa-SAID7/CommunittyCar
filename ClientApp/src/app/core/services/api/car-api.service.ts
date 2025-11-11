import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Car } from '../../models/car.model';
import { environment } from '../../../../environments/environment';

export interface CarSearchParams {
  searchTerm?: string;
  make?: string;
  model?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  year?: number;
  seats?: number;
  features?: string[];
  availability?: {
    startDate: Date;
    endDate: Date;
  };
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CarListResponse {
  cars: Car[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarApiService {
  private readonly apiUrl = `${environment.apiUrl}/Cars`;

  constructor(private http: HttpClient) {}

  getCars(params?: CarSearchParams): Observable<CarListResponse> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof CarSearchParams];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            httpParams = httpParams.set(key, value.join(','));
          } else if (typeof value === 'object' && value instanceof Date) {
            httpParams = httpParams.set(key, value.toISOString());
          } else if (typeof value === 'object' && 'startDate' in value) {
            // Handle availability object
            const availability = value as { startDate: Date; endDate: Date };
            httpParams = httpParams.set('startDate', availability.startDate.toISOString());
            httpParams = httpParams.set('endDate', availability.endDate.toISOString());
          } else {
            httpParams = httpParams.set(key, value.toString());
          }
        }
      });
    }

    return this.http.get<CarListResponse>(`${this.apiUrl}`, { params: httpParams });
  }

  getCar(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`);
  }

  addCar(car: Omit<Car, 'id'>): Observable<Car> {
    return this.http.post<Car>(`${this.apiUrl}`, car);
  }

  updateCar(id: string, car: Partial<Car>): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, car);
  }

  deleteCar(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }

  uploadCarImages(id: string, images: File[]): Observable<{ success: boolean; message: string; urls?: string[] }> {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    return this.http.post<{ success: boolean; message: string; urls?: string[] }>(`${this.apiUrl}/${id}/upload-images`, formData);
  }

  getCarAvailability(id: string, startDate: Date, endDate: Date): Observable<{ available: boolean; conflictingBookings?: any[] }> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http.get<{ available: boolean; conflictingBookings?: any[] }>(`${this.apiUrl}/${id}/availability`, { params });
  }

  getCarReviews(id: string, page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get(`${this.apiUrl}/${id}/reviews`, { params });
  }

  addCarReview(id: string, review: { rating: number; comment: string }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/${id}/reviews`, review);
  }

  getMakes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/makes`);
  }

  getModels(make: string): Observable<string[]> {
    const params = new HttpParams().set('make', make);
    return this.http.get<string[]>(`${this.apiUrl}/models`, { params });
  }

  getPopularLocations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/popular-locations`);
  }

  toggleFavorite(id: string): Observable<{ success: boolean; message: string; isFavorite: boolean }> {
    return this.http.post<{ success: boolean; message: string; isFavorite: boolean }>(`${this.apiUrl}/${id}/favorite`, {});
  }

  getFavorites(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/favorites`);
  }
}