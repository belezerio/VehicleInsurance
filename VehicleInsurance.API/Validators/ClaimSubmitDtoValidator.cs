using FluentValidation;
using VehicleInsurance.Core.DTOs;

namespace VehicleInsurance.API.Validators;

public class ClaimSubmitDtoValidator : AbstractValidator<ClaimSubmitDto>
{
    public ClaimSubmitDtoValidator()
    {
        RuleFor(x => x.ProposalId)
            .GreaterThan(0).WithMessage("Valid proposal must be selected.");

        RuleFor(x => x.ClaimDescription)
            .NotEmpty().WithMessage("Claim description is required.")
            .MinimumLength(20).WithMessage("Description must be at least 20 characters.")
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters.");

        RuleFor(x => x.ClaimAmount)
            .GreaterThan(0).WithMessage("Claim amount must be greater than 0.");
    }
}