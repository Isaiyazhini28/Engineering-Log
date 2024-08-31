using EngineeringLog.Models.Response;

namespace EngineeringLog.Services.IServices
{
    public interface IService
    {
        MapResponse GetMapByPlantId(string plantId);
        List<LocationResponse> GetLocations();

        FieldFrequencyResponse GetFields(int locationId);
    }
}


