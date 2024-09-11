using System.Text;
using System.Text.Json;
using EngineeringLog.Services.IServices;
namespace EngineeringLog.Services.Service
{
    public class HrmsAuthService : IHrmsAuthService
        {
            private readonly IConfiguration _configuration;
            private readonly HttpClient _httpClient;

            public HrmsAuthService(IConfiguration configuration, HttpClient httpClient)
            {
                _configuration = configuration;
                _httpClient = httpClient;
            }

            public async Task<Dictionary<string, object>> AuthenticateAsync(string userId, string password)
            {
                var loginUrl = _configuration["HrmsSettings:LoginUrl"];

                var requestBody = new
                {
                    EmployeeId = userId,
                    Password = password
                };

                var content = new StringContent(
                    JsonSerializer.Serialize(requestBody),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PostAsync(loginUrl, content);

                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }

                var data = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
                if (data != null && data.ContainsKey("Status") && data["Status"]?.ToString() == "Active")
                {
                    return data;
                }
                return null;
            }
        }
    }
