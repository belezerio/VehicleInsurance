namespace VehicleInsurance.Core.DTOs;

public class PolicyCreateDto
{
    public string PolicyName { get; set; } = string.Empty;
    public string VehicleCategory { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public bool IsActive { get; set; } = true;
    public List<AddOnDto> AddOns { get; set; } = new();
}

public class AddOnDto
{
    public string AddOnName { get; set; } = string.Empty;
    public decimal AddOnPrice { get; set; }
}