import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarApiService } from '../../../core/services/api/car-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Car } from '../../../core/models/car.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-browse-cars',
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './browse-cars.component.html',
  styleUrl: './browse-cars.component.scss'
})
export class BrowseCarsComponent implements OnInit {
  featuredCars: Car[] = [];
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
    this.loadFeaturedCars();
  }

  loadFeaturedCars(): void {
    this.isLoading = true;
    this.carApi.getCars().subscribe({
      next: (response) => {
        this.featuredCars = response.cars.slice(0, 6); // Show first 6 as featured
        this.isLoading = false;
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load featured cars');
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    // Navigate to car-list with search params
    this.router.navigate(['/cars'], { queryParams: { search: this.searchTerm } });
  }

  onFilter(): void {
    // Navigate to car-list with filter params
    const params = {
      make: this.selectedFilters.make,
      model: this.selectedFilters.model,
      fuelType: this.selectedFilters.fuelType,
      transmission: this.selectedFilters.transmission,
      minPrice: this.selectedFilters.minPrice,
      maxPrice: this.selectedFilters.maxPrice
    };
    this.router.navigate(['/cars'], { queryParams: params });
  }

  onViewDetails(car: Car): void {
    this.router.navigate(['/cars', car.id]);
  }

  onBookCar(car: Car): void {
    this.router.navigate(['/bookings/new'], { queryParams: { carId: car.id } });
  }

  browseAllCars(): void {
    this.router.navigate(['/cars']);
  }

  trackByCar(index: number, car: Car): string {
    return car.id;
  }
}
