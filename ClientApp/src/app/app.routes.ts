import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
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
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'cars',
    loadComponent: () => import('./features/cars/car-list/car-list.component').then(m => m.CarListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'cars/:id',
    loadComponent: () => import('./features/cars/car-details/car-details.component').then(m => m.CarDetailsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'cars/add',
    loadComponent: () => import('./features/cars/add-car/add-car.component').then(m => m.AddCarComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'bookings',
    loadComponent: () => import('./features/bookings/booking-list/booking-list.component').then(m => m.BookingListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'bookings/:id',
    loadComponent: () => import('./features/bookings/booking-details/booking-details.component').then(m => m.BookingDetailsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'bookings/new',
    loadComponent: () => import('./features/bookings/new-booking/new-booking.component').then(m => m.NewBookingComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/view-profile/view-profile.component').then(m => m.ViewProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/edit',
    loadComponent: () => import('./features/profile/edit-profile/edit-profile.component').then(m => m.EditProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/change-password',
    loadComponent: () => import('./features/profile/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
