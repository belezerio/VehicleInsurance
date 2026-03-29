using VehicleInsurance.Core.Entities;

namespace VehicleInsurance.Core.Interfaces;

public interface IQuoteRepository
{
    Task<Quote?> GetByProposalIdAsync(int proposalId);
    Task<Quote> AddAsync(Quote quote);
    Task UpdateAsync(Quote quote);
}