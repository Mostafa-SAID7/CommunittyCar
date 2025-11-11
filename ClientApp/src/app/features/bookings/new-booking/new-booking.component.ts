import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarApiService } from '../../../core/services/api/car-api.service';
import { BookingApiService } from '../../../core/services/api/booking-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Car } from '../../../core/models/car.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-new-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './new-booking.component.html',

})
export class NewBookingComponent implements OnInit {
  car: Car | null = null;
  bookingForm: FormGroup;
  isLoading = false;
  totalPrice = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private carApi: CarApiService,
    private bookingApi: BookingApiService,
    private notificationService: NotificationService
  ) {
    this.bookingForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      pickupLocation: this.fb.group({
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required]
      }),
      dropoffLocation: this.fb.group({
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required]
      }),
      specialRequests: ['']
    });
  }

  ngOnInit(): void {
    const carId = this.route.snapshot.queryParams['carId'];
    const startDate = this.route.snapshot.queryParams['startDate'];
    const endDate = this.route.snapshot.queryParams['endDate'];

    if (carId) {
      this.loadCar(carId);
    }

    if (startDate) {
      this.bookingForm.patchValue({ startDate });
    }

    if (endDate) {
      this.bookingForm.patchValue({ endDate });
    }

    // Calculate total price when dates change
    this.bookingForm.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    });
  }

  private loadCar(carId: string): void {
    this.isLoading = true;
    this.carApi.getCar(carId).subscribe({
      next: (car: Car) => {
        this.car = car;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load car details');
        this.router.navigate(['/cars']);
      }
    });
  }

  private calculateTotalPrice(): void {
    if (!this.car || !this.bookingForm.value.startDate || !this.bookingForm.value.endDate) {
      this.totalPrice = 0;
      return;
    }

    const start = new Date(this.bookingForm.value.startDate);
    const end = new Date(this.bookingForm.value.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (days > 0) {
      this.totalPrice = days * this.car.pricePerDay;
    } else {
      this.totalPrice = 0;
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid && this.car) {
      this.isLoading = true;

      const bookingData = {
        carId: this.car.id,
        ...this.bookingForm.value,
        totalPrice: this.totalPrice,
        totalDays: this.getTotalDays()
      };

      this.bookingApi.createBooking(bookingData).subscribe({
        next: (response: any) => {
          this.notificationService.showSuccess('Booking created successfully!');
          this.router.navigate(['/bookings', response.booking?.id || response.id]);
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to create booking. Please try again.');
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private getTotalDays(): number {
    if (!this.bookingForm.value.startDate || !this.bookingForm.value.endDate) {
      return 0;
    }

    const start = new Date(this.bookingForm.value.startDate);
    const end = new Date(this.bookingForm.value.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.bookingForm.controls).forEach(key => {
      const control = this.bookingForm.get(key);
      control?.markAsTouched();
    });
  }

  onBack(): void {
    this.router.navigate(['/cars']);
  }

  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMinEndDate(): string {
    return this.bookingForm.value.startDate || this.getMinDate();
  }

  onSameLocationChange(event: any): void {
    if (event.target.checked) {
      const pickupLocation = this.bookingForm.get('pickupLocation')?.value;
      this.bookingForm.get('dropoffLocation')?.setValue(pickupLocation);
    }
  }

  get totalDays(): number {
    return this.getTotalDays();
  }
}

