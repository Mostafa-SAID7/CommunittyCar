import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BookingApiService } from '../../../core/services/api/booking-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Booking } from '../../../core/models/booking.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent]
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading = false;
  activeTab: 'upcoming' | 'completed' | 'cancelled' = 'upcoming';

  constructor(
    private bookingApi: BookingApiService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingApi.getBookings().subscribe({
      next: (response) => {
        this.bookings = response.bookings;
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load bookings');
        this.isLoading = false;
      }
    });
  }

  get filteredBookings(): Booking[] {
    return this.bookings.filter(booking => {
      switch (this.activeTab) {
        case 'upcoming':
          return ['pending', 'confirmed', 'active'].includes(booking.status);
        case 'completed':
          return booking.status === 'completed';
        case 'cancelled':
          return booking.status === 'cancelled';
        default:
          return true;
      }
    });
  }

  onViewDetails(booking: Booking): void {
    this.router.navigate(['/bookings', booking.id]);
  }

  onCancelBooking(booking: Booking): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingApi.cancelBooking(booking.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Booking cancelled successfully');
          this.loadBookings();
        },
        error: (error) => {
          this.notificationService.showError('Failed to cancel booking');
        }
      });
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  trackByBooking(index: number, booking: Booking): string {
    return booking.id;
  }
}