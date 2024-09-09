using EngineeringLog.Models.Response;

namespace EngineeringLog.Services.IServices
{
    public interface IClientUrlServices
    {
        Task<List<BusinessUnitResponse>> GetBusinessUnitsByCountryIdAsync(string countryId);
        Task<List<PlantResponse>> GetPlantsByBusinessUnitIdAsync(string businessUnitId);
    }
}
