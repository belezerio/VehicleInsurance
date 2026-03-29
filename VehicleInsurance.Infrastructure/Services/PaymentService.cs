using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.Infrastructure.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepo;
    private readonly IProposalRepository _proposalRepo;
    private readonly IQuoteRepository _quoteRepo;

    public PaymentService(IPaymentRepository paymentRepo,
        IProposalRepository proposalRepo, IQuoteRepository quoteRepo)
    {
        _paymentRepo = paymentRepo;
        _proposalRepo = proposalRepo;
        _quoteRepo = quoteRepo;
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