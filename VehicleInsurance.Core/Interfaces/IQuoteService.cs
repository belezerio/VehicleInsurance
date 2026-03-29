using VehicleInsurance.Core.DTOs;

namespace VehicleInsurance.Core.Interfaces;

public interface IQuoteService
{
    Task<QuoteResponseDto> GenerateQuoteAsync(int proposalId);
    Task<QuoteResponseDto?> GetByProposalIdAsync(int proposalId);
}