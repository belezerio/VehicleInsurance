using Microsoft.EntityFrameworkCore;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Interfaces;
using VehicleInsurance.Infrastructure.Data;

namespace VehicleInsurance.Infrastructure.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly AppDbContext _context;
    public PaymentRepository(AppDbContext context) { _context = context; }

    public async Task<Payment> AddAsync(Payment payment)
    {
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();
        return payment;
    }

    public async Task<IEnumerable<Payment>> GetByProposalIdAsync(int proposalId) =>
        await _context.Payments.Where(p => p.ProposalId == proposalId).ToListAsync();
}