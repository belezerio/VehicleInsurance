using FluentValidation;
using VehicleInsurance.Core.DTOs;

namespace VehicleInsurance.API.Validators;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required.")
            .MaximumLength(100).WithMessage("Full name cannot exceed 100 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters.")
            .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain at least one number.");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Date of birth is required.")
            .Must(dob => DateTime.Now.Year - dob.Year >= 18)
            .WithMessage("You must be at least 18 years old.");

        RuleFor(x => x.AadhaarNumber)
            .NotEmpty().WithMessage("Aadhaar number is required.")
            .Length(12).WithMessage("Aadhaar number must be exactly 12 digits.")
            .Matches("^[0-9]+$").WithMessage("Aadhaar number must contain only digits.");

        RuleFor(x => x.PanNumber)
            .NotEmpty().WithMessage("PAN number is required.")
            .Length(10).WithMessage("PAN number must be exactly 10 characters.")
            .Matches("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")
            .WithMessage("Invalid PAN format. Example: ABCDE1234F");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required.")
            .MaximumLength(255).WithMessage("Address cannot exceed 255 characters.");
    }
}