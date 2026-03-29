using FluentAssertions;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Infrastructure.Services;

namespace VehicleInsurance.Tests;

public class PremiumCalculationTests
{
    private readonly PremiumCalculationService _service;

    public PremiumCalculationTests()
    {
        _service = new PremiumCalculationService();
    }

    [Fact]
    public void Calculate_NewCar_ReturnsBasePrice()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        result.Should().Be(5000m);
    }

    [Fact]
    public void Calculate_CarBetween3And7Years_Applies10PercentSurcharge()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 5,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 5000 + 10% surcharge = 5500, * 1.0 car multiplier = 5500
        result.Should().Be(5500m);
    }

    [Fact]
    public void Calculate_CarOlderThan7Years_Applies20PercentSurcharge()
    {
        var policy = new Policy { BasePrice = 5000m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 8,
            VehicleCategory = "Car"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 5000 + 20% surcharge = 6000, * 1.0 car multiplier = 6000
        result.Should().Be(6000m);
    }

    [Fact]
    public void Calculate_Motorcycle_Applies08Multiplier()
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

    [Fact]
    public void Calculate_Truck_Applies15Multiplier()
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

    [Fact]
    public void Calculate_CamperVan_Applies13Multiplier()
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

    [Fact]
    public void Calculate_WithAddOns_AddsAddOnPrices()
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

    [Fact]
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

        // 5000 + 20% surcharge = 6000, * 1.5 truck = 9000, + 1000 addon = 10000
        result.Should().Be(10000m);
    }

    [Fact]
    public void Calculate_ReturnsRoundedToTwoDecimalPlaces()
    {
        var policy = new Policy { BasePrice = 3333m };
        var proposal = new Proposal
        {
            VehicleYear = DateTime.Now.Year - 1,
            VehicleCategory = "Motorcycle"
        };

        var result = _service.Calculate(policy, proposal, new List<PolicyAddOn>());

        // 3333 * 0.8 = 2666.4
        result.Should().Be(2666.40m);
    }

    [Fact]
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
}