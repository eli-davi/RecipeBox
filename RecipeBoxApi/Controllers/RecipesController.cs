
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RecipeBoxApi.Data;
using RecipeBoxApi.Models;
using Microsoft.AspNetCore.Authorization;

namespace RecipeBoxApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipesController : ControllerBase
    {
        private readonly RecipeDbContext _context;

        public RecipesController(RecipeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Recipe>>> GetAll()
        {
            return await _context.Recipes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Recipe>> GetById(int id)
        {
            Recipe? recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
                return NotFound();

            return Ok(recipe);
        }
[Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Recipe>> Add(Recipe recipe)
        {
            recipe.Id = 0;

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return Ok(recipe);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Recipe updatedRecipe)
        {
            Recipe? recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
                return NotFound();

            recipe.Name = updatedRecipe.Name;
            recipe.Description = updatedRecipe.Description;
            recipe.Category = updatedRecipe.Category;
            recipe.PreparationTime = updatedRecipe.PreparationTime;
            recipe.Difficulty = updatedRecipe.Difficulty;
            recipe.Ingredients = updatedRecipe.Ingredients;
            recipe.Instructions = updatedRecipe.Instructions;
            recipe.ImageUrl = updatedRecipe.ImageUrl;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            Recipe? recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
                return NotFound();

            _context.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
