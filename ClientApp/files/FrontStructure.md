/CommunityCar.Client
│
├── src/
│   ├── app/
│   │   ├── core/                               ← Cross-cutting concerns
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   ├── error.interceptor.ts
│   │   │   │   └── loading.interceptor.ts
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── services/
│   │   │   │   ├── api/
│   │   │   │   │   ├── auth-api.service.ts
│   │   │   │   │   ├── car-api.service.ts
│   │   │   │   │   ├── booking-api.service.ts
│   │   │   │   │   └── profile-api.service.ts
│   │   │   │   ├── storage.service.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   └── theme.service.ts
│   │   │   ├── models/
│   │   │   │   ├── auth.model.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── car.model.ts
│   │   │   │   ├── booking.model.ts
│   │   │   │   └── api-response.model.ts
│   │   │   └── utilities/
│   │   │       ├── constants.ts
│   │   │       ├── helpers.ts
│   │   │       └── validators.ts
│   │   │
│   │   ├── features/                           ← Mirrors backend modules
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   ├── login.component.html
│   │   │   │   │   └── login.component.scss
│   │   │   │   ├── register/
│   │   │   │   ├── forgot-password/
│   │   │   │   ├── verify-email/
│   │   │   │   └── otp-verification/
│   │   │   ├── profile/
│   │   │   │   ├── edit-profile/
│   │   │   │   ├── view-profile/
│   │   │   │   └── change-password/
│   │   │   ├── cars/
│   │   │   │   ├── car-list/
│   │   │   │   ├── car-details/
│   │   │   │   └── add-car/
│   │   │   ├── bookings/
│   │   │   │   ├── booking-list/
│   │   │   │   ├── booking-details/
│   │   │   │   └── new-booking/
│   │   │   └── dashboard/
│   │   │       ├── dashboard.component.ts
│   │   │       └── dashboard.component.html
│   │   │
│   │   ├── shared/                              ← Reusable UI elements
│   │   │   ├── components/
│   │   │   │   ├── navbar/
│   │   │   │   ├── footer/
│   │   │   │   ├── loading-spinner/
│   │   │   │   ├── modal/
│   │   │   │   └── alert/
│   │   │   ├── directives/
│   │   │   │   ├── autofocus.directive.ts
│   │   │   │   └── click-outside.directive.ts
│   │   │   └── pipes/
│   │   │       ├── date-format.pipe.ts
│   │   │       ├── capitalize.pipe.ts
│   │   │       └── truncate.pipe.ts
│   │   │
│   │   ├── layouts/                             ← Page layout shells
│   │   │   ├── auth-layout/
│   │   │   ├── main-layout/
│   │   │   └── admin-layout/
│   │   │
│   │   ├── state/                               ← NgRx (optional)
│   │   │   ├── auth/
│   │   │   ├── cars/
│   │   │   ├── bookings/
│   │   │   └── app.state.ts
│   │   │
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── app.module.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   ├── styles/
│   │   │   ├── variables.scss
│   │   │   ├── mixins.scss
│   │   │   └── theme.scss
│   │   └── templates/
│   │       └── emails/
│   │           ├── password-reset.html
│   │           ├── verification.html
│   │           └── otp.html
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   ├── environment.development.ts
│   │   └── environment.production.ts
│   │
│   ├── main.ts
│   └── index.html
│
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json
