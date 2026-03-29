using VehicleInsurance.Core.DTOs;

namespace VehicleInsurance.Core.Interfaces;

public interface IClaimService
{
    Task<ClaimResponseDto> FileClaimAsync(int userId, ClaimSubmitDto dto);
    Task<IEnumerable<ClaimResponseDto>> GetUserClaimsAsync(int userId);
    Task<IEnumerable<ClaimResponseDto>> GetAllAsync();
    Task UpdateStatusAsync(int claimId, ClaimStatusUpdateDto dto);
}