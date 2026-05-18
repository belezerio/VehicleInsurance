using System.Threading.Tasks;

namespace VehicleInsurance.Core.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
}
