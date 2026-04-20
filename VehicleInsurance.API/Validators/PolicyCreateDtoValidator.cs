using FluentValidation;
using VehicleInsurance.Core.DTOs;

namespace VehicleInsurance.API.Validators;

public class PolicyCreateDtoValidator : AbstractValidator<PolicyCreateDto>
{
    private static readonly string[] ValidCategories =
        { "Car", "Motorcycle", "Truck", "CamperVan" };

    public PolicyCreateDtoValidator()
    {
        RuleFor(x => x.PolicyName)
            .NotEmpty().WithMessage("Policy name is required.")
            .MaximumLength(100).WithMessage("Policy name cannot exceed 100 characters.");

        RuleFor(x => x.VehicleCategory)
            .NotEmpty().WithMessage("Vehicle category is required.")
            .Must(c => ValidCategories.Contains(c))
            .WithMessage("Valid categories: Car, Motorcycle, Truck, CamperVan.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required.")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");

        RuleFor(x => x.BasePrice)
            .GreaterThan(0).WithMessage("Base price must be greater than 0.");

        RuleForEach(x => x.AddOns).ChildRules(addOn =>
        {
            addOn.RuleFor(a => a.AddOnName)
                .NotEmpty().WithMessage("Add-on name is required.");
            addOn.RuleFor(a => a.AddOnPrice)
                .GreaterThanOrEqualTo(0).WithMessage("Add-on price cannot be negative.");
        });
    }
}