namespace VehicleInsurance.Core.DTOs;

public class ClaimResponseDto
{
    public int ClaimId { get; set; }
    public int ProposalId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string ClaimDescription { get; set; } = string.Empty;
    public decimal ClaimAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string OfficerRemarks { get; set; } = string.Empty;
    public DateTime FiledAt { get; set; }
}