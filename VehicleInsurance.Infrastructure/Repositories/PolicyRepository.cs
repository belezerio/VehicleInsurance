using Microsoft.EntityFrameworkCore;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Interfaces;
using VehicleInsurance.Infrastructure.Data;

namespace VehicleInsurance.Infrastructure.Repositories;

public class PolicyRepository : IPolicyRepository
{
    private readonly AppDbContext _context;
    public PolicyRepository(AppDbContext context) { _context = context; }

    public async Task<IEnumerable<Policy>> GetAllAsync() =>
        await _context.Policies.Include(p => p.AddOns).ToListAsync();

    public async Task<Policy?> GetByIdAsync(int policyId) =>
        await _context.Policies.Include(p => p.AddOns)
            .FirstOrDefaultAsync(p => p.PolicyId == policyId);

    public async Task<Policy> AddAsync(Policy policy)
    {
        _context.Policies.Add(policy);
        await _context.SaveChangesAsync();
        return policy;
    }

    public async Task UpdateAsync(Policy policy)
    {
        _context.Policies.Update(policy);
        await _context.SaveChangesAsync();
    }
}