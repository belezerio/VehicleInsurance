using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class QuotesController : ControllerBase
{
    private readonly IQuoteService _quoteService;

    public QuotesController(IQuoteService quoteService)
    {
        _quoteService = quoteService;
    }

    [HttpPost("{proposalId}/generate")]
    [Authorize(Roles = "Officer")]
    public async Task<IActionResult> GenerateQuote(int proposalId)
    {
        try
        {
            var quote = await _quoteService.GenerateQuoteAsync(proposalId);
            return Ok(quote);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{proposalId}")]
    public async Task<IActionResult> GetByProposalId(int proposalId)
    {
        var quote = await _quoteService.GetByProposalIdAsync(proposalId);
        if (quote == null)
            return NotFound(new { message = "No quote found for this proposal." });
        return Ok(quote);
    }
}