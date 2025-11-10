// System namespaces
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Threading.Tasks;

// Testing namespaces
global using Xunit;
global using Moq;
global using FluentAssertions;

// Microsoft namespaces
global using Microsoft.AspNetCore.Identity;
global using Microsoft.AspNetCore.Http;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.Extensions.Configuration;

// CommunityCar namespaces
global using CommunityCar.Application.Interfaces;
global using CommunityCar.Application.Services;
global using CommunityCar.Application.DTOs.Auth;
global using CommunityCar.Application.DTOs.Profile;
global using CommunityCar.Domain.Entities;
global using CommunityCar.Domain.Entities.Auth;
global using CommunityCar.Domain.Entities.Profile;
global using CommunityCar.Infrastructure.Data;