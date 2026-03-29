namespace VehicleInsurance.Core.DTOs;

public class ProposalSubmitDto
{
    public int PolicyId { get; set; }
    public string VehicleNumber { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public int VehicleYear { get; set; }
    public string VehicleCategory { get; set; } = string.Empty;
    public List<int> SelectedAddOnIds { get; set; } = new();
}