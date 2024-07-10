using EmployeeProfile.Data;
using EmployeeProfile.Models.Entity;
using EmployeeProfile.Models.Request;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.Design;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace EmployeeProfile.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApiContext context;
        private readonly IConfiguration Configuration;
        public UserController(ApiContext empcontext,IConfiguration configuration)
        {
            context = empcontext;
            Configuration = configuration;
        }
        
        [HttpPost("Registration")]
        public IActionResult Registration(UserRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var alruser = context.Users.FirstOrDefault(x => x.Username == request.username);
            if (alruser == null)
            {
                context.Users.Add(new User
                {
                    
                    Username = request.username,
                    password = request.password,

                });
                context.SaveChanges();
                return Ok("registration success");
            }
            else 
            {
                return BadRequest("user already exist with same username");
            }

        }

        [HttpPost("Login")]
        public IActionResult Login(Login login)
        {
            var user=context.Users.FirstOrDefault(x => x.Username == login.Username && x.password == login.password);
            if (user != null) 
            {
                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, Configuration["Jwt:Subject"]),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("Id",user.Id.ToString()),
                    new Claim("username",user.Username.ToString()),

                };
                var key =new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]));
                var signin=new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken(
                    Configuration["Jwt:Issuer"],
                    Configuration["Jwt:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddMinutes(60),
                    signingCredentials: signin);
                string tokenvalue=new JwtSecurityTokenHandler().WriteToken(token);
                return Ok(new { Token=tokenvalue,User=user});

            }
            
            return NoContent();
        }
    }
}
