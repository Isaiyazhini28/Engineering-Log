using EngineeringLog.Models.Response;

namespace EngineeringLog.Services.IServices
{
    public interface IMasterServices
    {
        Task<List<BusinessUnitResponse>> GetBusinessUnitsByCountryIdAsync(string countryId);
        Task<List<PlantResponse>> GetPlantsByBusinessUnitIdAsync(string businessUnitId);
    }
}
