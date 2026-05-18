using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepo;
    private readonly IProposalRepository _proposalRepo;
    private readonly IQuoteRepository _quoteRepo;
    private readonly IEmailService _emailService;

    public PaymentService(IPaymentRepository paymentRepo,
        IProposalRepository proposalRepo, IQuoteRepository quoteRepo,
        IEmailService emailService)
    {
        _paymentRepo = paymentRepo;
        _proposalRepo = proposalRepo;
        _quoteRepo = quoteRepo;
        _emailService = emailService;
    }

    public async Task<PaymentResponseDto> ProcessPaymentAsync(int userId, PaymentRequestDto dto)
    {
        var proposal = await _proposalRepo.GetByIdAsync(dto.ProposalId)
            ?? throw new Exception("Proposal not found.");

        if (proposal.UserId != userId)
            throw new Exception("Unauthorized.");

        var quote = await _quoteRepo.GetByProposalIdAsync(dto.ProposalId)
            ?? throw new Exception("No quote found for this proposal.");

        if (dto.Amount != quote.PremiumAmount)
            throw new Exception($"Payment amount must match quote amount: {quote.PremiumAmount}");

        var payment = new Payment
        {
            ProposalId = dto.ProposalId,
            Amount = dto.Amount,
            Status = "Completed",
            TransactionRef = $"TXN{Guid.NewGuid().ToString()[..8].ToUpper()}"
        };

        await _paymentRepo.AddAsync(payment);

        proposal.Status = "Active";
        proposal.UpdatedAt = DateTime.UtcNow;
        await _proposalRepo.UpdateAsync(proposal);

        try
        {
            var userEmail = proposal.User?.Email ?? "customer@example.com";
            var userName = proposal.User?.FullName ?? "Valued Customer";
            var policyName = proposal.Policy?.PolicyName ?? "SecureDrive Auto Insurance";
            var subject = $"Payment Confirmation & Policy Active: {policyName}";

            var selectedAddOns = proposal.ProposalAddOns
                .Select(pa => pa.AddOn)
                .Where(a => a != null)
                .Cast<PolicyAddOn>()
                .ToList();

            var addOnsHtml = selectedAddOns.Any()
                ? "<ul>" + string.Join("", selectedAddOns.Select(a => $"<li>{a.AddOnName}</li>")) + "</ul>"
                : "<p>None</p>";

            var body = $@"
                <html>
                <body>
                    <h2>SecureDrive Insurance - Policy Confirmation</h2>
                    <p>Dear {userName},</p>
                    <p>Thank you for your payment of <b>₹{payment.Amount:N2}</b>. Your payment was processed successfully (Transaction Ref: {payment.TransactionRef}).</p>
                    <p>Your policy <b>{policyName}</b> is now <b>ACTIVE</b>! Below are your coverage details:</p>
                    <h3>Policy Details:</h3>
                    <p>
                        <b>Policy ID:</b> SD-{proposal.PolicyId}-{proposal.ProposalId}<br/>
                        <b>Coverage Period:</b> {DateTime.UtcNow.ToShortDateString()} to {DateTime.UtcNow.AddYears(1).ToShortDateString()}<br/>
                        <b>Vehicle:</b> {proposal.VehicleModel} ({proposal.VehicleNumber})
                    </p>
                    <h3>Included Add-ons:</h3>
                    {addOnsHtml}
                    <br/>
                    <p>Attached to your dashboard is your official downloadable Policy Document. Please keep a copy of this email for your records.</p>
                    <br/>
                    <p>Safe driving!</p>
                    <p>Best regards,</p>
                    <p>SecureDrive Insurance Team</p>
                </body>
                </html>";

            await _emailService.SendEmailAsync(userEmail, subject, body);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send payment confirmation email: {ex.Message}");
        }

        return new PaymentResponseDto
        {
            PaymentId = payment.PaymentId,
            ProposalId = payment.ProposalId,
            Amount = payment.Amount,
            Status = payment.Status,
            TransactionRef = payment.TransactionRef,
            PaymentDate = payment.PaymentDate
        };
    }
}