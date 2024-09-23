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
        Task<FieldFrequencyResponse> PreviousMonthAverage(int locationId);
        Task<List<TransactionEntryResponse>> UpdateTransaction(TransactionUpdateRequest request);
        Task<TransactionLogResponse> GetTransactionLogById(int transactionId);
       /* Task<ViewPageResponse> GetViewPageData(int locationId);*/
    }
}



