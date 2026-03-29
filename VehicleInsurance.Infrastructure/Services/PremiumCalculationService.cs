using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.Infrastructure.Services;

public class PremiumCalculationService : IPremiumCalculationService
{
    public decimal Calculate(Policy policy, Proposal proposal, List<PolicyAddOn> selectedAddOns)
    {
        decimal premium = policy.BasePrice;

        // Vehicle age surcharge
        int vehicleAge = DateTime.Now.Year - proposal.VehicleYear;
        if (vehicleAge >= 7)
            premium += policy.BasePrice * 0.20m;
        else if (vehicleAge >= 3)
            premium += policy.BasePrice * 0.10m;

        // Vehicle category multiplier
        decimal multiplier = proposal.VehicleCategory switch
        {
            "Motorcycle" => 0.8m,
            "Truck" => 1.5m,
            "CamperVan" => 1.3m,
            _ => 1.0m
        };
        premium *= multiplier;

        // Add selected add-ons
        premium += selectedAddOns.Sum(a => a.AddOnPrice);

        return Math.Round(premium, 2);
    }
}