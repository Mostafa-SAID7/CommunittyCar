// System namespaces
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Threading.Tasks;
global using System.IO;
global using System.Reflection;

// Microsoft namespaces
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.AspNetCore.Authorization;
global using Microsoft.AspNetCore.Authentication.JwtBearer;
global using Microsoft.IdentityModel.Tokens;
global using Microsoft.OpenApi.Models;
global using Microsoft.EntityFrameworkCore;

// CommunityCar namespaces
global using CommunityCar.Api.Controllers;
global using CommunityCar.Api.Middleware;
global using CommunityCar.Application.Interfaces;
global using CommunityCar.Application.Services;
global using CommunityCar.Application.DTOs.Auth;
global using CommunityCar.Application.DTOs.Profile;
global using CommunityCar.Domain.Entities;
global using CommunityCar.Domain.Entities.Auth;
global using CommunityCar.Domain.Entities.Profile;
global using CommunityCar.Infrastructure.Data;
global using CommunityCar.Infrastructure.Configurations;