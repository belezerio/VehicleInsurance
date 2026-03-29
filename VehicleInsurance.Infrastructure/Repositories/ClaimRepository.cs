using Microsoft.EntityFrameworkCore;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Interfaces;
using VehicleInsurance.Infrastructure.Data;

namespace VehicleInsurance.Infrastructure.Repositories;

public class ClaimRepository : IClaimRepository
{
    private readonly AppDbContext _context;
    public ClaimRepository(AppDbContext context) { _context = context; }

    public async Task<Claim?> GetByIdAsync(int claimId) =>
        await _context.Claims
            .Include(c => c.User)
            .Include(c => c.Proposal)
            .FirstOrDefaultAsync(c => c.ClaimId == claimId);

    public async Task<IEnumerable<Claim>> GetByUserIdAsync(int userId) =>
        await _context.Claims
            .Include(c => c.Proposal)
            .Where(c => c.UserId == userId)
            .ToListAsync();

    public async Task<IEnumerable<Claim>> GetAllAsync() =>
        await _context.Claims
            .Include(c => c.User)
            .Include(c => c.Proposal)
            .ToListAsync();

    public async Task<Claim> AddAsync(Claim claim)
    {
        _context.Claims.Add(claim);
        await _context.SaveChangesAsync();
        return claim;
    }

    public async Task UpdateAsync(Claim claim)
    {
        _context.Claims.Update(claim);
        await _context.SaveChangesAsync();
    }
}