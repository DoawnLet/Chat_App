using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Polly;

namespace ChatApp.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController(IAuthenticationService service) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<ActionResult> Login(UserLoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var login = await service.LoginAsync(dto);
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Development: false để cho phép HTTP localhost
                SameSite = SameSiteMode.Lax, // Lax cho development
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddDays(7),
            };

            Response.Cookies.Append("token", login.Message, cookieOptions);

            return login.Flag ? Ok(login) : BadRequest(Request);
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(UserRegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var register = await service.RegisterAsync(dto);
            Console.WriteLine(
                $"Controller received response: Flag={register.Flag}, Message={register.Message}"
            );
            return register.Flag ? Ok(register) : BadRequest(register);
        }
    }
}