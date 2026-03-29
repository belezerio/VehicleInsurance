namespace VehicleInsurance.Core.Entities;

public class ProposalAddOn
{
    public int ProposalAddOnId { get; set; }
    public int ProposalId { get; set; }
    public int AddOnId { get; set; }

    public Proposal Proposal { get; set; } = null!;
    public PolicyAddOn AddOn { get; set; } = null!;
}