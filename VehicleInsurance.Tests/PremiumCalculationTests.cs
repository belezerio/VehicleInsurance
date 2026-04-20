using FluentAssertions;
using NUnit.Framework;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Infrastructure.Services;

namespace VehicleInsurance.Tests;

[TestFixture]
public class PremiumCalculationTests
{
    private PremiumCalculationService _service;

    [SetUp]
    public void SetUp()
    {
        _service = new PremiumCalculationService();
    }

    // BASE PRICE / CAR – Age Surcharge

    [Test]
    public void Calculate_NewCar_ReturnsBasePrice()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // No surcharge, car multiplier = 1.0 → 5000
        result.Should().Be(5000m);
    }

    [Test]
    public void Calculate_CurrentYearCar_ReturnsBasePrice()
    {
        var policy = new Policy { BasePrice = 4000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // Brand-new vehicle, no surcharge → 4000
        result.Should().Be(4000m);
    }

    [Test]
    public void Calculate_CarExactly3YearsOld_Applies10PercentSurcharge()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 3,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 5000 + 10% = 5500
        result.Should().Be(5500m);
    }

    [Test]
    public void Calculate_CarBetween3And7Years_Applies10PercentSurcharge()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 5,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 5000 + 10% = 5500
        result.Should().Be(5500m);
    }

    // [Test]
    // public void Calculate_CarExactly7YearsOld_Applies10PercentSurcharge()
    // {
    //     var policy = new Policy { BasePrice = 5000m };
    //     var proposal = new Proposal
    //     {
    //         VehicleYear = DateTime.Now.Year - 7,
    //         VehicleCategory = "Car"
    //     };

    //     var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

    //     // Boundary: 7 years is still in the 3–7 band → 5500
    //     result.Should().Be(5500m);
    // }
