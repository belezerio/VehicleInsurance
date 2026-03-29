namespace VehicleInsurance.Core.Entities;

public class PolicyAddOn
{
    public int AddOnId { get; set; }
    public int PolicyId { get; set; }
    public string AddOnName { get; set; } = string.Empty;
    public decimal AddOnPrice { get; set; }

    public Policy Policy { get; set; } = null!;
    public ICollection<ProposalAddOn> ProposalAddOns { get; set; } = new List<ProposalAddOn>();
}