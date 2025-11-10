import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Car } from '../../models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarApiService {
  constructor(private http: HttpClient) {}

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>('/api/cars');
  }

  getCar(id: string): Observable<Car> {
    return this.http.get<Car>(`/api/cars/${id}`);
  }

  addCar(car: Omit<Car, 'id'>): Observable<Car> {
    return this.http.post<Car>('/api/cars', car);
  }

  updateCar(id: string, car: Partial<Car>): Observable<Car> {
    return this.http.put<Car>(`/api/cars/${id}`, car);
  }

  deleteCar(id: string): Observable<void> {
    return this.http.delete<void>(`/api/cars/${id}`);
  }
}