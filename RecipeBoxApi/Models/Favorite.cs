namespace RecipeBoxApi.Models
{
    public class Favorite
    {
        public string UserId { get; set; } = "";

        public int RecipeId { get; set; }

        public AppUser User { get; set; } = null!;

        public Recipe Recipe { get; set; } = null!;
    }
}