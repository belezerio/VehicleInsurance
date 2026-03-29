namespace VehicleInsurance.Core.Entities;

public class Policy
{
    public int PolicyId { get; set; }
    public string PolicyName { get; set; } = string.Empty;
    public string VehicleCategory { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<PolicyAddOn> AddOns { get; set; } = new List<PolicyAddOn>();
    public ICollection<Proposal> Proposals { get; set; } = new List<Proposal>();
}