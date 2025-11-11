import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarApiService } from '../../../core/services/api/car-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Car } from '../../../core/models/car.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent]
})
export class CarListComponent implements OnInit {
  cars: Car[] = [];
  isLoading = false;
  searchTerm = '';
  selectedFilters = {
    make: '',
    model: '',
    fuelType: '',
    transmission: '',
    minPrice: 0,
    maxPrice: 1000
  };

  constructor(
    private carApi: CarApiService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.isLoading = true;
    this.carApi.getCars().subscribe({
      next: (response: any) => {
        this.cars = response.cars || response;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load cars');
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    // Implement search functionality
    this.loadCars();
  }

  onFilter(): void {
    // Implement filter functionality
    this.loadCars();
  }

  onViewDetails(car: Car): void {
    this.router.navigate(['/cars', car.id]);
  }

  onBookCar(car: Car): void {
    this.router.navigate(['/bookings/new'], { queryParams: { carId: car.id } });
  }

  get filteredCars(): Car[] {
    return this.cars.filter(car => {
      const matchesSearch = !this.searchTerm ||
        car.make.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesFilters =
        (!this.selectedFilters.make || car.make === this.selectedFilters.make) &&
        (!this.selectedFilters.model || car.model === this.selectedFilters.model) &&
        (!this.selectedFilters.fuelType || car.fuelType === this.selectedFilters.fuelType) &&
        (!this.selectedFilters.transmission || car.transmission === this.selectedFilters.transmission) &&
        car.pricePerDay >= this.selectedFilters.minPrice &&
        car.pricePerDay <= this.selectedFilters.maxPrice;

      return matchesSearch && matchesFilters;
    });
  }
}