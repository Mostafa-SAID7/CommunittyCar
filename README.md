# Community Car

A full-stack application for community car sharing and management.

## Project Structure

This project consists of:
- **Backend API**: ASP.NET Core Web API (.NET 9)
- **Frontend**: Angular 19 client application
- **Tests**: Unit and integration tests

## Backend (ASP.NET Core)

### Features
- JWT Authentication with refresh tokens
- Role-based authorization
- OTP verification
- Social login integration
- Audit logging
- Rate limiting
- Security headers
- Email services

### Technologies
- ASP.NET Core 9
- Entity Framework Core
- SQL Server
- JWT Bearer Authentication
- AutoMapper
- FluentValidation
- Serilog

## Frontend (Angular 19)

### Features
- Modern Angular 19 application
- Angular Material UI components
- Lazy-loaded modules
- JWT authentication
- Reactive forms
- HTTP interceptors
- Route guards
- Responsive design

### Technologies
- Angular 19
- Angular Material
- RxJS
- TypeScript
- SCSS

## Getting Started

### Prerequisites
- .NET 9 SDK
- Node.js 18+
- npm or yarn
- SQL Server (or other supported database)

### Backend Setup
1. Navigate to `src/CommunityCar.Api`
2. Update `appsettings.json` with your database connection
3. Run migrations: `dotnet ef database update`
4. Start the API: `dotnet run`

### Frontend Setup
1. Navigate to `ClientApp`
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Build for production: `npm run build:prod`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## Testing

### Backend Tests
```bash
cd src/CommunityCar.Tests
dotnet test
```

### Frontend Tests
```bash
cd ClientApp
npm run test:ci  # Headless testing
npm test         # Interactive testing
```

## Development

### Code Style
- Backend: Follow C# coding standards
- Frontend: Follow Angular style guide
- Use meaningful commit messages
- Write tests for new features

### Branching Strategy
- `main` - Production ready code
- `develop` - Development branch
- Feature branches: `feature/feature-name`

## Deployment

### Backend
```bash
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
npm run build:prod
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.