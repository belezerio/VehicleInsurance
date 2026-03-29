using Microsoft.EntityFrameworkCore;
using VehicleInsurance.Core.Entities;

namespace VehicleInsurance.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Policy> Policies => Set<Policy>();
    public DbSet<PolicyAddOn> PolicyAddOns => Set<PolicyAddOn>();
    public DbSet<Proposal> Proposals => Set<Proposal>();
    public DbSet<ProposalAddOn> ProposalAddOns => Set<ProposalAddOn>();
    public DbSet<Quote> Quotes => Set<Quote>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Claim> Claims => Set<Claim>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<PolicyAddOn>()
        .HasKey(p => p.AddOnId);

    modelBuilder.Entity<ProposalAddOn>()
        .HasKey(p => p.ProposalAddOnId);

    // Unique email
    modelBuilder.Entity<User>()
        .HasIndex(u => u.Email)
        .IsUnique();

    // Decimal precision
    modelBuilder.Entity<Policy>()
        .Property(p => p.BasePrice)
        .HasColumnType("decimal(10,2)");

    modelBuilder.Entity<PolicyAddOn>()
        .Property(p => p.AddOnPrice)
        .HasColumnType("decimal(10,2)");

    modelBuilder.Entity<Quote>()
        .Property(q => q.PremiumAmount)
        .HasColumnType("decimal(10,2)");

    modelBuilder.Entity<Payment>()
        .Property(p => p.Amount)
        .HasColumnType("decimal(10,2)");

    modelBuilder.Entity<Claim>()
        .Property(c => c.ClaimAmount)
        .HasColumnType("decimal(10,2)");

    // One-to-one: Proposal -> Quote
    modelBuilder.Entity<Quote>()
        .HasOne(q => q.Proposal)
        .WithOne(p => p.Quote)
        .HasForeignKey<Quote>(q => q.ProposalId)
        .OnDelete(DeleteBehavior.NoAction);

    // Fix cascade cycles
    modelBuilder.Entity<Claim>()
        .HasOne(c => c.User)
        .WithMany(u => u.Claims)
        .HasForeignKey(c => c.UserId)
        .OnDelete(DeleteBehavior.NoAction);

    modelBuilder.Entity<Claim>()
        .HasOne(c => c.Proposal)
        .WithMany(p => p.Claims)
        .HasForeignKey(c => c.ProposalId)
        .OnDelete(DeleteBehavior.NoAction);

    modelBuilder.Entity<Proposal>()
        .HasOne(p => p.User)
        .WithMany(u => u.Proposals)
        .HasForeignKey(p => p.UserId)
        .OnDelete(DeleteBehavior.NoAction);

    modelBuilder.Entity<Payment>()
        .HasOne(p => p.Proposal)
        .WithMany(p => p.Payments)
        .HasForeignKey(p => p.ProposalId)
        .OnDelete(DeleteBehavior.NoAction);

    modelBuilder.Entity<ProposalAddOn>()
        .HasOne(pa => pa.Proposal)
        .WithMany(p => p.ProposalAddOns)
        .HasForeignKey(pa => pa.ProposalId)
        .OnDelete(DeleteBehavior.NoAction);
}
}