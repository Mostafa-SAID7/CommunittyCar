/Application
   /DTOs             ← Data Transfer Objects (request/response)
       CarDto.cs
       BookingDto.cs
       UserRegistrationDto.cs
       LoginDto.cs
   /Commands         ← CQRS-style commands
       CreateCarCommand.cs
       BookCarCommand.cs
   /Queries          ← Queries
       GetAvailableCarsQuery.cs
       GetUserBookingsQuery.cs
   /Handlers         ← Handlers for above commands/queries (MediatR)
       CreateCarCommandHandler.cs
       BookCarCommandHandler.cs
   /Validators       ← FluentValidation validators
       CreateCarCommandValidator.cs
       BookingValidator.cs
   /Mappings         ← AutoMapper profiles
       CarProfile.cs
       BookingProfile.cs
   /Services         ← Application services (if needed)
   /Extensions       ← IServiceCollection extensions for DI
       ApplicationServiceCollectionExtensions.cs
