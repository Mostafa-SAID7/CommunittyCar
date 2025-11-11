/CommunityCar.Client
│
├── src/
│   ├── app/
│   │   ├── core/                                ← Core cross-cutting logic
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
│   │   │   │   ├── theme.service.ts
│   │   │   │   ├── animation.service.ts          ← Wrapper for Framer Motion (Angular Animations)
│   │   │   │   └── ui.service.ts                 ← Centralized control for modals, toasts, drawers
│   │   │   ├── models/
│   │   │   │   ├── auth.model.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── car.model.ts
│   │   │   │   ├── booking.model.ts
│   │   │   │   ├── api-response.model.ts
│   │   │   │   └── ui-config.model.ts            ← Shared UI config interfaces
│   │   │   └── utilities/
│   │   │       ├── constants.ts
│   │   │       ├── helpers.ts
│   │   │       ├── validators.ts
│   │   │       └── animations.ts                 ← Framer Motion–style Angular animations
│   │   │
│   │   ├── features/                             ← Mirrors backend modules
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── forgot-password/
│   │   │   │   ├── verify-email/
│   │   │   │   └── otp-verification/
│   │   │   ├── profile/
│   │   │   ├── cars/
│   │   │   ├── bookings/
│   │   │   └── dashboard/
│   │   │
│   │   ├── shared/                               ← Reusable UI system (Shadcn-style)
│   │   │   ├── components/
│   │   │   │   ├── ui/                           ← Shadcn/ui-style component library
│   │   │   │   │   ├── button/
│   │   │   │   │   │   ├── button.component.ts
│   │   │   │   │   │   ├── button.component.html
│   │   │   │   │   │   └── button.component.scss
│   │   │   │   │   ├── input/
│   │   │   │   │   ├── card/
│   │   │   │   │   ├── modal/
│   │   │   │   │   ├── toast/
│   │   │   │   │   ├── dropdown/
│   │   │   │   │   ├── sheet/
│   │   │   │   │   └── avatar/
│   │   │   │   ├── icons/                        ← Lucide icon wrappers
│   │   │   │   │   ├── icon.component.ts
│   │   │   │   │   ├── icon.module.ts
│   │   │   │   │   └── icons.config.ts
│   │   │   │   ├── navbar/
│   │   │   │   ├── footer/
│   │   │   │   ├── loading-spinner/
│   │   │   │   └── alert/
│   │   │   ├── directives/
│   │   │   │   ├── autofocus.directive.ts
│   │   │   │   └── click-outside.directive.ts
│   │   │   └── pipes/
│   │   │       ├── date-format.pipe.ts
│   │   │       ├── capitalize.pipe.ts
│   │   │       └── truncate.pipe.ts
│   │   │
│   │   ├── layouts/
│   │   │   ├── auth-layout/
│   │   │   ├── main-layout/
│   │   │   └── admin-layout/
│   │   │
│   │   ├── state/                                ← NgRx (or Signals)
│   │   │   ├── auth/
│   │   │   ├── cars/
│   │   │   ├── bookings/
│   │   │   ├── ui/
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
│   │   │   ├── lucide/                           ← Lucide Angular icon set
│   │   │   └── custom/
│   │   ├── styles/
│   │   │   ├── tailwind.css                      ← Tailwind entry file
│   │   │   ├── shadcn-theme.scss                 ← Shadcn-compatible styling
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
├── tailwind.config.js                            ← Tailwind configuration
├── postcss.config.js                             ← Tailwind/PostCSS integration
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── tsconfig.spec.json

update this stracture from this 
 i Add Tailwind CSS
 + Add Shadcn/ui
 + icon (Lucide angular)
 + animation (Framer Motion)