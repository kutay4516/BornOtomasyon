using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using BornOtomasyon.API.Models;

namespace BornOtomasyon.API.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<FormData> FormData { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<FormData>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Text1).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Num1).IsRequired();
                entity.Property(e => e.Date1).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure ApplicationUser additional properties
            builder.Entity<ApplicationUser>(entity =>
            {
                entity.Property(e => e.IsEmailConfirmed).HasDefaultValue(false);
                entity.Property(e => e.EmailConfirmationToken).HasMaxLength(500);
                //entity.Property(e => e.PasswordResetToken).HasMaxLength(500);
            });
        }
    }
}