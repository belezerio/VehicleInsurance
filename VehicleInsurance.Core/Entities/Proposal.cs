namespace VehicleInsurance.Core.Entities;

public class Proposal
{
    public int ProposalId { get; set; }
    public int UserId { get; set; }
    public int PolicyId { get; set; }
    public string VehicleNumber { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public int VehicleYear { get; set; }
    public string VehicleCategory { get; set; } = string.Empty;
    public string Status { get; set; } = "ProposalSubmitted";
    public string OfficerRemarks { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Policy Policy { get; set; } = null!;
    public ICollection<ProposalAddOn> ProposalAddOns { get; set; } = new List<ProposalAddOn>();
    public Quote? Quote { get; set; }
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public ICollection<Claim> Claims { get; set; } = new List<Claim>();
}