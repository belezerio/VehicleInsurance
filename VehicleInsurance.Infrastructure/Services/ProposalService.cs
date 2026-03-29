using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.Infrastructure.Services;

public class ProposalService : IProposalService
{
    private readonly IProposalRepository _proposalRepo;
    private readonly IPolicyRepository _policyRepo;

    public ProposalService(IProposalRepository proposalRepo, IPolicyRepository policyRepo)
    {
        _proposalRepo = proposalRepo;
        _policyRepo = policyRepo;
    }

    public async Task<ProposalResponseDto> SubmitAsync(int userId, ProposalSubmitDto dto)
    {
        var policy = await _policyRepo.GetByIdAsync(dto.PolicyId)
            ?? throw new Exception("Policy not found.");

        var proposal = new Proposal
        {
            UserId = userId,
            PolicyId = dto.PolicyId,
            VehicleNumber = dto.VehicleNumber,
            VehicleModel = dto.VehicleModel,
            VehicleYear = dto.VehicleYear,
            VehicleCategory = dto.VehicleCategory,
            Status = "ProposalSubmitted",
            ProposalAddOns = dto.SelectedAddOnIds.Select(id => new ProposalAddOn
            {
                AddOnId = id
            }).ToList()
        };

        await _proposalRepo.AddAsync(proposal);
        return MapToDto(proposal);
    }

    public async Task<IEnumerable<ProposalResponseDto>> GetUserProposalsAsync(int userId)
    {
        var proposals = await _proposalRepo.GetByUserIdAsync(userId);
        return proposals.Select(MapToDto);
    }

    public async Task<IEnumerable<ProposalResponseDto>> GetAllAsync()
    {
        var proposals = await _proposalRepo.GetAllAsync();
        return proposals.Select(MapToDto);
    }

    public async Task UpdateStatusAsync(int proposalId, ProposalStatusUpdateDto dto)
    {
        var proposal = await _proposalRepo.GetByIdAsync(proposalId)
            ?? throw new Exception("Proposal not found.");

        proposal.Status = dto.Status;
        proposal.OfficerRemarks = dto.OfficerRemarks;
        proposal.UpdatedAt = DateTime.UtcNow;

        await _proposalRepo.UpdateAsync(proposal);
    }

    private static ProposalResponseDto MapToDto(Proposal proposal) => new()
    {
        ProposalId = proposal.ProposalId,
        UserId = proposal.UserId,
        UserName = proposal.User?.FullName ?? string.Empty,
        PolicyId = proposal.PolicyId,
        PolicyName = proposal.Policy?.PolicyName ?? string.Empty,
        VehicleNumber = proposal.VehicleNumber,
        VehicleModel = proposal.VehicleModel,
        VehicleYear = proposal.VehicleYear,
        VehicleCategory = proposal.VehicleCategory,
        Status = proposal.Status,
        OfficerRemarks = proposal.OfficerRemarks,
        SubmittedAt = proposal.SubmittedAt,
        SelectedAddOns = proposal.ProposalAddOns?.Select(pa => new AddOnResponseDto
        {
            AddOnId = pa.AddOn?.AddOnId ?? 0,
            AddOnName = pa.AddOn?.AddOnName ?? string.Empty,
            AddOnPrice = pa.AddOn?.AddOnPrice ?? 0
        }).ToList() ?? new()
    };
}