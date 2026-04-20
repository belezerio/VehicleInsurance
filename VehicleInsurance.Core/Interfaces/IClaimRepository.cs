using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Helpers;

namespace VehicleInsurance.Core.Interfaces;

public interface IClaimRepository
{
    Task<Claim?> GetByIdAsync(int claimId);
    Task<IEnumerable<Claim>> GetByUserIdAsync(int userId);
    Task<PagedResult<Claim>> GetAllAsync(ClaimQueryParams queryParams);
    Task<Claim> AddAsync(Claim claim);
    Task UpdateAsync(Claim claim);
}