using Microsoft.EntityFrameworkCore;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Interfaces;
using VehicleInsurance.Infrastructure.Data;

namespace VehicleInsurance.Infrastructure.Repositories;

public class QuoteRepository : IQuoteRepository
{
    private readonly AppDbContext _context;
    public QuoteRepository(AppDbContext context) { _context = context; }

    public async Task<Quote?> GetByProposalIdAsync(int proposalId) =>
        await _context.Quotes.FirstOrDefaultAsync(q => q.ProposalId == proposalId);

    public async Task<Quote> AddAsync(Quote quote)
    {
        _context.Quotes.Add(quote);
        await _context.SaveChangesAsync();
        return quote;
    }

    public async Task UpdateAsync(Quote quote)
    {
        _context.Quotes.Update(quote);
        await _context.SaveChangesAsync();
    }
}