namespace VehicleInsurance.Core.DTOs;

public class PaymentResponseDto
{
    public int PaymentId { get; set; }
    public int ProposalId { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string TransactionRef { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
}