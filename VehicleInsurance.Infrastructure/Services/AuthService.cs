using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using VehicleInsurance.Core.DTOs;
using VehicleInsurance.Core.Interfaces;
using BC = BCrypt.Net.BCrypt;
using UserEntity = VehicleInsurance.Core.Entities.User;

namespace VehicleInsurance.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IConfiguration _config;

    public AuthService(IUserRepository userRepo, IConfiguration config)
    {
        _userRepo = userRepo;
        _config = config;
    }

    public async Task<string> RegisterAsync(RegisterDto dto)
    {
        var existing = await _userRepo.GetByEmailAsync(dto.Email);
        if (existing != null)
            throw new Exception("Email is already registered.");

        var user = new UserEntity
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BC.HashPassword(dto.Password),
            DateOfBirth = dto.DateOfBirth,
            AadhaarNumber = dto.AadhaarNumber,
            PanNumber = dto.PanNumber,
            Address = dto.Address,
            Role = "User"
        };

        await _userRepo.AddAsync(user);
        return GenerateJwtToken(user);
    }

    public async Task<string> LoginAsync(LoginDto dto)
    {
        var user = await _userRepo.GetByEmailAsync(dto.Email);
        if (user == null || !BC.Verify(dto.Password, user.PasswordHash))
            throw new Exception("Invalid email or password.");

        return GenerateJwtToken(user);
    }

    private string GenerateJwtToken(UserEntity user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(ClaimTypes.Name, user.FullName)
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(double.Parse(_config["Jwt:ExpiryHours"]!)),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}