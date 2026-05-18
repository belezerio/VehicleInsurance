using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Authorize]
    public class JobsController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IUserRepository _userRepository;

        public JobsController(IEmailService emailService, IUserRepository userRepository)
        {
            _emailService = emailService;
            _userRepository = userRepository;
        }

        [HttpPost("trigger-reminders")]
        [Authorize(Roles = "Officer")]
        public async Task<IActionResult> TriggerReminders()
        {
            try
            {
                var email = User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(email))
                {
                    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    if (userIdClaim != null)
                    {
                        var userId = int.Parse(userIdClaim);
                        var user = await _userRepository.GetByIdAsync(userId);
                        email = user?.Email;
                    }
                }

                if (string.IsNullOrEmpty(email))
                {
                    email = "customer@example.com";
                }

                var subject = "Action Required: Premium Renewal Reminder";
                var body = @"
                    <html>
                    <body>
                        <h2>Premium Renewal Reminder</h2>
                        <p>Dear Policyholder,</p>
                        <p>This is an automated reminder from SecureDrive Insurance.</p>
                        <p>Your vehicle insurance policy is expiring in exactly <b>7 days</b>.</p>
                        <p>Please log in to your dashboard to complete the premium payment to keep your policy active and avoid any lapse in coverage.</p>
                        <br/>
                        <p>Thank you,</p>
                        <p>SecureDrive Insurance Team</p>
                    </body>
                    </html>";

                await _emailService.SendEmailAsync(email, subject, body);

                return Ok(new { message = "Cron job triggered. Reminders sent successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
