using AutoMapper;
using CommunityCar.Application.DTOs.Auth;
using CommunityCar.Domain.Entities;

namespace CommunityCar.Application.Mappings;

public class AuthMappingProfile : Profile
{
    public AuthMappingProfile()
    {
        // User mappings
        CreateMap<User, UserProfileDto>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl))
            .ForMember(dest => dest.CoverPhotoUrl, opt => opt.MapFrom(src => src.CoverPhotoUrl));

        CreateMap<UpdateProfileRequest, User>()
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
            .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.Bio))
            .ForMember(dest => dest.Location, opt => opt.MapFrom(src => src.Location))
            .ForMember(dest => dest.Website, opt => opt.MapFrom(src => src.Website))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
            .ForMember(dest => dest.IsPrivate, opt => opt.MapFrom(src => src.IsPrivate));

        // Auth response mappings
        CreateMap<User, AuthResponse>()
            .ForMember(dest => dest.Success, opt => opt.MapFrom(src => true))
            .ForMember(dest => dest.Message, opt => opt.MapFrom(src => "Authentication successful"));

        // Role mappings
        CreateMap<Role, RoleDto>();
        CreateMap<RoleDto, Role>();
    }
}