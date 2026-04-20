using AutoMapper;
using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Helpers;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.Infrastructure.Services;

public class ClaimService : IClaimService
{
    private readonly IClaimRepository _claimRepo;
    private readonly IProposalRepository _proposalRepo;
    private readonly IMapper _mapper;

    public ClaimService(IClaimRepository claimRepo,
        IProposalRepository proposalRepo, IMapper mapper)
    {
        _claimRepo = claimRepo;
        _proposalRepo = proposalRepo;
        _mapper = mapper;
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
        return _mapper.Map<ClaimResponseDto>(claim);
    }

    public async Task<IEnumerable<ClaimResponseDto>> GetUserClaimsAsync(int userId)
    {
        var claims = await _claimRepo.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<ClaimResponseDto>>(claims);
    }

    public async Task<PagedResult<ClaimResponseDto>> GetAllAsync(ClaimQueryParams queryParams)
    {
        var result = await _claimRepo.GetAllAsync(queryParams);
        return new PagedResult<ClaimResponseDto>
        {
            Data = _mapper.Map<IEnumerable<ClaimResponseDto>>(result.Data),
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        };
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
}