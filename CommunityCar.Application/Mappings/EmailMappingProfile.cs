using AutoMapper;
using CommunityCar.Application.DTOs.Email;

namespace CommunityCar.Application.Mappings;

public class EmailMappingProfile : Profile
{
    public EmailMappingProfile()
    {
        // Email request mappings
        CreateMap<EmailRequest, EmailRequest>();

        // Email template data mappings
        CreateMap<EmailVerificationData, EmailRequest>()
            .ForMember(dest => dest.Subject, opt => opt.MapFrom(src => "Verify Your Email Address"))
            .ForMember(dest => dest.TemplateName, opt => opt.MapFrom(src => "EmailVerification"))
            .ForMember(dest => dest.TemplateData, opt => opt.MapFrom(src => src));

        CreateMap<PasswordResetData, EmailRequest>()
            .ForMember(dest => dest.Subject, opt => opt.MapFrom(src => "Reset Your Password"))
            .ForMember(dest => dest.TemplateName, opt => opt.MapFrom(src => "PasswordReset"))
            .ForMember(dest => dest.TemplateData, opt => opt.MapFrom(src => src));

        CreateMap<OtpData, EmailRequest>()
            .ForMember(dest => dest.Subject, opt => opt.MapFrom(src => "Your One-Time Password"))
            .ForMember(dest => dest.TemplateName, opt => opt.MapFrom(src => "OtpVerification"))
            .ForMember(dest => dest.TemplateData, opt => opt.MapFrom(src => src));

        CreateMap<WelcomeEmailData, EmailRequest>()
            .ForMember(dest => dest.Subject, opt => opt.MapFrom(src => "Welcome to CommunityCar!"))
            .ForMember(dest => dest.TemplateName, opt => opt.MapFrom(src => "WelcomeEmail"))
            .ForMember(dest => dest.TemplateData, opt => opt.MapFrom(src => src));
    }
}