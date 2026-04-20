using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Helpers;

namespace VehicleInsurance.Core.Interfaces;

public interface IClaimService
{
    Task<ClaimResponseDto> FileClaimAsync(int userId, ClaimSubmitDto dto);
    Task<IEnumerable<ClaimResponseDto>> GetUserClaimsAsync(int userId);
    Task<PagedResult<ClaimResponseDto>> GetAllAsync(ClaimQueryParams queryParams);
    Task UpdateStatusAsync(int claimId, ClaimStatusUpdateDto dto);
}