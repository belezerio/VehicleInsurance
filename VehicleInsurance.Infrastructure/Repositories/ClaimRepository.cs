using Microsoft.EntityFrameworkCore;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Helpers;
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

    public async Task<PagedResult<Claim>> GetAllAsync(ClaimQueryParams queryParams)
    {
        var query = _context.Claims
            .Include(c => c.User)
            .Include(c => c.Proposal)
            .AsQueryable();

        // Filtering
        if (!string.IsNullOrEmpty(queryParams.Status))
            query = query.Where(c => c.Status == queryParams.Status);

        // Sorting
        query = queryParams.SortBy.ToLower() switch
        {
            "claimamount" => queryParams.SortOrder == "asc"
                ? query.OrderBy(c => c.ClaimAmount)
                : query.OrderByDescending(c => c.ClaimAmount),
            "status" => queryParams.SortOrder == "asc"
                ? query.OrderBy(c => c.Status)
                : query.OrderByDescending(c => c.Status),
            _ => queryParams.SortOrder == "asc"
                ? query.OrderBy(c => c.FiledAt)
                : query.OrderByDescending(c => c.FiledAt)
        };

        // Pagination
        var totalCount = await query.CountAsync();
        var data = await query
            .Skip((queryParams.Page - 1) * queryParams.PageSize)
            .Take(queryParams.PageSize)
            .ToListAsync();

        return new PagedResult<Claim>
        {
            Data = data,
            TotalCount = totalCount,
            Page = queryParams.Page,
            PageSize = queryParams.PageSize
        };
    }

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