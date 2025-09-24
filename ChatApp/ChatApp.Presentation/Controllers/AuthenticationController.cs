using ChatApp.Application.Abstractions.IServices;
using ChatApp.Application.DTOs;
using ChatApp.Application.Exceptions.Responses;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController(IAuthenticationService service) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<ActionResult> Lgin(UserLoginDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var login = await service.LoginAsync(dto);
            return login.Flag ? Ok(login) : BadRequest(Request);
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(UserRegisterDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var register = await service.RegisterAsync(dto);
            return register.Flag ? Ok(register) : BadRequest(Request);
        }
    }
}