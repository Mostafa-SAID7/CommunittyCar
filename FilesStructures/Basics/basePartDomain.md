/Domain
   /Common           ← Base entities, audit fields, interfaces
       BaseEntity.cs
       IAggregateRoot.cs
       IHaveAuditTrail.cs
   /Entities         ← Concrete domain entities
       ApplicationUser.cs   ← Extend IdentityUser if using Identity here
       Car.cs
       Booking.cs
       ...
   /ValueObjects     ← Value Objects
       LicensePlate.cs
       Money.cs
       ...
   /Enums            ← Domain-specific enumerations
       BookingStatus.cs
       CarCondition.cs
   /Interfaces       ← Domain interfaces (repository contracts, domain services)
       ICarRepository.cs
       IBookingRepository.cs
