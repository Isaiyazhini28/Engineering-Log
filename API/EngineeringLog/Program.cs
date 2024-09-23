using EngineeringLog.Data;
using Microsoft.EntityFrameworkCore;
using EngineeringLog.Services.IServices;
using EngineeringLog.Services.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Setup connection to the database
builder.Services.AddDbContext<ApiContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("EngineeringLog")));

// 2. Add services to the container
builder.Services.AddScoped<IService, LogService>();
builder.Services.AddHttpClient<IClientUrlServices, ClientUrlServices>();
builder.Services.AddScoped<IHrmsAuthService, HrmsAuthService>();
builder.Services.AddHttpClient<IHrmsAuthService, HrmsAuthService>();


// 3. Add controllers
builder.Services.AddControllers();

// 4. Enable Swagger with JWT authentication support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "EngineeringLog API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// 5. Configure CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("cp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 6. Configure JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"])),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero // Optional: reduce clock skew
        };
    });

// 7. Build the app
var app = builder.Build();

// Enable Swagger in Development
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 8. Middleware setup
app.UseHttpsRedirection();
app.UseCors("cp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();