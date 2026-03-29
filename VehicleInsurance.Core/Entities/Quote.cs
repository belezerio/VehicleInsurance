namespace VehicleInsurance.Core.Entities;

public class Quote
{
    public int QuoteId { get; set; }
    public int ProposalId { get; set; }
    public decimal PremiumAmount { get; set; }
    public DateTime ValidUntil { get; set; }
    public bool IsEmailSent { get; set; } = false;
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

    public Proposal Proposal { get; set; } = null!;
}