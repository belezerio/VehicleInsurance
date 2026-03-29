using FluentAssertions;
using Moq;
using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Interfaces;
using VehicleInsurance.Infrastructure.Services;

namespace VehicleInsurance.Tests;

public class ProposalServiceTests
{
    private readonly Mock<IProposalRepository> _proposalRepoMock;
    private readonly Mock<IPolicyRepository> _policyRepoMock;
    private readonly ProposalService _service;

    public ProposalServiceTests()
    {
        _proposalRepoMock = new Mock<IProposalRepository>();
        _policyRepoMock = new Mock<IPolicyRepository>();
        _service = new ProposalService(_proposalRepoMock.Object, _policyRepoMock.Object);
    }

    [Fact]
    public async Task SubmitAsync_ValidProposal_ReturnsProposalResponse()
    {
        // Arrange
        var policy = new Policy { PolicyId = 1, PolicyName = "Basic Cover", AddOns = new List<PolicyAddOn>() };
        _policyRepoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(policy);
        _proposalRepoMock.Setup(r => r.AddAsync(It.IsAny<Proposal>()))
            .ReturnsAsync((Proposal p) => p);

        var dto = new ProposalSubmitDto
        {
            PolicyId = 1,
            VehicleNumber = "GJ01AB1234",
            VehicleModel = "Honda City",
            VehicleYear = 2022,
            VehicleCategory = "Car",
            SelectedAddOnIds = new List<int>()
        };

        // Act
        var result = await _service.SubmitAsync(1, dto);

        // Assert
        result.Should().NotBeNull();
        result.Status.Should().Be("ProposalSubmitted");
        result.VehicleNumber.Should().Be("GJ01AB1234");
    }

    [Fact]
    public async Task SubmitAsync_InvalidPolicy_ThrowsException()
    {
        _policyRepoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Policy?)null);

        var dto = new ProposalSubmitDto { PolicyId = 99 };

        await _service.Invoking(s => s.SubmitAsync(1, dto))
            .Should().ThrowAsync<Exception>()
            .WithMessage("Policy not found.");
    }

    [Fact]
    public async Task UpdateStatusAsync_InvalidProposal_ThrowsException()
    {
        _proposalRepoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Proposal?)null);

        var dto = new ProposalStatusUpdateDto { Status = "Active" };

        await _service.Invoking(s => s.UpdateStatusAsync(99, dto))
            .Should().ThrowAsync<Exception>()
            .WithMessage("Proposal not found.");
    }
}