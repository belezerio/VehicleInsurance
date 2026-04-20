using Microsoft.EntityFrameworkCore;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Helpers;
using VehicleInsurance.Core.Interfaces;
using VehicleInsurance.Infrastructure.Data;

namespace VehicleInsurance.Infrastructure.Repositories;

public class ProposalRepository : IProposalRepository
{
    private readonly AppDbContext _context;
    public ProposalRepository(AppDbContext context) { _context = context; }

    public async Task<Proposal?> GetByIdAsync(int proposalId) =>
        await _context.Proposals
            .Include(p => p.User)
            .Include(p => p.Policy)
            .Include(p => p.ProposalAddOns).ThenInclude(pa => pa.AddOn)
            .FirstOrDefaultAsync(p => p.ProposalId == proposalId);

    public async Task<IEnumerable<Proposal>> GetByUserIdAsync(int userId) =>
        await _context.Proposals
            .Include(p => p.Policy)
            .Include(p => p.ProposalAddOns).ThenInclude(pa => pa.AddOn)
            .Where(p => p.UserId == userId)
            .ToListAsync();

    public async Task<PagedResult<Proposal>> GetAllAsync(ProposalQueryParams queryParams)
    {
        var query = _context.Proposals
            .Include(p => p.User)
            .Include(p => p.Policy)
            .Include(p => p.ProposalAddOns).ThenInclude(pa => pa.AddOn)
            .AsQueryable();

        // Filtering
        if (!string.IsNullOrEmpty(queryParams.Status))
            query = query.Where(p => p.Status == queryParams.Status);

        if (!string.IsNullOrEmpty(queryParams.VehicleCategory))
            query = query.Where(p => p.VehicleCategory == queryParams.VehicleCategory);

        // Sorting
        query = queryParams.SortBy.ToLower() switch
        {
            "vehiclemodel" => queryParams.SortOrder == "asc"
                ? query.OrderBy(p => p.VehicleModel)
                : query.OrderByDescending(p => p.VehicleModel),
            "status" => queryParams.SortOrder == "asc"
                ? query.OrderBy(p => p.Status)
                : query.OrderByDescending(p => p.Status),
            _ => queryParams.SortOrder == "asc"
                ? query.OrderBy(p => p.SubmittedAt)
                : query.OrderByDescending(p => p.SubmittedAt)
        };

        // Pagination
        var totalCount = await query.CountAsync();
        var data = await query
            .Skip((queryParams.Page - 1) * queryParams.PageSize)
            .Take(queryParams.PageSize)
            .ToListAsync();

        return new PagedResult<Proposal>
        {
            Data = data,
            TotalCount = totalCount,
            Page = queryParams.Page,
            PageSize = queryParams.PageSize
        };
    }

    public async Task<Proposal> AddAsync(Proposal proposal)
    {
        _context.Proposals.Add(proposal);
        await _context.SaveChangesAsync();
        return proposal;
    }

    public async Task UpdateAsync(Proposal proposal)
    {
        _context.Proposals.Update(proposal);
        await _context.SaveChangesAsync();
    }
}