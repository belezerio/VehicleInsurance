using VehicleInsurance.Core.DTOs;

namespace VehicleInsurance.Core.Interfaces;

public interface IProposalService
{
    Task<ProposalResponseDto> SubmitAsync(int userId, ProposalSubmitDto dto);
    Task<IEnumerable<ProposalResponseDto>> GetUserProposalsAsync(int userId);
    Task<IEnumerable<ProposalResponseDto>> GetAllAsync();
    Task UpdateStatusAsync(int proposalId, ProposalStatusUpdateDto dto);
}