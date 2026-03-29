namespace VehicleInsurance.Core.DTOs;

public class PolicyResponseDto
{
    public int PolicyId { get; set; }
    public string PolicyName { get; set; } = string.Empty;
    public string VehicleCategory { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public bool IsActive { get; set; }
    public List<AddOnResponseDto> AddOns { get; set; } = new();
}

public class AddOnResponseDto
{
    public int AddOnId { get; set; }
    public string AddOnName { get; set; } = string.Empty;
    public decimal AddOnPrice { get; set; }
}