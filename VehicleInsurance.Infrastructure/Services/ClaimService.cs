using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.Infrastructure.Services;

public class ClaimService : IClaimService
{
    private readonly IClaimRepository _claimRepo;
    private readonly IProposalRepository _proposalRepo;

    public ClaimService(IClaimRepository claimRepo, IProposalRepository proposalRepo)
    {
        _claimRepo = claimRepo;
        _proposalRepo = proposalRepo;
    }

    public async Task<ClaimResponseDto> FileClaimAsync(int userId, ClaimSubmitDto dto)
    {
        var proposal = await _proposalRepo.GetByIdAsync(dto.ProposalId)
            ?? throw new Exception("Proposal not found.");

        if (proposal.Status != "Active")
            throw new Exception("You can only file a claim on an active policy.");

        if (proposal.UserId != userId)
            throw new Exception("Unauthorized.");

        var claim = new Claim
        {
            ProposalId = dto.ProposalId,
            UserId = userId,
            ClaimDescription = dto.ClaimDescription,
            ClaimAmount = dto.ClaimAmount,
            Status = "Filed"
        };

        await _claimRepo.AddAsync(claim);
        return MapToDto(claim);
    }

    public async Task<IEnumerable<ClaimResponseDto>> GetUserClaimsAsync(int userId)
    {
        var claims = await _claimRepo.GetByUserIdAsync(userId);
        return claims.Select(MapToDto);
    }

    public async Task<IEnumerable<ClaimResponseDto>> GetAllAsync()
    {
        var claims = await _claimRepo.GetAllAsync();
        return claims.Select(MapToDto);
    }

    public async Task UpdateStatusAsync(int claimId, ClaimStatusUpdateDto dto)
    {
        var claim = await _claimRepo.GetByIdAsync(claimId)
            ?? throw new Exception("Claim not found.");

        claim.Status = dto.Status;
        claim.OfficerRemarks = dto.OfficerRemarks;
        claim.UpdatedAt = DateTime.UtcNow;

        await _claimRepo.UpdateAsync(claim);
    }

    private static ClaimResponseDto MapToDto(Claim claim) => new()
    {
        ClaimId = claim.ClaimId,
        ProposalId = claim.ProposalId,
        UserId = claim.UserId,
        UserName = claim.User?.FullName ?? string.Empty,
        ClaimDescription = claim.ClaimDescription,
        ClaimAmount = claim.ClaimAmount,
        Status = claim.Status,
        OfficerRemarks = claim.OfficerRemarks,
        FiledAt = claim.FiledAt
    };
}