import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';

interface SystemSettings {
  appName: string;
  appVersion: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  defaultCurrency: string;
  commissionRate: number;
  maxBookingDuration: number;
  minBookingDuration: number;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="settings-management">
      <div class="header">
        <h1 class="text-2xl font-bold text-gray-900">System Settings</h1>
        <button class="btn-primary" (click)="saveSettings()">Save Changes</button>
      </div>

      <div class="settings-grid">
        <div class="settings-section">
          <h2 class="text-xl font-semibold mb-4">General Settings</h2>
          <form [formGroup]="settingsForm" class="settings-form">
            <div class="form-group">
              <label class="form-label">Application Name</label>
              <input type="text" formControlName="appName" class="form-input">
            </div>

            <div class="form-group">
              <label class="form-label">Version</label>
              <input type="text" formControlName="appVersion" class="form-input" readonly>
            </div>

            <div class="form-group">
              <label class="form-checkbox">
                <input type="checkbox" formControlName="maintenanceMode">
                <span class="checkmark"></span>
                Maintenance Mode
              </label>
            </div>

            <div class="form-group">
              <label class="form-checkbox">
                <input type="checkbox" formControlName="allowRegistration">
                <span class="checkmark"></span>
                Allow New Registrations
              </label>
            </div>
          </form>
        </div>

        <div class="settings-section">
          <h2 class="text-xl font-semibold mb-4">Notifications</h2>
          <form [formGroup]="settingsForm" class="settings-form">
            <div class="form-group">
              <label class="form-checkbox">
                <input type="checkbox" formControlName="emailNotifications">
                <span class="checkmark"></span>
                Email Notifications
              </label>
            </div>

            <div class="form-group">
              <label class="form-checkbox">
                <input type="checkbox" formControlName="smsNotifications">
                <span class="checkmark"></span>
                SMS Notifications
              </label>
            </div>
          </form>
        </div>

        <div class="settings-section">
          <h2 class="text-xl font-semibold mb-4">Booking Settings</h2>
          <form [formGroup]="settingsForm" class="settings-form">
            <div class="form-group">
              <label class="form-label">Default Currency</label>
              <select formControlName="defaultCurrency" class="form-select">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Commission Rate (%)</label>
              <input type="number" formControlName="commissionRate" class="form-input" min="0" max="50" step="0.1">
            </div>

            <div class="form-group">
              <label class="form-label">Maximum Booking Duration (days)</label>
              <input type="number" formControlName="maxBookingDuration" class="form-input" min="1" max="365">
            </div>

            <div class="form-group">
              <label class="form-label">Minimum Booking Duration (days)</label>
              <input type="number" formControlName="minBookingDuration" class="form-input" min="1" max="30">
            </div>
          </form>
        </div>

        <div class="settings-section">
          <h2 class="text-xl font-semibold mb-4">System Actions</h2>
          <div class="action-buttons">
            <button class="btn-secondary" (click)="clearCache()">Clear System Cache</button>
            <button class="btn-secondary" (click)="backupDatabase()">Backup Database</button>
            <button class="btn-danger" (click)="resetSettings()">Reset to Defaults</button>
          </div>

          <div class="system-info">
            <h3 class="text-lg font-semibold mb-2">System Information</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Last Backup:</span>
                <span class="info-value">{{ lastBackup }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Database Size:</span>
                <span class="info-value">{{ databaseSize }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Uptime:</span>
                <span class="info-value">{{ systemUptime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-management {
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
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      margin-right: 0.5rem;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }

    .settings-section {
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-label {
      font-weight: 500;
      color: #374151;
    }

    .form-input, .form-select {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      font-size: 1rem;
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: 500;
    }

    .form-checkbox input[type="checkbox"] {
      width: 1.2rem;
      height: 1.2rem;
      accent-color: #3b82f6;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    .system-info {
      border-top: 1px solid #e5e7eb;
      padding-top: 1rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .info-label {
      font-weight: 500;
      color: #6b7280;
    }

    .info-value {
      font-weight: 600;
      color: #374151;
    }
  `]
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;
  lastBackup = '2024-11-10 14:30';
  databaseSize = '2.4 GB';
  systemUptime = '15 days, 8 hours';

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.settingsForm = this.fb.group({
      appName: ['Community Car'],
      appVersion: ['1.0.0'],
      maintenanceMode: [false],
      allowRegistration: [true],
      emailNotifications: [true],
      smsNotifications: [false],
      defaultCurrency: ['USD'],
      commissionRate: [10],
      maxBookingDuration: [30],
      minBookingDuration: [1]
    });
  }

  ngOnInit(): void {
    // Load settings from API
    this.loadSettings();
  }

  loadSettings(): void {
    // Mock loading - replace with actual API call
    // This would load current settings from the backend
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      this.notificationService.showSuccess('Settings saved successfully');
      // Implement save functionality
    }
  }

  clearCache(): void {
    if (confirm('Are you sure you want to clear the system cache?')) {
      this.notificationService.showSuccess('System cache cleared successfully');
    }
  }

  backupDatabase(): void {
    this.notificationService.showInfo('Database backup initiated...');
    // Implement backup functionality
  }

  resetSettings(): void {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      this.settingsForm.reset({
        appName: 'Community Car',
        appVersion: '1.0.0',
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        smsNotifications: false,
        defaultCurrency: 'USD',
        commissionRate: 10,
        maxBookingDuration: 30,
        minBookingDuration: 1
      });
      this.notificationService.showSuccess('Settings reset to defaults');
    }
  }
}