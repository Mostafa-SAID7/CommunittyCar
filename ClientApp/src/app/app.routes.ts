import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public routes (no authentication required)
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'about-us',
        loadComponent: () => import('./features/pages/about-us/about-us.component').then(m => m.AboutUsComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/pages/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'privacy-policy',
        loadComponent: () => import('./features/pages/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
      },
      {
        path: 'terms-of-service',
        loadComponent: () => import('./features/pages/terms-of-service/terms-of-service.component').then(m => m.TermsOfServiceComponent)
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/pages/faq/faq.component').then(m => m.FaqComponent)
      },
      {
        path: 'browse-cars',
        loadComponent: () => import('./features/pages/browse-cars/browse-cars.component').then(m => m.BrowseCarsComponent)
      },
      {
        path: 'add-your-car',
        loadComponent: () => import('./features/pages/add-your-car/add-your-car.component').then(m => m.AddYourCarComponent)
      },
      {
        path: 'how-it-works',
        loadComponent: () => import('./features/pages/how-it-works/how-it-works.component').then(m => m.HowItWorksComponent)
      },
      {
        path: 'pricing',
        loadComponent: () => import('./features/pages/pricing/pricing.component').then(m => m.PricingComponent)
      }
    ]
  },

  // Auth redirects for clean URLs
  {
    path: 'login',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'register',
    redirectTo: '/auth/register',
    pathMatch: 'full'
  },
  {
    path: 'forgot-password',
    redirectTo: '/auth/forgot-password',
    pathMatch: 'full'
  },
  {
    path: 'verify-email',
    redirectTo: '/auth/verify-email',
    pathMatch: 'full'
  },
  {
    path: 'otp-verification',
    redirectTo: '/auth/otp-verification',
    pathMatch: 'full'
  },
  {
    path: 'setup-2fa',
    redirectTo: '/auth/setup-2fa',
    pathMatch: 'full'
  },

  // Auth layout routes
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
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
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent)
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
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'cars',
        loadComponent: () => import('./features/admin/cars/cars.component').then(m => m.CarsComponent)
      },
      {
        path: 'bookings',
        loadComponent: () => import('./features/admin/bookings/bookings.component').then(m => m.BookingsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/admin/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
