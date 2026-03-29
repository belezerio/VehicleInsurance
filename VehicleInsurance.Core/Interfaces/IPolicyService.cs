using VehicleInsurance.Core.DTOs;

namespace VehicleInsurance.Core.Interfaces;

public interface IPolicyService
{
    Task<IEnumerable<PolicyResponseDto>> GetAllAsync();
    Task<PolicyResponseDto?> GetByIdAsync(int policyId);
    Task<PolicyResponseDto> CreateAsync(PolicyCreateDto dto);
    Task UpdateAsync(int policyId, PolicyCreateDto dto);
}