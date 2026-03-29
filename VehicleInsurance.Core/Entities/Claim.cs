namespace VehicleInsurance.Core.Entities;

public class Claim
{
    public int ClaimId { get; set; }
    public int ProposalId { get; set; }
    public int UserId { get; set; }
    public string ClaimDescription { get; set; } = string.Empty;
    public decimal ClaimAmount { get; set; }
    public string Status { get; set; } = "Filed";
    public string OfficerRemarks { get; set; } = string.Empty;
    public DateTime FiledAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Proposal Proposal { get; set; } = null!;
    public User User { get; set; } = null!;
}