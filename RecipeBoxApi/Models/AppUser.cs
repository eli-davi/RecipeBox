
using Microsoft.AspNetCore.Identity;

namespace RecipeBoxApi.Models
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; } = "";
    }
}
