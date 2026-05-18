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
    private readonly IEmailService _emailService;

    public QuoteService(IQuoteRepository quoteRepo, IProposalRepository proposalRepo,
        IPolicyRepository policyRepo, IPremiumCalculationService premiumCalc,
        IEmailService emailService)
    {
        _quoteRepo = quoteRepo;
        _proposalRepo = proposalRepo;
        _policyRepo = policyRepo;
        _premiumCalc = premiumCalc;
        _emailService = emailService;
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

        try
        {
            var userEmail = proposal.User?.Email ?? "customer@example.com";
            var userName = proposal.User?.FullName ?? "Valued Customer";
            var policyName = policy.PolicyName;
            var subject = $"Your Quote is Ready: {policyName}";

            // Build selected add-ons list HTML
            var addOnsHtml = string.Empty;
            if (selectedAddOns.Any())
            {
                addOnsHtml = "<ul>" + string.Join("", selectedAddOns.Select(a => $"<li>{a.AddOnName} - ₹{a.AddOnPrice}</li>")) + "</ul>";
            }
            else
            {
                addOnsHtml = "<p>No add-ons selected.</p>";
            }

            var body = $@"
                <html>
                <body>
                    <h2>SecureDrive Insurance - Quote Details</h2>
                    <p>Dear {userName},</p>
                    <p>Great news! The insurance team has reviewed your proposal for policy <b>{policyName}</b> and generated a quote.</p>
                    <h3>Vehicle Details:</h3>
                    <p>Model: {proposal.VehicleModel} ({proposal.VehicleYear})<br/>Number: {proposal.VehicleNumber}</p>
                    <h3>Selected Add-ons:</h3>
                    {addOnsHtml}
                    <h3>Premium Details:</h3>
                    <p style='font-size: 18px; color: #4f46e5; font-weight: bold;'>Total Premium Amount: ₹{premium:N2} / year</p>
                    <p>Please log in to your dashboard to complete the premium payment to activate your policy.</p>
                    <br/>
                    <p>Best regards,</p>
                    <p>SecureDrive Insurance Team</p>
                </body>
                </html>";

            await _emailService.SendEmailAsync(userEmail, subject, body);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send quote email: {ex.Message}");
        }

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