# CommunityCar - Car Sharing Platform

A comprehensive car sharing platform built with ASP.NET Core 9 and React, featuring clean architecture, authentication, and modern development practices.

## 🏗️ Architecture

This project follows Clean Architecture principles with the following layers:

```
CommunityCar/
├── CommunityCar.Api/           # ASP.NET Core Web API (Presentation Layer)
├── CommunityCar.Application/   # Business Logic, DTOs, CQRS Handlers
├── CommunityCar.Domain/        # Entities, Value Objects, Domain Services
├── CommunityCar.Infrastructure/# EF Core, Identity, Repositories, External Services
├── CommunityCar.Tests/         # Unit and Integration Tests
└── CommunityCar.Client/        # React SPA (Frontend)
```

## 🚀 Features

### Backend Features
- **ASP.NET Core 9** with minimal APIs
- **ASP.NET Core Identity** with JWT authentication
- **Entity Framework Core** with SQL Server
- **Clean Architecture** implementation
- **Soft Delete** functionality with global filters
- **Audit Trail** system
- **Repository Pattern** with Unit of Work
- **CORS** configuration for frontend integration
- **Comprehensive logging** and error handling

### Frontend Features
- **React 18** with modern hooks
- **Redux Toolkit** for state management
- **React Router** for client-side routing
- **Bootstrap 5** for responsive UI
- **Formik & Yup** for form handling and validation
- **Axios** for API communication with interceptors
- **JWT token management** with automatic refresh

### Security Features
- JWT Bearer authentication
- Password hashing and validation
- Role-based authorization
- CORS protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 🛠️ Technology Stack

### Backend
- **ASP.NET Core 9**
- **Entity Framework Core 9**
- **SQL Server**
- **ASP.NET Core Identity**
- **JWT Bearer Tokens**
- **FluentValidation**
- **AutoMapper**
- **MediatR** (CQRS)
- **Serilog** (Logging)

### Frontend
- **React 18**
- **Redux Toolkit**
- **React Router DOM**
- **Axios**
- **Bootstrap 5**
- **Formik**
- **Yup**
- **JWT Decode**

### Development Tools
- **Visual Studio 2022**
- **Visual Studio Code**
- **SQL Server Management Studio**
- **Postman** (API Testing)
- **Git** (Version Control)

## 📋 Prerequisites

- **.NET 9 SDK** (https://dotnet.microsoft.com/download/dotnet/9.0)
- **Node.js 18+** (https://nodejs.org/)
- **SQL Server** (LocalDB or full instance)
- **Visual Studio 2022** or **VS Code**

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/CommunityCar.git
cd CommunityCar
```

### 2. Backend Setup

#### Restore Dependencies
```bash
dotnet restore
```

#### Update Database Connection
Edit `CommunityCar.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CommunityCarDb;Trusted_Connection=True;MultipleActiveResultSets=true"
  }
}
```

#### Run Database Migrations
```bash
dotnet ef database update --project CommunityCar.Api
```

#### Run the Backend
```bash
dotnet run --project CommunityCar.Api
```
API will be available at: `https://localhost:5001`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd CommunityCar.Client/ClientApp
npm install
```

#### Start Development Server
```bash
npm start
```
React app will be available at: `http://localhost:3000`

### 4. Build for Production

#### Using PowerShell Script (Recommended)
```powershell
# Full build (clean, restore, build, test)
.\build.ps1

# Or specify individual steps
.\build.ps1 -Clean -Restore -Build -Test -Publish
```

#### Manual Build
```bash
# Backend
dotnet publish CommunityCar.Api -c Release -o publish/Api

# Frontend
cd CommunityCar.Client/ClientApp
npm run build
```

## 🔧 Configuration

### Environment Variables

#### Backend (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your_SQL_Server_Connection_String"
  },
  "Jwt": {
    "Key": "Your_256_bit_secret_key_here",
    "Issuer": "CommunityCar.Api",
    "Audience": "CommunityCar.Api"
  }
}
```

#### Frontend (`.env.development`)
```env
REACT_APP_API_URL=https://localhost:5001/api
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
```

## 🧪 Testing

### Backend Tests
```bash
dotnet test CommunityCar.Tests
```

### Frontend Tests
```bash
cd CommunityCar.Client/ClientApp
npm test
```

## 📁 Project Structure Details

### Domain Layer (`CommunityCar.Domain`)
- **Entities/**: Domain entities (User, Role, Car, Booking, etc.)
- **Common/**: BaseEntity, interfaces, value objects
- **Interfaces/**: Repository and service contracts
- **Enums/**: Domain enumerations

### Application Layer (`CommunityCar.Application`)
- **DTOs/**: Data Transfer Objects for API communication
- **Services/**: Application services and business logic
- **Interfaces/**: Application service contracts
- **Validators/**: Input validation rules
- **Extensions/**: Service collection extensions

### Infrastructure Layer (`CommunityCar.Infrastructure`)
- **Data/**: Entity Framework DbContext and configurations
- **Repositories/**: Repository implementations
- **Configurations/**: Service configurations
- **Migrations/**: Database migrations

### API Layer (`CommunityCar.Api`)
- **Controllers/**: Web API controllers
- **Middleware/**: Custom middleware components
- **Extensions/**: API-specific extensions
- **Program.cs**: Application startup and configuration

### Client Layer (`CommunityCar.Client`)
- **ClientApp/**
  - **src/**
    - **components/**: React components
    - **store/**: Redux store and slices
    - **services/**: API service functions
    - **utils/**: Utility functions
    - **styles/**: CSS and styling files

## 🔒 Authentication Flow

1. **Registration**: User registers with email/password
2. **Email Verification**: Account activation (configurable)
3. **Login**: JWT token generation and refresh token
4. **Authorization**: Bearer token validation on protected endpoints
5. **Token Refresh**: Automatic token renewal
6. **Logout**: Token invalidation

## 🗄️ Database Schema

### Core Tables
- **Users**: User accounts and profiles
- **Roles**: User roles and permissions
- **UserRoles**: User-role relationships
- **Cars**: Available vehicles for sharing
- **Bookings**: Car rental reservations
- **RefreshTokens**: JWT refresh tokens
- **AuditLogs**: System audit trail

### Key Relationships
- User → Cars (One-to-Many)
- User → Bookings (One-to-Many)
- Car → Bookings (One-to-Many)
- User → RefreshTokens (One-to-Many)

## 🚀 Deployment

### Development
```bash
# Run both backend and frontend
dotnet run --project CommunityCar.Api
# In another terminal
cd CommunityCar.Client/ClientApp && npm start
```

### Production
```bash
# Build everything
.\build.ps1 -Publish

# Deploy the publish folder to your web server
# Configure IIS or nginx to serve the application
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.

## 📞 Support

For support, email support@communitycar.com or create an issue in this repository.

## 🔄 Version History

- **1.0.0** (Current)
  - Initial release with core car sharing functionality
  - ASP.NET Core 9 backend with React frontend
  - JWT authentication and authorization
  - Clean architecture implementation
  - Soft delete and audit trail features

---

**Built with ❤️ using ASP.NET Core and React**