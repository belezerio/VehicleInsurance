using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Helpers;

namespace VehicleInsurance.Core.Interfaces;

public interface IProposalService
{
    Task<ProposalResponseDto> SubmitAsync(int userId, ProposalSubmitDto dto);
    Task<IEnumerable<ProposalResponseDto>> GetUserProposalsAsync(int userId);
    Task<PagedResult<ProposalResponseDto>> GetAllAsync(ProposalQueryParams queryParams);
    Task UpdateStatusAsync(int proposalId, ProposalStatusUpdateDto dto);
}