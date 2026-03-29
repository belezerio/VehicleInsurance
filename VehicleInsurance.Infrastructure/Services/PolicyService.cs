using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.Infrastructure.Services;

public class PolicyService : IPolicyService
{
    private readonly IPolicyRepository _policyRepo;
    public PolicyService(IPolicyRepository policyRepo) { _policyRepo = policyRepo; }

    public async Task<IEnumerable<PolicyResponseDto>> GetAllAsync()
    {
        var policies = await _policyRepo.GetAllAsync();
        return policies.Select(MapToDto);
    }

    public async Task<PolicyResponseDto?> GetByIdAsync(int policyId)
    {
        var policy = await _policyRepo.GetByIdAsync(policyId);
        return policy == null ? null : MapToDto(policy);
    }

    public async Task<PolicyResponseDto> CreateAsync(PolicyCreateDto dto)
    {
        var policy = new Policy
        {
            PolicyName = dto.PolicyName,
            VehicleCategory = dto.VehicleCategory,
            Description = dto.Description,
            BasePrice = dto.BasePrice,
            IsActive = dto.IsActive,
            AddOns = dto.AddOns.Select(a => new PolicyAddOn
            {
                AddOnName = a.AddOnName,
                AddOnPrice = a.AddOnPrice
            }).ToList()
        };

        await _policyRepo.AddAsync(policy);
        return MapToDto(policy);
    }

    public async Task UpdateAsync(int policyId, PolicyCreateDto dto)
    {
        var policy = await _policyRepo.GetByIdAsync(policyId)
            ?? throw new Exception("Policy not found.");

        policy.PolicyName = dto.PolicyName;
        policy.VehicleCategory = dto.VehicleCategory;
        policy.Description = dto.Description;
        policy.BasePrice = dto.BasePrice;
        policy.IsActive = dto.IsActive;

        await _policyRepo.UpdateAsync(policy);
    }

    private static PolicyResponseDto MapToDto(Policy policy) => new()
    {
        PolicyId = policy.PolicyId,
        PolicyName = policy.PolicyName,
        VehicleCategory = policy.VehicleCategory,
        Description = policy.Description,
        BasePrice = policy.BasePrice,
        IsActive = policy.IsActive,
        AddOns = policy.AddOns.Select(a => new AddOnResponseDto
        {
            AddOnId = a.AddOnId,
            AddOnName = a.AddOnName,
            AddOnPrice = a.AddOnPrice
        }).ToList()
    };
}