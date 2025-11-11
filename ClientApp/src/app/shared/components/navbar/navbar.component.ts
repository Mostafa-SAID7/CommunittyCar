import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  currentTheme: string = 'light';
  isUserMenuOpen = false;
  isMobileMenuOpen = false;
  isNotificationMenuOpen = false;

  // Mock notifications data
  notifications = [
    {
      id: 1,
      title: 'Booking Confirmed',
      message: 'Your booking for Toyota Camry has been confirmed.',
      time: '2 minutes ago',
      read: false,
      type: 'success'
    },
    {
      id: 2,
      title: 'Payment Received',
      message: 'Payment of $45.00 has been processed successfully.',
      time: '1 hour ago',
      read: false,
      type: 'info'
    },
    {
      id: 3,
      title: 'Car Returned',
      message: 'Honda Civic has been successfully returned.',
      time: '2 hours ago',
      read: true,
      type: 'success'
    },
    {
      id: 4,
      title: 'New Message',
      message: 'You have a new message from support.',
      time: '1 day ago',
      read: true,
      type: 'warning'
    }
  ];

  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
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

  getDropdownClasses(): { [key: string]: boolean } {
    return {
      'open': this.isUserMenuOpen,
      [this.currentTheme]: true
    };
  }

  get unreadNotificationsCount(): number {
    return this.notifications.filter(notification => !notification.read).length;
  }

  toggleNotificationMenu(): void {
    this.isNotificationMenuOpen = !this.isNotificationMenuOpen;
    this.isUserMenuOpen = false; // Close user menu if open
  }

  markNotificationAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  markAllNotificationsAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'notifications';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  }
}
