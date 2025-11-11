import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/ui/card/card.component';
import { CardHeaderComponent } from '../../../shared/components/ui/card/card-header.component';
import { CardTitleComponent } from '../../../shared/components/ui/card/card-title.component';
import { CardContentComponent } from '../../../shared/components/ui/card/card-content.component';
import { IconComponent } from '../../../shared/components/icons/icon.component';

interface DashboardStat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

interface RecentActivity {
  id: number;
  type: 'booking' | 'user' | 'car';
  description: string;
  time: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent, IconComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  stats: DashboardStat[] = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'users'
    },
    {
      title: 'Active Bookings',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive',
      icon: 'calendar'
    },
    {
      title: 'Available Cars',
      value: '456',
      change: '+3.1%',
      changeType: 'positive',
      icon: 'car'
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+15.3%',
      changeType: 'positive',
      icon: 'credit-card'
    }
  ];

  recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: 'booking',
      description: 'New booking for BMW X5 by John Doe',
      time: '2 minutes ago',
      icon: 'calendar'
    },
    {
      id: 2,
      type: 'user',
      description: 'Sarah Johnson registered as new user',
      time: '15 minutes ago',
      icon: 'plus'
    },
    {
      id: 3,
      type: 'car',
      description: 'Tesla Model 3 added to fleet',
      time: '1 hour ago',
      icon: 'car'
    },
    {
      id: 4,
      type: 'booking',
      description: 'Booking completed for Audi A4',
      time: '2 hours ago',
      icon: 'check-circle'
    }
  ];
}