using AutoMapper;
using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Helpers;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.Infrastructure.Services;

public class ProposalService : IProposalService
{
    private readonly IProposalRepository _proposalRepo;
    private readonly IPolicyRepository _policyRepo;
    private readonly IMapper _mapper;

    public ProposalService(IProposalRepository proposalRepo,
        IPolicyRepository policyRepo, IMapper mapper)
    {
        _proposalRepo = proposalRepo;
        _policyRepo = policyRepo;
        _mapper = mapper;
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
        return _mapper.Map<ProposalResponseDto>(proposal);
    }

    public async Task<IEnumerable<ProposalResponseDto>> GetUserProposalsAsync(int userId)
    {
        var proposals = await _proposalRepo.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<ProposalResponseDto>>(proposals);
    }

    public async Task<PagedResult<ProposalResponseDto>> GetAllAsync(ProposalQueryParams queryParams)
    {
        var result = await _proposalRepo.GetAllAsync(queryParams);
        return new PagedResult<ProposalResponseDto>
        {
            Data = _mapper.Map<IEnumerable<ProposalResponseDto>>(result.Data),
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        };
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
}