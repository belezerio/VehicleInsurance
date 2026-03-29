namespace VehicleInsurance.Core.DTOs;

public class ProposalResponseDto
{
    public int ProposalId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int PolicyId { get; set; }
    public string PolicyName { get; set; } = string.Empty;
    public string VehicleNumber { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public int VehicleYear { get; set; }
    public string VehicleCategory { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string OfficerRemarks { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public List<AddOnResponseDto> SelectedAddOns { get; set; } = new();
}