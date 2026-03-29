namespace VehicleInsurance.Core.DTOs;

public class QuoteResponseDto
{
    public int QuoteId { get; set; }
    public int ProposalId { get; set; }
    public decimal PremiumAmount { get; set; }
    public DateTime ValidUntil { get; set; }
    public DateTime GeneratedAt { get; set; }
}