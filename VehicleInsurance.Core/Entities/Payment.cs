namespace VehicleInsurance.Core.Entities;

public class Payment
{
    public int PaymentId { get; set; }
    public int ProposalId { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending";
    public string TransactionRef { get; set; } = string.Empty;

    public Proposal Proposal { get; set; } = null!;
}