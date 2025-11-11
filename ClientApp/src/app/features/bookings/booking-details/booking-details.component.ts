import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingApiService } from '../../../core/services/api/booking-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Booking } from '../../../core/models/booking.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { IconComponent } from '../../../shared/components/icons/icon.component';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, IconComponent]
})
export class BookingDetailsComponent implements OnInit {
  booking: Booking | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private bookingApi: BookingApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.params['id'];
    if (bookingId) {
      this.loadBookingDetails(bookingId);
    }
  }

  private loadBookingDetails(bookingId: string): void {
    this.isLoading = true;
    this.bookingApi.getBooking(bookingId).subscribe({
      next: (booking: Booking) => {
        this.booking = booking;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load booking details');
        this.isLoading = false;
        this.router.navigate(['/bookings']);
      }
    });
  }

  onCancelBooking(): void {
    if (!this.booking) return;

    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingApi.cancelBooking(this.booking.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Booking cancelled successfully');
          this.router.navigate(['/bookings']);
        },
        error: (error) => {
          this.notificationService.showError('Failed to cancel booking');
        }
      });
    }
  }

  onContactSupport(): void {
    this.notificationService.showInfo('Support chat will be available soon!');
  }

  onDownloadReceipt(): void {
    this.notificationService.showInfo('Receipt download feature coming soon!');
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
}
