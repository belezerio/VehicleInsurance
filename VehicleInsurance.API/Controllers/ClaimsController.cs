using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class ClaimsController : ControllerBase
{
    private readonly IClaimService _claimService;

    public ClaimsController(IClaimService claimService)
    {
        _claimService = claimService;
    }

    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> FileClaim([FromBody] ClaimSubmitDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var claim = await _claimService.FileClaimAsync(userId, dto);
            return CreatedAtAction(nameof(GetMyClaims), claim);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("my-claims")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> GetMyClaims()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var claims = await _claimService.GetUserClaimsAsync(userId);
        return Ok(claims);
    }

    [HttpGet]
    [Authorize(Roles = "Officer")]
    public async Task<IActionResult> GetAll()
    {
        var claims = await _claimService.GetAllAsync();
        return Ok(claims);
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Officer")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] ClaimStatusUpdateDto dto)
    {
        try
        {
            await _claimService.UpdateStatusAsync(id, dto);
            return Ok(new { message = "Claim status updated successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}