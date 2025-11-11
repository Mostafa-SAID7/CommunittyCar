import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bookings-management">
      <div class="header">
        <h1 class="text-2xl font-bold text-gray-900">Bookings Management</h1>
        <button class="btn-primary">Export Report</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Total Bookings</h3>
          <p class="text-3xl font-bold text-blue-600">{{ totalBookings }}</p>
        </div>
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Active Bookings</h3>
          <p class="text-3xl font-bold text-green-600">{{ activeBookings }}</p>
        </div>
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Completed</h3>
          <p class="text-3xl font-bold text-purple-600">{{ completedBookings }}</p>
        </div>
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Revenue</h3>
          <p class="text-3xl font-bold text-orange-600">{{ totalRevenue }}</p>
        </div>
      </div>

      <div class="filters">
        <input type="text" placeholder="Search bookings..." class="search-input">
        <select class="filter-select">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input type="date" class="filter-input" placeholder="From Date">
        <input type="date" class="filter-input" placeholder="To Date">
      </div>

      <div class="bookings-table">
        <table class="w-full">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Car</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let booking of bookings">
              <td>#{{ booking.id.slice(-8) }}</td>
              <td>{{ booking.userId }}</td>
              <td>{{ booking.carId }}</td>
              <td>
                <div>{{ booking.startDate | date:'shortDate' }}</div>
                <div class="text-sm text-gray-500">to {{ booking.endDate | date:'shortDate' }}</div>
              </td>
              <td>
                <span class="status-badge" [ngClass]="getStatusClass(booking.status)">
                  {{ booking.status | titlecase }}
                </span>
              </td>
              <td>
                <span class="payment-badge" [ngClass]="getPaymentClass(booking.paymentStatus)">
                  {{ booking.paymentStatus | titlecase }}
                </span>
              </td>
              <td>{{ booking.totalPrice }}</td>
              <td>
                <button class="btn-secondary" (click)="viewBooking(booking)">View</button>
                <button class="btn-secondary" (click)="editBooking(booking)">Edit</button>
                <button class="btn-danger" (click)="cancelBooking(booking)" *ngIf="booking.status !== 'cancelled' && booking.status !== 'completed'">
                  Cancel
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .bookings-management {
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

    .search-input, .filter-select, .filter-input {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
    }

    .bookings-table {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background: #f9fafb;
      font-weight: 600;
    }

    .status-badge, .payment-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge.confirmed {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.completed {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.cancelled {
      background: #fee2e2;
      color: #991b1b;
    }

    .payment-badge.pending {
      background: #fef3c7;
      color: #92400e;
    }

    .payment-badge.paid {
      background: #d1fae5;
      color: #065f46;
    }

    .payment-badge.refunded {
      background: #dbeafe;
      color: #1e40af;
    }
  `]
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  totalBookings = 0;
  activeBookings = 0;
  completedBookings = 0;
  totalRevenue = 0;

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    // Mock data - replace with actual API call
    this.bookings = [
      {
        id: 'booking-001',
        userId: 'user-123',
        carId: 'car-456',
        startDate: new Date('2024-11-15'),
        endDate: new Date('2024-11-18'),
        totalDays: 3,
        totalPrice: 135,
        status: 'confirmed',
        paymentStatus: 'paid',
        pickupLocation: {
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          latitude: 40.7128,
          longitude: -74.0060
        },
        dropoffLocation: {
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
          latitude: 40.7128,
          longitude: -74.0060
        },
        createdAt: new Date('2024-11-10'),
        updatedAt: new Date('2024-11-10')
      },
      {
        id: 'booking-002',
        userId: 'user-456',
        carId: 'car-789',
        startDate: new Date('2024-11-20'),
        endDate: new Date('2024-11-22'),
        totalDays: 2,
        totalPrice: 80,
        status: 'active',
        paymentStatus: 'paid',
        pickupLocation: {
          address: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA',
          latitude: 34.0522,
          longitude: -118.2437
        },
        dropoffLocation: {
          address: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA',
          latitude: 34.0522,
          longitude: -118.2437
        },
        createdAt: new Date('2024-11-12'),
        updatedAt: new Date('2024-11-12')
      }
    ];
    this.totalBookings = this.bookings.length;
    this.activeBookings = this.bookings.filter(b => b.status === 'active').length;
    this.completedBookings = this.bookings.filter(b => b.status === 'completed').length;
    this.totalRevenue = this.bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  }

  viewBooking(booking: Booking): void {
    this.router.navigate(['/admin/bookings', booking.id]);
  }

  editBooking(booking: Booking): void {
    this.router.navigate(['/admin/bookings', booking.id, 'edit']);
  }

  cancelBooking(booking: Booking): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.notificationService.showSuccess('Booking cancelled successfully');
      this.loadBookings();
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getPaymentClass(status: string): string {
    return status.toLowerCase();
  }
}