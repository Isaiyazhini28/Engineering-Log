using EngineeringLog.Data;
using Microsoft.EntityFrameworkCore;
using EngineeringLog.Data;
using EngineeringLog.Services.IServices;
using EngineeringLog.Services.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApiContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("EngineeringLog")));

builder.Services.AddScoped<IService, LogService>();
builder.Services.AddHttpClient<IClientUrlServices, ClientUrlServices>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
