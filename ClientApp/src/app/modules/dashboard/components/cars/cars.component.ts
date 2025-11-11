import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { Car } from '../../../../core/models/car.model';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cars-management">
      <div class="header">
        <h1 class="text-2xl font-bold text-gray-900">Cars Management</h1>
        <button class="btn-primary" (click)="addNewCar()">Add New Car</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Total Cars</h3>
          <p class="text-3xl font-bold text-blue-600">{{ totalCars }}</p>
        </div>
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Available Cars</h3>
          <p class="text-3xl font-bold text-green-600">{{ availableCars }}</p>
        </div>
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Booked Cars</h3>
          <p class="text-3xl font-bold text-orange-600">{{ bookedCars }}</p>
        </div>
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Revenue</h3>
          <p class="text-3xl font-bold text-purple-600">{{ totalRevenue }}</p>
        </div>
      </div>

      <div class="filters">
        <input type="text" placeholder="Search cars..." class="search-input" [(ngModel)]="searchTerm">
        <select class="filter-select" [(ngModel)]="selectedMake">
          <option value="">All Makes</option>
          <option *ngFor="let make of makes" [value]="make">{{ make }}</option>
        </select>
        <select class="filter-select" [(ngModel)]="selectedStatus">
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>

      <div class="cars-grid">
        <div class="car-card" *ngFor="let car of filteredCars">
          <div class="car-image">
            <img [src]="car.images?.[0] || '/assets/images/car-placeholder.jpg'" [alt]="car.make + ' ' + car.model">
            <div class="car-status" [ngClass]="getStatusClass(car.status)">
              {{ car.status | titlecase }}
            </div>
          </div>
          <div class="car-info">
            <h3 class="car-title">{{ car.year }} {{ car.make }} {{ car.model }}</h3>
            <div class="car-details">
              <span class="detail-item">
                <i class="fas fa-users"></i> {{ car.seats }} seats
              </span>
              <span class="detail-item">
                <i class="fas fa-gas-pump"></i> {{ car.fuelType }}
              </span>
              <span class="detail-item">
                <i class="fas fa-cog"></i> {{ car.transmission }}
              </span>
            </div>
            <div class="car-price">
              <span class="price">{{ car.pricePerDay }}/day</span>
              <span class="location">{{ car.location.city }}, {{ car.location.state }}</span>
            </div>
            <div class="car-actions">
              <button class="btn-secondary" (click)="viewCar(car)">View</button>
              <button class="btn-secondary" (click)="editCar(car)">Edit</button>
              <button class="btn-danger" (click)="deleteCar(car)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cars-management {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
    }

    .btn-secondary {
      background: #6b7280;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      border: none;
      cursor: pointer;
      margin-right: 0.5rem;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      border: none;
      cursor: pointer;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .search-input, .filter-select {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
    }

    .cars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .car-card {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.2s;
    }

    .car-card:hover {
      transform: translateY(-2px);
    }

    .car-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .car-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .car-status {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: white;
    }

    .car-status.available {
      background: #10b981;
    }

    .car-status.booked {
      background: #f59e0b;
    }

    .car-status.maintenance {
      background: #ef4444;
    }

    .car-info {
      padding: 1rem;
    }

    .car-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .car-details {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .car-price {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .price {
      font-size: 1.125rem;
      font-weight: 600;
      color: #3b82f6;
    }

    .location {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .car-actions {
      display: flex;
      gap: 0.5rem;
    }
  `]
})
export class CarsComponent implements OnInit {
  cars: Car[] = [];
  searchTerm = '';
  selectedMake = '';
  selectedStatus = '';
  totalCars = 0;
  availableCars = 0;
  bookedCars = 0;
  totalRevenue = 0;
  makes: string[] = [];

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    // Mock data - replace with actual API call
    this.cars = [
      {
        id: '1',
        ownerId: 'owner1',
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        color: 'White',
        licensePlate: 'ABC123',
        mileage: 15000,
        pricePerDay: 45,
        fuelType: 'petrol',
        transmission: 'automatic',
        seats: 5,
        location: {
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          latitude: 40.7128,
          longitude: -74.0060
        },
        status: 'available',
        images: ['/assets/images/cars/toyota-camry.jpg'],
        features: ['AC', 'Bluetooth', 'GPS'],
        availability: [],
        rating: 4.5,
        reviewCount: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        ownerId: 'owner2',
        make: 'Honda',
        model: 'Civic',
        year: 2023,
        color: 'Blue',
        licensePlate: 'XYZ789',
        mileage: 8000,
        pricePerDay: 40,
        fuelType: 'petrol',
        transmission: 'manual',
        seats: 5,
        location: {
          address: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA',
          latitude: 34.0522,
          longitude: -118.2437
        },
        status: 'booked',
        images: ['/assets/images/cars/honda-civic.jpg'],
        features: ['AC', 'Bluetooth'],
        availability: [],
        rating: 4.2,
        reviewCount: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    this.totalCars = this.cars.length;
    this.availableCars = this.cars.filter(c => c.status === 'available').length;
    this.bookedCars = this.cars.filter(c => c.status === 'booked').length;
    this.totalRevenue = this.cars.reduce((sum, car) => sum + car.pricePerDay, 0);
    this.makes = [...new Set(this.cars.map(c => c.make))];
  }

  get filteredCars(): Car[] {
    return this.cars.filter(car => {
      const matchesSearch = !this.searchTerm ||
        car.make.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesMake = !this.selectedMake || car.make === this.selectedMake;
      const matchesStatus = !this.selectedStatus || car.status === this.selectedStatus;

      return matchesSearch && matchesMake && matchesStatus;
    });
  }

  addNewCar(): void {
    this.router.navigate(['/admin/cars/add']);
  }

  viewCar(car: Car): void {
    this.router.navigate(['/admin/cars', car.id]);
  }

  editCar(car: Car): void {
    this.router.navigate(['/admin/cars', car.id, 'edit']);
  }

  deleteCar(car: Car): void {
    if (confirm('Are you sure you want to delete this car?')) {
      this.notificationService.showSuccess('Car deleted successfully');
      this.loadCars();
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }
}