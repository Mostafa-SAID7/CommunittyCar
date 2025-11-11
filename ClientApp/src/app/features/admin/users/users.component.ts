import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-management">
      <div class="header">
        <h1 class="text-2xl font-bold text-gray-900">Users Management</h1>
        <button class="btn-primary">Add New User</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Total Users</h3>
          <p class="text-3xl font-bold text-blue-600">{{ totalUsers }}</p>
        </div>
        <div class="stat-card">
          <h3 class="text-lg font-semibold">Active Users</h3>
          <p class="text-3xl font-bold text-green-600">{{ activeUsers }}</p>
        </div>
        <div class="stat-card">
          <h3 class="text-lg font-semibold">New This Month</h3>
          <p class="text-3xl font-bold text-purple-600">{{ newUsers }}</p>
        </div>
      </div>

      <div class="filters">
        <input type="text" placeholder="Search users..." class="search-input">
        <select class="filter-select">
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div class="users-table">
        <table class="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge" [ngClass]="getRoleClass(user.roles[0])">
                  {{ user.roles[0] | titlecase }}
                </span>
              </td>
              <td>
                <span class="status-badge" [ngClass]="user.isActive ? 'active' : 'inactive'">
                  {{ user.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>{{ user.lastLogin | date:'short' }}</td>
              <td>
                <button class="btn-secondary" (click)="viewUser(user)">View</button>
                <button class="btn-secondary" (click)="editUser(user)">Edit</button>
                <button class="btn-danger" (click)="toggleUserStatus(user)">
                  {{ user.isActive ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .users-management {
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

    .search-input, .filter-select {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
    }

    .users-table {
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

    .role-badge, .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .role-badge.admin {
      background: #fef3c7;
      color: #92400e;
    }

    .role-badge.user {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }

    .status-badge.inactive {
      background: #fee2e2;
      color: #991b1b;
    }
  `]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  totalUsers = 0;
  activeUsers = 0;
  newUsers = 0;

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Mock data - replace with actual API call
    this.users = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        roles: ['user'],
        isActive: true,
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date('2024-11-10')
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        roles: ['admin'],
        isActive: true,
        createdAt: new Date('2024-02-20'),
        lastLogin: new Date('2024-11-09')
      }
    ];
    this.totalUsers = this.users.length;
    this.activeUsers = this.users.filter(u => u.isActive).length;
    this.newUsers = this.users.filter(u => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return u.createdAt > monthAgo;
    }).length;
  }

  viewUser(user: User): void {
    this.router.navigate(['/admin/users', user.id]);
  }

  editUser(user: User): void {
    this.router.navigate(['/admin/users', user.id, 'edit']);
  }

  toggleUserStatus(user: User): void {
    user.isActive = !user.isActive;
    this.notificationService.showSuccess(
      `User ${user.isActive ? 'activated' : 'deactivated'} successfully`
    );
  }

  getRoleClass(role: string): string {
    return role.toLowerCase();
  }
}