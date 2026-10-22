
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RecipeBoxApi.Models;

namespace RecipeBoxApi.Controllers
{
    public record RegisterRequest(
        string Name,
        string Email,
        string Password
    );

    public record LoginRequest(
        string Email,
        string Password
    );

    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _users;
        private readonly SignInManager<AppUser> _signIn;

        public AuthController(
            UserManager<AppUser> users,
            SignInManager<AppUser> signIn)
        {
            _users = users;
            _signIn = signIn;
        }

        private async Task<object> GetUserResponse(AppUser user)
        {
            var roles = await _users.GetRolesAsync(user);

            return new
            {
                name = user.DisplayName,
                email = user.Email,
                role = roles.Contains("Admin") ? "Admin" : "User"
            };
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new
                {
                    message = "יש למלא את כל השדות"
                });
            }

            var email = request.Email.Trim();

            var user = new AppUser
            {
                UserName = email,
                Email = email,
                DisplayName = request.Name.Trim()
            };

            var result = await _users.CreateAsync(
                user,
                request.Password
            );

            if (!result.Succeeded)
            {
                return BadRequest(new
                {
                    message = "ההרשמה נכשלה",
                    errors = result.Errors.Select(
                        error => error.Description
                    )
                });
            }

            await _signIn.SignInAsync(
                user,
                isPersistent: false
            );

            return Ok(await GetUserResponse(user));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(
            LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new
                {
                    message = "יש להזין אימייל וסיסמה"
                });
            }

            var user = await _users.FindByEmailAsync(
                request.Email.Trim()
            );

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "אימייל או סיסמה שגויים"
                });
            }

            var result = await _signIn.PasswordSignInAsync(
                user,
                request.Password,
                isPersistent: false,
                lockoutOnFailure: true
            );

            if (!result.Succeeded)
            {
                return Unauthorized(new
                {
                    message = "אימייל או סיסמה שגויים"
                });
            }

            return Ok(await GetUserResponse(user));
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var user = await _users.GetUserAsync(User);

            if (user == null)
                return Unauthorized();

            return Ok(await GetUserResponse(user));
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signIn.SignOutAsync();

            return Ok(new
            {
                message = "התנתקת בהצלחה"
            });
        }
    }
}
