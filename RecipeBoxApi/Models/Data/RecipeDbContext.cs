using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RecipeBoxApi.Models;

namespace RecipeBoxApi.Data
{
    public class RecipeDbContext : IdentityDbContext<AppUser>
    {
        public RecipeDbContext(
            DbContextOptions<RecipeDbContext> options
        ) : base(options)
        {
        }

        public DbSet<Recipe> Recipes { get; set; }

        public DbSet<Favorite> Favorites { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Favorite>()
                .HasKey(f => new { f.UserId, f.RecipeId });

            builder.Entity<Favorite>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId);

            builder.Entity<Favorite>()
                .HasOne(f => f.Recipe)
                .WithMany()
                .HasForeignKey(f => f.RecipeId);
        }
    }
}