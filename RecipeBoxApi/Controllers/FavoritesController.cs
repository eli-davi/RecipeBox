using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeBoxApi.Data;
using RecipeBoxApi.Models;


namespace RecipeBoxApi.Controllers
{
    [ApiController]
    [Route("api/favorites")]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly RecipeDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public FavoritesController(
            RecipeDbContext context,
            UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetFavorites()
        {
            string? userId = _userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            var recipes = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Select(f => f.Recipe)
                .ToListAsync();

            return Ok(recipes);
        }

        [HttpGet("ids")]
        public async Task<IActionResult> GetFavoriteIds()
        {
            string? userId = _userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            var ids = await _context.Favorites
                .Where(f => f.UserId == userId)
                .Select(f => f.RecipeId)
                .ToListAsync();

            return Ok(ids);
        }

        [HttpPost("{recipeId:int}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddFavorite(int recipeId)
        {
            string? userId = _userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            bool recipeExists = await _context.Recipes
                .AnyAsync(r => r.Id == recipeId);

            if (!recipeExists)
                return NotFound("המתכון לא נמצא");

            bool alreadyExists = await _context.Favorites
                .AnyAsync(f =>
                    f.UserId == userId &&
                    f.RecipeId == recipeId);

            if (alreadyExists)
                return Ok();

            _context.Favorites.Add(new Favorite
            {
                UserId = userId,
                RecipeId = recipeId
            });

            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{recipeId:int}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> RemoveFavorite(int recipeId)
        {
            string? userId = _userManager.GetUserId(User);

            if (userId == null)
                return Unauthorized();

            var favorite = await _context.Favorites
                .FindAsync(userId, recipeId);

            if (favorite == null)
                return NotFound();

            _context.Favorites.Remove(favorite);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}