// 
    [Test]
    public void Calculate_CarOlderThan7Years_Applies20PercentSurcharge()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 8,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 5000 + 20% = 6000
        result.Should().Be(6000m);
    }

    [Test]
    public void Calculate_VeryOldCar_Applies20PercentSurcharge()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 25,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 5000 + 20% = 6000
        result.Should().Be(6000m);
    }

    
    // MOTORCYCLE

    [Test]
    public void Calculate_NewMotorcycle_Applies08Multiplier()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Motorcycle"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 5000 * 0.8 = 4000
        result.Should().Be(4000m);
    }

    [Test]
    public void Calculate_MotorcycleBetween3And7Years_AppliesSurchargeAndMultiplier()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 5,
            VehicleCategory = "Motorcycle"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // (5000 + 10%) * 0.8 = 5500 * 0.8 = 4400
        result.Should().Be(4400m);
    }

    [Test]
    public void Calculate_OldMotorcycle_Applies20SurchargeAnd08Multiplier()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 10,
            VehicleCategory = "Motorcycle"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // (5000 + 20%) * 0.8 = 6000 * 0.8 = 4800
        result.Should().Be(4800m);
    }

   
    // TRUCK

    [Test]
    public void Calculate_NewTruck_Applies15Multiplier()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Truck"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 5000 * 1.5 = 7500
        result.Should().Be(7500m);
    }

    [Test]
    public void Calculate_TruckBetween3And7Years_AppliesSurchargeAndMultiplier()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 4,
            VehicleCategory = "Truck"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // (5000 + 10%) * 1.5 = 5500 * 1.5 = 8250
        result.Should().Be(8250m);
    }

    [Test]
    public void Calculate_OldTruck_Applies20SurchargeAnd15Multiplier()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 8,
            VehicleCategory = "Truck"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // (5000 + 20%) * 1.5 = 6000 * 1.5 = 9000
        result.Should().Be(9000m);
    }

    // CAMPER VAN

    [Test]
    public void Calculate_NewCamperVan_Applies13Multiplier()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "CamperVan"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 5000 * 1.3 = 6500
        result.Should().Be(6500m);
    }

    [Test]
    public void Calculate_CamperVanBetween3And7Years_AppliesSurchargeAndMultiplier()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 6,
            VehicleCategory = "CamperVan"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // (5000 + 10%) * 1.3 = 5500 * 1.3 = 7150
        result.Should().Be(7150m);
    }

    [Test]
    public void Calculate_OldCamperVan_Applies20SurchargeAnd13Multiplier()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 12,
            VehicleCategory = "CamperVan"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // (5000 + 20%) * 1.3 = 6000 * 1.3 = 7800
        result.Should().Be(7800m);
    }

   // ADD-ONS

    [Test]
    public void Calculate_WithSingleAddOn_AddsAddOnPrice()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Car"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnName = "Zero Depreciation", AddOnPrice = 500m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        // 5000 + 500 = 5500
        result.Should().Be(5500m);
    }

    [Test]
    public void Calculate_WithMultipleAddOns_AddsAllAddOnPrices()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Car"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnName = "Zero Depreciation", AddOnPrice = 500m },
            new PolicyAddOn { AddOnName = "Roadside Assistance", AddOnPrice = 300m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        // 5000 + 500 + 300 = 5800
        result.Should().Be(5800m);
    }

    [Test]
    public void Calculate_AddOnsWithSurchargedCar_AppliesSurchargeBeforeAddOns()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 5,
            VehicleCategory = "Car"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnPrice = 200m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        // (5000 + 10%) + 200 = 5500 + 200 = 5700
        result.Should().Be(5700m);
    }

    [Test]
    public void Calculate_OldTruckWithAddOns_AppliesAllRules()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 8,
            VehicleCategory = "Truck"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnPrice = 1000m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        // (5000 + 20%) * 1.5 + 1000 = 9000 + 1000 = 10000
        result.Should().Be(10000m);
    }

    [Test]
    public void Calculate_OldMotorcycleWithAddOns_AppliesAllRules()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 9,
            VehicleCategory = "Motorcycle"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnPrice = 400m },
            new PolicyAddOn { AddOnPrice = 100m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        // (5000 + 20%) * 0.8 + 500 = 4800 + 500 = 5300
        result.Should().Be(5300m);
    }

    [Test]
    public void Calculate_OldCamperVanWithAddOns_AppliesAllRules()
    {
        var policy = new Policy { BasePrice = 4000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 10,
            VehicleCategory = "CamperVan"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnPrice = 600m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        // (4000 + 20%) * 1.3 + 600 = 4800 * 1.3 + 600 = 6240 + 600 = 6840
        result.Should().Be(6840m);
    }

    [Test]
    public void Calculate_ZeroValueAddOn_DoesNotChangeTotal()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Car"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnName = "Complimentary Cover", AddOnPrice = 0m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        result.Should().Be(5000m);
    }

    // EDGE / BOUNDARY CASES

    [Test]
    public void Calculate_ZeroBasePrice_ReturnsZero()
    {
        var policy = new Policy { BasePrice = 0m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        result.Should().Be(0m);
    }

    [Test]
    public void Calculate_ZeroBasePriceOldTruckWithAddOns_ReturnsOnlyAddOnTotal()
    {
        var policy = new Policy { BasePrice = 0m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 10,
            VehicleCategory = "Truck"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnPrice = 750m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        // (0 + 20%) * 1.5 = 0, + 750 = 750
        result.Should().Be(750m);
    }

    [Test]
    public void Calculate_ReturnsRoundedToTwoDecimalPlaces_Motorcycle()
    {
        var policy = new Policy { BasePrice = 3333m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Motorcycle"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 3333 * 0.8 = 2666.4 → rounded to 2666.40
        result.Should().Be(2666.40m);
    }

    [Test]
    public void Calculate_ReturnsRoundedToTwoDecimalPlaces_Truck()
    {
        var policy = new Policy { BasePrice = 1111m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Truck"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 1111 * 1.5 = 1666.5 → rounded to 1666.50
        result.Should().Be(1666.50m);
    }

    [Test]
    public void Calculate_ReturnsRoundedToTwoDecimalPlaces_CamperVanWithSurcharge()
    {
        var policy = new Policy { BasePrice = 1000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 5,
            VehicleCategory = "CamperVan"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // (1000 + 10%) * 1.3 = 1100 * 1.3 = 1430.00
        result.Should().Be(1430.00m);
    }

    [Test]
    public void Calculate_EmptyAddOnList_DoesNotThrow()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Car"
        };

        Action act = () => _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        act.Should().NotThrow();
    }

    [Test]
    public void Calculate_LargeBasePrice_ComputesCorrectly()
    {
        var policy = new Policy { BasePrice = 1_000_000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Truck"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 1000000 * 1.5 = 1500000
        result.Should().Be(1_500_000m);
    }

    [Test]
    public void Calculate_LargeBasePriceOldTruckWithAddOns_ComputesCorrectly()
    {
        var policy = new Policy { BasePrice = 1_000_000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 15,
            VehicleCategory = "Truck"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnPrice = 50_000m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        // (1000000 + 20%) * 1.5 + 50000 = 1200000 * 1.5 + 50000 = 1800000 + 50000 = 1850000
        result.Should().Be(1_850_000m);
    }

    [Test]
    public void Calculate_ManyAddOns_SumsAllCorrectly()
    {
        var policy = new Policy { BasePrice = 2000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Car"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnPrice = 100m },
            new PolicyAddOn { AddOnPrice = 200m },
            new PolicyAddOn { AddOnPrice = 300m },
            new PolicyAddOn { AddOnPrice = 400m },
            new PolicyAddOn { AddOnPrice = 500m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        // 2000 + (100+200+300+400+500) = 2000 + 1500 = 3500
        result.Should().Be(3500m);
    }

    // COMBINATION / INTEGRATION SCENARIOS

    [Test]
    public void Calculate_Mid_AgeTruckWithSingleAddOn_AppliesAllRules()
    {
        var policy = new Policy { BasePrice = 8000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 4,
            VehicleCategory = "Truck"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnPrice = 500m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        // (8000 + 10%) * 1.5 + 500 = 8800 * 1.5 + 500 = 13200 + 500 = 13700
        result.Should().Be(13700m);
    }

    [Test]
    public void Calculate_MidAgeMotorcycleWithMultipleAddOns_AppliesAllRules()
    {
        var policy = new Policy { BasePrice = 3000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 6,
            VehicleCategory = "Motorcycle"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnPrice = 250m },
            new PolicyAddOn { AddOnPrice = 150m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        // (3000 + 10%) * 0.8 + 400 = 3300 * 0.8 + 400 = 2640 + 400 = 3040
        result.Should().Be(3040m);
    }

    [Test]
    public void Calculate_NewCamperVanWithHighValueAddOn_ComputesCorrectly()
    {
        var policy = new Policy { BasePrice = 10000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year,
            VehicleCategory = "CamperVan"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnName = "Premium Road Cover", AddOnPrice = 2000m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        // 10000 * 1.3 + 2000 = 13000 + 2000 = 15000
        result.Should().Be(15000m);
    }

    [Test]
    public void Calculate_Boundary_CarExactly2YearsOld_NoSurcharge()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 2,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 2 years < 3, so no surcharge → 5000
        result.Should().Be(5000m);
    }

    [Test]
    public void Calculate_Boundary_CarExactly8YearsOld_Applies20PercentSurcharge()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 8,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 8 years > 7, 20% surcharge → 6000
        result.Should().Be(6000m);
    }

    [Test]
    public void Calculate_SmallBasePrice_Motorcycle_ReturnsCorrectValue()
    {
        var policy = new Policy { BasePrice = 100m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Motorcycle"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 100 * 0.8 = 80
        result.Should().Be(80m);
    }

    [Test]
    public void Calculate_SmallBasePrice_OldCar_ReturnsCorrectValue()
    {
        var policy = new Policy { BasePrice = 100m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 9,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 100 + 20% = 120
        result.Should().Be(120m);
    }

    [Test]
    public void Calculate_AllAddOnsPriceEqualsBasePrice_DoublesEffectiveCost()
    {
        var policy = new Policy { BasePrice = 3000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Car"
        };
        var addOns = new List<PolicyAddOn>
        {
            new PolicyAddOn { AddOnPrice = 1500m },
            new PolicyAddOn { AddOnPrice = 1500m }
        };

        var result = _service.Calculate(policy, proposal, addOns);

        // 3000 + 1500 + 1500 = 6000
        result.Should().Be(6000m);
    }

    [Test]
    public void Calculate_TruckMidAgeNoAddOns_CorrectCombination()
    {
        var policy = new Policy { BasePrice = 7000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 5,
            VehicleCategory = "Truck"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // (7000 + 10%) * 1.5 = 7700 * 1.5 = 11550
        result.Should().Be(11550m);
    }

    [Test]
    public void Calculate_ResultIsNonNegative_WhenAllInputsAreZero()
    {
        var policy = new Policy { BasePrice = 0m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        result.Should().BeGreaterThanOrEqualTo(0m);
    }
}