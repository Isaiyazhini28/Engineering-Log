using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using EngineeringLog.Services.IServices;

namespace EngineeringLog.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IHrmsAuthService _hrmsAuthService;
        private readonly IConfiguration _configuration;

        public AuthController(IHrmsAuthService hrmsAuthService, IConfiguration configuration)
        {
            _hrmsAuthService = hrmsAuthService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid request data");

            var user = await _hrmsAuthService.AuthenticateAsync(loginDto.UserId, loginDto.Password);
            if (user == null)
                return Unauthorized(new { message = "Invalid login attempt." });

            var token = GenerateJwtToken(user["EmployeeId"].ToString());

            return Ok(new
            {
                token,
                user = new
                {
                    id = user["EmployeeId"].ToString(),
                    name = user["Name"].ToString(),
                    designation = user["Designation"].ToString(),
                    mobile = user["mobile"].ToString()
                }
            });
        }
        private string GenerateJwtToken(string userId)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userId),
                    new Claim(ClaimTypes.Name, userId)
                }),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_configuration["JwtSettings:ExpiryMinutes"])),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    public class LoginDto
    {
        public string UserId { get; set; }
        public string Password { get; set; }
    }
}