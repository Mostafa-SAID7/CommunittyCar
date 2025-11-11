import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  // Mock data for dashboard stats
  stats = {
    totalCars: 0,
    activeBookings: 0,
    revenue: 0,
    reviews: 0
  };

  recentActivity: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Load dashboard data (would be from API in real app)
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Mock data loading - replace with actual API calls
    this.stats = {
      totalCars: 15,
      activeBookings: 8,
      revenue: 2450,
      reviews: 42
    };

    this.recentActivity = [
      { type: 'booking', message: 'New booking for Toyota Camry', time: '2 hours ago' },
      { type: 'review', message: 'New 5-star review received', time: '4 hours ago' },
      { type: 'car', message: 'Honda Civic added to fleet', time: '1 day ago' }
    ];
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        // Navigation handled by auth service
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }

  getUserInitials(): string {
    if (this.currentUser?.name) {
      return this.currentUser.name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
    }
    return 'U';
  }

  trackByActivity(index: number, activity: any): any {
    return activity.message + activity.time;
  }
}
