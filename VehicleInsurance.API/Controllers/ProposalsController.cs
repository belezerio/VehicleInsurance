using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ProposalsController : ControllerBase
{
    private readonly IProposalService _proposalService;

    public ProposalsController(IProposalService proposalService)
    {
        _proposalService = proposalService;
    }

    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> Submit([FromBody] ProposalSubmitDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var proposal = await _proposalService.SubmitAsync(userId, dto);
            return CreatedAtAction(nameof(GetMyProposals), proposal);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("my-proposals")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> GetMyProposals()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var proposals = await _proposalService.GetUserProposalsAsync(userId);
        return Ok(proposals);
    }

    [HttpGet]
    [Authorize(Roles = "Officer")]
    public async Task<IActionResult> GetAll()
    {
        var proposals = await _proposalService.GetAllAsync();
        return Ok(proposals);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Officer")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] ProposalStatusUpdateDto dto)
    {
        try
        {
            await _proposalService.UpdateStatusAsync(id, dto);
            return Ok(new { message = "Proposal status updated successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}