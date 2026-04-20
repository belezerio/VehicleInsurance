using AutoMapper;
using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Entities;

namespace VehicleInsurance.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // User mappings
        CreateMap<User, UserResponseDto>()
            .ForMember(dest => dest.Age,
                opt => opt.MapFrom(src => DateTime.Now.Year - src.DateOfBirth.Year));

        // Policy mappings
        CreateMap<Policy, PolicyResponseDto>();
        CreateMap<PolicyAddOn, AddOnResponseDto>();
        CreateMap<PolicyCreateDto, Policy>();
        CreateMap<AddOnDto, PolicyAddOn>();

        // Proposal mappings
        CreateMap<Proposal, ProposalResponseDto>()
            .ForMember(dest => dest.UserName,
                opt => opt.MapFrom(src => src.User != null ? src.User.FullName : string.Empty))
            .ForMember(dest => dest.PolicyName,
                opt => opt.MapFrom(src => src.Policy != null ? src.Policy.PolicyName : string.Empty))
            .ForMember(dest => dest.SelectedAddOns,
                opt => opt.MapFrom(src => src.ProposalAddOns
                    .Where(pa => pa.AddOn != null)
                    .Select(pa => pa.AddOn)));

        // Quote mappings
        CreateMap<Quote, QuoteResponseDto>();

        // Payment mappings
        CreateMap<Payment, PaymentResponseDto>();

        // Claim mappings
        CreateMap<Claim, ClaimResponseDto>()
            .ForMember(dest => dest.UserName,
                opt => opt.MapFrom(src => src.User != null ? src.User.FullName : string.Empty));
    }
}