using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class PoliciesController : ControllerBase
{
    private readonly IPolicyService _policyService;

    public PoliciesController(IPolicyService policyService)
    {
        _policyService = policyService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var policies = await _policyService.GetAllAsync();
        return Ok(policies);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var policy = await _policyService.GetByIdAsync(id);
        if (policy == null)
            return NotFound(new { message = "Policy not found." });
        return Ok(policy);
    }

    [HttpPost]
    [Authorize(Roles = "Officer")]
    public async Task<IActionResult> Create([FromBody] PolicyCreateDto dto)
    {
        try
        {
            var policy = await _policyService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = policy.PolicyId }, policy);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Officer")]
    public async Task<IActionResult> Update(int id, [FromBody] PolicyCreateDto dto)
    {
        try
        {
            await _policyService.UpdateAsync(id, dto);
            return Ok(new { message = "Policy updated successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}