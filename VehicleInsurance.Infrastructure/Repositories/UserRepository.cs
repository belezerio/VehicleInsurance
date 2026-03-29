using Microsoft.EntityFrameworkCore;
using VehicleInsurance.Core.Entities;
using VehicleInsurance.Core.Interfaces;
using VehicleInsurance.Infrastructure.Data;

namespace VehicleInsurance.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;
    public UserRepository(AppDbContext context) { _context = context; }

    public async Task<User?> GetByIdAsync(int userId) =>
        await _context.Users.FindAsync(userId);

    public async Task<User?> GetByEmailAsync(string email) =>
        await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<IEnumerable<User>> GetAllAsync() =>
        await _context.Users.ToListAsync();

    public async Task<User> AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
}