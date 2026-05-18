using System;
using System.IO;
using System.Net.Mail;
using System.Threading.Tasks;
using VehicleInsurance.Core.Interfaces;

namespace VehicleInsurance.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        public Task SendEmailAsync(string to, string subject, string body)
        {
            var smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST");
            var smtpPortStr = Environment.GetEnvironmentVariable("SMTP_PORT");
            int smtpPort = 1025;
            if (!string.IsNullOrEmpty(smtpPortStr))
            {
                int.TryParse(smtpPortStr, out smtpPort);
            }

            using (var client = new SmtpClient())
            {
                if (!string.IsNullOrEmpty(smtpHost))
                {
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;
                    client.Host = smtpHost;
                    client.Port = smtpPort;
                }
                else
                {
                    var directory = Path.Combine(Directory.GetCurrentDirectory(), "Emails");
                    if (!Directory.Exists(directory))
                    {
                        Directory.CreateDirectory(directory);
                    }
                    client.DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory;
                    client.PickupDirectoryLocation = directory;
                    client.Host = "localhost";
                }

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("noreply@securedrive.com", "SecureDrive Insurance"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                mailMessage.To.Add(to);

                client.Send(mailMessage);
            }

            return Task.CompletedTask;
        }
    }
}
