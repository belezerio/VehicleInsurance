using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.Infrastructure.Services;

public class QuoteService : IQuoteService
{
    private readonly IQuoteRepository _quoteRepo;
    private readonly IProposalRepository _proposalRepo;
    private readonly IPolicyRepository _policyRepo;
    private readonly IPremiumCalculationService _premiumCalc;

    public QuoteService(IQuoteRepository quoteRepo, IProposalRepository proposalRepo,
        IPolicyRepository policyRepo, IPremiumCalculationService premiumCalc)
    {
        _quoteRepo = quoteRepo;
        _proposalRepo = proposalRepo;
        _policyRepo = policyRepo;
        _premiumCalc = premiumCalc;
    }

    public async Task<QuoteResponseDto> GenerateQuoteAsync(int proposalId)
    {
        var proposal = await _proposalRepo.GetByIdAsync(proposalId)
            ?? throw new Exception("Proposal not found.");

        var policy = await _policyRepo.GetByIdAsync(proposal.PolicyId)
            ?? throw new Exception("Policy not found.");

        var selectedAddOns = proposal.ProposalAddOns
            .Select(pa => pa.AddOn)
            .Where(a => a != null)
            .Cast<PolicyAddOn>()
            .ToList();

        var premium = _premiumCalc.Calculate(policy, proposal, selectedAddOns);

        var quote = new Quote
        {
            ProposalId = proposalId,
            PremiumAmount = premium,
            ValidUntil = DateTime.UtcNow.AddDays(30),
            GeneratedAt = DateTime.UtcNow
        };

        await _quoteRepo.AddAsync(quote);

        proposal.Status = "QuoteGenerated";
        proposal.UpdatedAt = DateTime.UtcNow;
        await _proposalRepo.UpdateAsync(proposal);

        return MapToDto(quote);
    }

    public async Task<QuoteResponseDto?> GetByProposalIdAsync(int proposalId)
    {
        var quote = await _quoteRepo.GetByProposalIdAsync(proposalId);
        return quote == null ? null : MapToDto(quote);
    }

    private static QuoteResponseDto MapToDto(Quote quote) => new()
    {
        QuoteId = quote.QuoteId,
        ProposalId = quote.ProposalId,
        PremiumAmount = quote.PremiumAmount,
        ValidUntil = quote.ValidUntil,
        GeneratedAt = quote.GeneratedAt
    };
}