import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarApiService } from '../../../core/services/api/car-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Car } from '../../../core/models/car.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './car-details.component.html'
})
export class CarDetailsComponent implements OnInit {
  car: Car | null = null;
  isLoading = false;
  selectedImageIndex = 0;
  bookingDates = {
    startDate: '',
    endDate: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carApi: CarApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const carId = this.route.snapshot.params['id'];
    if (carId) {
      this.loadCarDetails(carId);
    }
  }

  private loadCarDetails(carId: string): void {
    this.isLoading = true;
    this.carApi.getCar(carId).subscribe({
      next: (car: Car) => {
        this.car = car;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load car details');
        this.isLoading = false;
        this.router.navigate(['/cars']);
      }
    });
  }

  onImageSelect(index: number): void {
    this.selectedImageIndex = index;
  }

  onBookNow(): void {
    if (!this.bookingDates.startDate || !this.bookingDates.endDate) {
      this.notificationService.showWarning('Please select booking dates');
      return;
    }

    // Navigate to booking with car details
    this.router.navigate(['/bookings/new'], {
      queryParams: {
        carId: this.car?.id,
        startDate: this.bookingDates.startDate,
        endDate: this.bookingDates.endDate
      }
    });
  }

  onContactOwner(): void {
    // Open chat or contact form
    this.notificationService.showInfo('Contact feature coming soon!');
  }

  onShare(): void {
    if (navigator.share) {
      navigator.share({
        title: `${this.car?.make} ${this.car?.model}`,
        text: `Check out this ${this.car?.make} ${this.car?.model} on Community Car`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      this.notificationService.showSuccess('Link copied to clipboard');
    }
  }

  getTotalPrice(): number {
    if (!this.bookingDates.startDate || !this.bookingDates.endDate || !this.car) {
      return 0;
    }

    const start = new Date(this.bookingDates.startDate);
    const end = new Date(this.bookingDates.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return days * this.car.pricePerDay;
  }

  trackByImageUrl(index: number, image: string): string {
    return image;
  }

  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  onBackToCars(): void {
    this.router.navigate(['/cars']);
  }
}
