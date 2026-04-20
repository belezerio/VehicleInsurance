using FluentValidation;
using VehicleInsurance.Core.DTOs;

namespace VehicleInsurance.API.Validators;

public class ProposalSubmitDtoValidator : AbstractValidator<ProposalSubmitDto>
{
    private static readonly string[] ValidCategories =
        { "Car", "Motorcycle", "Truck", "CamperVan" };

    public ProposalSubmitDtoValidator()
    {
        RuleFor(x => x.PolicyId)
            .GreaterThan(0).WithMessage("Valid policy must be selected.");

        RuleFor(x => x.VehicleNumber)
            .NotEmpty().WithMessage("Vehicle number is required.")
            .MaximumLength(20).WithMessage("Vehicle number cannot exceed 20 characters.");

        RuleFor(x => x.VehicleModel)
            .NotEmpty().WithMessage("Vehicle model is required.")
            .MaximumLength(100).WithMessage("Vehicle model cannot exceed 100 characters.");

        RuleFor(x => x.VehicleYear)
            .InclusiveBetween(1990, DateTime.Now.Year)
            .WithMessage($"Vehicle year must be between 1990 and {DateTime.Now.Year}.");

        RuleFor(x => x.VehicleCategory)
            .NotEmpty().WithMessage("Vehicle category is required.")
            .Must(c => ValidCategories.Contains(c))
            .WithMessage("Valid categories: Car, Motorcycle, Truck, CamperVan.");
    }
}