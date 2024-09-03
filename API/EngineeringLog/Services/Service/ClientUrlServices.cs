using EngineeringLog.Data;
using System.Net.Http;
using System.Text.Json;
using EngineeringLog.Data;
using EngineeringLog.Models.Entity;
using EngineeringLog.Models.Response;
using EngineeringLog.Services.IServices;

namespace EngineeringLog.Services.Service
{
    public class ClientUrlServices : IClientUrlServices
    {
        private readonly HttpClient _httpClient;
        public ClientUrlServices(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
        public async Task<List<BusinessUnitResponse>> GetBusinessUnitsByCountryIdAsync(string countryId)
        {
            // Define the request URL for fetching business units with the provided countryId
            var url = $"https://aikyamqasapi.nipponpaint.co.in/graphapi/api/Safety/GetBusinessUnitByCountry?id={countryId}";

            // Send an HTTP GET request to the specified URL
            var response = await _httpClient.GetAsync(url);

            // Ensure the HTTP response was successful (status code 2xx)
            response.EnsureSuccessStatusCode();

            // Read the response content as a string
            var jsonResponse = await response.Content.ReadAsStringAsync();

            // Deserialize the JSON response content into a list of BusinessUnitResponse objects
            var businessUnits = JsonSerializer.Deserialize<List<BusinessUnitResponse>>(jsonResponse, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            // Return the list of business units, or an empty list if the deserialized result is null
            return businessUnits ?? new List<BusinessUnitResponse>();
        }
        public async Task<List<PlantResponse>> GetPlantsByBusinessUnitIdAsync(string businessUnitId)
        {
            var url = $"https://aikyamqasapi.nipponpaint.co.in/graphapi/api/Safety/GetPlantByBussinessUnit?id={businessUnitId}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            var jsonResponse = await response.Content.ReadAsStringAsync();
            var plants = JsonSerializer.Deserialize<List<PlantResponse>>(jsonResponse, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            return plants ?? new List<PlantResponse>();
        }


    }
}
