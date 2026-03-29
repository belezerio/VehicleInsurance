using VehicleInsurance.Core.DTOs;

namespace VehicleInsurance.Core.Interfaces;

public interface IAuthService
{
    Task<string> RegisterAsync(RegisterDto dto);
    Task<string> LoginAsync(LoginDto dto);
}