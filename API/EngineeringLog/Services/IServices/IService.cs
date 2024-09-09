using EngineeringLog.Models.Request;
using EngineeringLog.Models.Response;

namespace EngineeringLog.Services.IServices
{
    public interface IService
    {
        MapResponse GetMapByPlantId(string plantId);
        List<LocationResponse> GetLocations();
        FieldFrequencyResponse GetFields(int locationId);
        Task<List<TransactionEntryResponse>> CreateTransaction(TransactionRequest request);
        Task<FieldFrequencyResponse> GetLastReadings(int locationId);
        Task<FieldFrequencyResponse> MTDAverage(int locationId);
        Task<List<AvgResponse>> PreviousMonthAverage(int locationId);
    }
}



