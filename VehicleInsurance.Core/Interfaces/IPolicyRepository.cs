using VehicleInsurance.Core.Entities;

namespace VehicleInsurance.Core.Interfaces;

public interface IPolicyRepository
{
    Task<IEnumerable<Policy>> GetAllAsync();
    Task<Policy?> GetByIdAsync(int policyId);
    Task<Policy> AddAsync(Policy policy);
    Task UpdateAsync(Policy policy);
}