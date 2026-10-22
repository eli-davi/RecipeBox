
namespace RecipeBoxApi.Models
{
    public class Recipe
    {
        public int Id { get; set; }

        public string Name { get; set; } = "";

        public string Description { get; set; } = "";

        public string Category { get; set; } = "";

        public int PreparationTime { get; set; }

        public string Difficulty { get; set; } = "";

        public List<string> Ingredients { get; set; } = new();

        public string Instructions { get; set; } = "";

        public string ImageUrl { get; set; } = "";
    }
}
