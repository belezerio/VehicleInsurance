using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Helpers;

namespace VehicleInsurance.Core.Interfaces;

public interface IProposalRepository
{
    Task<Proposal?> GetByIdAsync(int proposalId);
    Task<IEnumerable<Proposal>> GetByUserIdAsync(int userId);
    Task<PagedResult<Proposal>> GetAllAsync(ProposalQueryParams queryParams);
    Task<Proposal> AddAsync(Proposal proposal);
    Task UpdateAsync(Proposal proposal);
}