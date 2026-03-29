using VehicleInsurance.Core.Entities;

namespace VehicleInsurance.Core.Interfaces;

public interface IClaimRepository
{
    Task<Claim?> GetByIdAsync(int claimId);
    Task<IEnumerable<Claim>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Claim>> GetAllAsync();
    Task<Claim> AddAsync(Claim claim);
    Task UpdateAsync(Claim claim);
}