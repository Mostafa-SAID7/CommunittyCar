import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

interface ReportData {
  period: string;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  newUsers: number;
  carUtilization: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-management">
      <div class="header">
        <h1 class="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div class="header-actions">
          <select class="period-select" [(ngModel)]="selectedPeriod">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button class="btn-primary" (click)="exportReport()">Export Report</button>
        </div>
      </div>

      <div class="stats-overview">
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Total Revenue</h3>
          <p class="text-3xl font-bold text-green-600">{{ totalRevenue }}</p>
          <span class="change positive">+12.5% from last period</span>
        </div>
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Total Bookings</h3>
          <p class="text-3xl font-bold text-blue-600">{{ totalBookings }}</p>
          <span class="change positive">+8.2% from last period</span>
        </div>
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Active Users</h3>
          <p class="text-3xl font-bold text-purple-600">{{ activeUsers }}</p>
          <span class="change positive">+15.3% from last period</span>
        </div>
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Car Utilization</h3>
          <p class="text-3xl font-bold text-orange-600">{{ carUtilization }}%</p>
          <span class="change negative">-2.1% from last period</span>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <h3 class="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div class="chart-placeholder">
            <div class="chart-bar" *ngFor="let data of revenueData; let i = index"
                 [style.height.%]="data.value"
                 [style.animation-delay.ms]="i * 100">
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3 class="text-lg font-semibold mb-4">Booking Status Distribution</h3>
          <div class="pie-chart">
            <div class="pie-segment" *ngFor="let segment of bookingStatusData"
                 [style.background]="segment.color"
                 [style.transform]="'rotate(' + segment.rotation + 'deg)'">
            </div>
          </div>
          <div class="legend">
            <div class="legend-item" *ngFor="let segment of bookingStatusData">
              <div class="legend-color" [style.background]="segment.color"></div>
              <span>{{ segment.label }}: {{ segment.value }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="reports-table">
        <h3 class="text-lg font-semibold mb-4">Detailed Reports</h3>
        <table class="w-full">
          <thead>
            <tr>
              <th>Period</th>
              <th>Bookings</th>
              <th>Revenue</th>
              <th>Active Users</th>
              <th>New Users</th>
              <th>Utilization</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let report of reportsData">
              <td>{{ report.period }}</td>
              <td>{{ report.totalBookings }}</td>
              <td>{{ report.totalRevenue }}</td>
              <td>{{ report.activeUsers }}</td>
              <td>{{ report.newUsers }}</td>
              <td>{{ report.carUtilization }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .reports-management {
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .period-select {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
    }

    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .change {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .change.positive {
      color: #10b981;
    }

    .change.negative {
      color: #ef4444;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .chart-card {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .chart-placeholder {
      height: 200px;
      display: flex;
      align-items: end;
      justify-content: space-around;
      background: #f9fafb;
      border-radius: 0.25rem;
      padding: 1rem;
    }

    .chart-bar {
      width: 30px;
      background: #3b82f6;
      border-radius: 2px 2px 0 0;
      animation: grow 1s ease-out forwards;
      transform-origin: bottom;
      transform: scaleY(0);
    }

    @keyframes grow {
      to {
        transform: scaleY(1);
      }
    }

    .pie-chart {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      position: relative;
      margin: 0 auto 1rem;
      background: conic-gradient(
        #3b82f6 0% 40%,
        #10b981 40% 70%,
        #f59e0b 70% 85%,
        #ef4444 85% 100%
      );
    }

    .legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }

    .reports-table {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background: #f9fafb;
      font-weight: 600;
    }

    tbody tr:hover {
      background: #f9fafb;
    }
  `]
})
export class ReportsComponent implements OnInit {
  selectedPeriod = '30d';
  totalRevenue = 45280;
  totalBookings = 1247;
  activeUsers = 892;
  carUtilization = 78;

  revenueData = [
    { value: 60 },
    { value: 75 },
    { value: 45 },
    { value: 80 },
    { value: 65 },
    { value: 90 },
    { value: 70 }
  ];

  bookingStatusData = [
    { label: 'Active', value: 45, color: '#3b82f6', rotation: 0 },
    { label: 'Completed', value: 35, color: '#10b981', rotation: 162 },
    { label: 'Pending', value: 15, color: '#f59e0b', rotation: 252 },
    { label: 'Cancelled', value: 5, color: '#ef4444', rotation: 324 }
  ];

  reportsData: ReportData[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadReportsData();
  }

  loadReportsData(): void {
    // Mock data - replace with actual API calls
    this.reportsData = [
      {
        period: 'Nov 1-7',
        totalBookings: 89,
        totalRevenue: 4250,
        activeUsers: 234,
        newUsers: 45,
        carUtilization: 82
      },
      {
        period: 'Oct 25-31',
        totalBookings: 76,
        totalRevenue: 3890,
        activeUsers: 198,
        newUsers: 32,
        carUtilization: 79
      },
      {
        period: 'Oct 18-24',
        totalBookings: 92,
        totalRevenue: 4680,
        activeUsers: 245,
        newUsers: 38,
        carUtilization: 85
      }
    ];
  }

  exportReport(): void {
    this.notificationService.showSuccess('Report exported successfully');
    // Implement export functionality
  }
}