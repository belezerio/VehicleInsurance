using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehicleInsurance.Infrastructure.Data;

namespace VehicleInsurance.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class StatsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StatsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetStats()
    {
        var activePolicies = await _context.Proposals
            .CountAsync(p => p.Status == "Active");
        var claimsServed = await _context.Claims
            .CountAsync(c => c.Status == "Approved");
        var totalCustomers = await _context.Users
            .CountAsync(u => u.Role == "User");

        return Ok(new
        {
            activePolicies,
            claimsServed,
            totalCustomers
        });
    }
}