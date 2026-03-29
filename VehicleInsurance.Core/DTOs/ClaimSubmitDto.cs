namespace VehicleInsurance.Core.DTOs;

public class ClaimSubmitDto
{
    public int ProposalId { get; set; }
    public string ClaimDescription { get; set; } = string.Empty;
    public decimal ClaimAmount { get; set; }
}