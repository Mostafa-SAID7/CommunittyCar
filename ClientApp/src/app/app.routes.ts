import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Auth layout routes
  {
    path: '',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
      },
      {
        path: 'otp-verification',
        loadComponent: () => import('./features/auth/otp-verification/otp-verification.component').then(m => m.OtpVerificationComponent)
      },
      {
        path: 'setup-2fa',
        loadComponent: () => import('./features/auth/setup-2fa/setup-2fa.component').then(m => m.Setup2faComponent)
      }
    ]
  },

  // Main layout routes (authenticated)
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'cars',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/cars/car-list/car-list.component').then(m => m.CarListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/cars/car-details/car-details.component').then(m => m.CarDetailsComponent)
          },
          {
            path: 'add',
            loadComponent: () => import('./features/cars/add-car/add-car.component').then(m => m.AddCarComponent)
          }
        ]
      },
      {
        path: 'bookings',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/bookings/booking-list/booking-list.component').then(m => m.BookingListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/bookings/booking-details/booking-details.component').then(m => m.BookingDetailsComponent)
          },
          {
            path: 'new',
            loadComponent: () => import('./features/bookings/new-booking/new-booking.component').then(m => m.NewBookingComponent)
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/profile/view-profile/view-profile.component').then(m => m.ViewProfileComponent)
          },
          {
            path: 'edit',
            loadComponent: () => import('./features/profile/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
          },
          {
            path: 'change-password',
            loadComponent: () => import('./features/profile/change-password/change-password.component').then(m => m.ChangePasswordComponent)
          }
        ]
      },
      {
        path: 'chat',
        loadComponent: () => import('./features/chat/chat.component').then(m => m.ChatComponent)
      }
    ]
  },

  // Admin layout routes
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./modules/dashboard/components/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'cars',
        loadComponent: () => import('./modules/dashboard/components/cars/cars.component').then(m => m.CarsComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./modules/dashboard/components/bookings/bookings.component').then(m => m.BookingsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./modules/dashboard/components/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./modules/dashboard/components/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
