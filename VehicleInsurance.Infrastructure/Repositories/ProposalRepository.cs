using Microsoft.EntityFrameworkCore;
using VehicleInsurance.Core.Entities;
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

    public async Task<IEnumerable<Proposal>> GetAllAsync() =>
        await _context.Proposals
            .Include(p => p.User)
            .Include(p => p.Policy)
            .Include(p => p.ProposalAddOns).ThenInclude(pa => pa.AddOn)
            .ToListAsync();

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