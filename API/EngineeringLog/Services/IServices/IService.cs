using EngineeringLog.Models.Request;
using EngineeringLog.Models.Response;

namespace EngineeringLog.Services.IServices
{
    public interface IService
    {
        MapResponse GetMapByPlantId(string plantId);
        List<LocationResponse> GetLocations();

        FieldFrequencyResponse GetFields(int locationId);
        Task<string> CreateTransaction(TransactionRequest request);
        Task<List<PreviousReadingResponse>> GetLastReadings(int locationId);
        Task<List<AvgResponse>> MTDAverage(int locationId);
        Task<List<AvgResponse>> PreviousMonthAverage(int locationId);
    }
}



