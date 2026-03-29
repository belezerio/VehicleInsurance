using VehicleInsurance.Core.Entities;

namespace VehicleInsurance.Core.Interfaces;

public interface IPremiumCalculationService
{
    decimal Calculate(Policy policy, Proposal proposal, List<PolicyAddOn> selectedAddOns);
}