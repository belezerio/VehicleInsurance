namespace VehicleInsurance.Core.Helpers;

public class ProposalQueryParams
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Status { get; set; }
    public string? VehicleCategory { get; set; }
    public string SortBy { get; set; } = "submittedAt";
    public string SortOrder { get; set; } = "desc";
}

public class ClaimQueryParams
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Status { get; set; }
    public string SortBy { get; set; } = "filedAt";
    public string SortOrder { get; set; } = "desc";
}