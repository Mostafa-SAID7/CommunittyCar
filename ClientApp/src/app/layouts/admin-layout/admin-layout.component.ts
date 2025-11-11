import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationCenterComponent } from '../../shared/components/notification-center/notification-center.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NotificationCenterComponent],
  templateUrl: './admin-layout.component.html',

})
export class AdminLayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.showSuccess('Logged out successfully');
    this.router.navigate(['/auth/login']);
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'A';
    return `${this.currentUser.firstName?.charAt(0) || ''}${this.currentUser.lastName?.charAt(0) || ''}`.toUpperCase();
  }
}

