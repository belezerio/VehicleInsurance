using VehicleInsurance.Core.Entities;

namespace VehicleInsurance.Core.Interfaces;

public interface IProposalRepository
{
    Task<Proposal?> GetByIdAsync(int proposalId);
    Task<IEnumerable<Proposal>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Proposal>> GetAllAsync();
    Task<Proposal> AddAsync(Proposal proposal);
    Task UpdateAsync(Proposal proposal);
}