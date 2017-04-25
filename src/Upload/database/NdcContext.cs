using Microsoft.EntityFrameworkCore;
using System;

namespace Upload.database
{
    public class NdcContext : DbContext
    {
        public DbSet<User> User { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var connectionString = Environment.GetEnvironmentVariable("SQLAZURECONNSTR_NDC");
            optionsBuilder.UseSqlServer(connectionString);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>(u =>
            {
                u.Property(e => e.Id).ForSqlServerHasColumnType("int");
                u.Property(e => e.Name).HasMaxLength(100).IsUnicode(false);
                u.Property(e => e.Email).HasMaxLength(100).IsUnicode(false);
                u.Property(e => e.Company).HasMaxLength(100).IsUnicode(false);
                u.Property(e => e.TwitterHandle).HasMaxLength(100).IsUnicode(false);
                u.HasMany(e => e.Photos);
            });

            builder.Entity<Photo>(p =>
            {
                p.Property(e => e.Id).ForSqlServerHasColumnType("uniqueidentifier");
                p.Property(e => e.BlobUri).HasMaxLength(200).IsUnicode(false);
            });
        }

    }
}
