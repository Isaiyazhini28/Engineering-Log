using EngineeringLog.Models.Request;
using EngineeringLog.Models.Response;

namespace EngineeringLog.Services.IServices
{
    public interface IService
    {
        MapResponse GetMapByPlantId(string plantId);
        List<LocationResponse> GetLocations(int frequency);
        Task<FieldFrequencyResponse> GetFields(int locationId);
        Task<List<TransactionEntryResponse>> CreateTransaction(TransactionRequest request);
        Task<List<TransactionEntryResponse>> UpdateTransaction(TransactionUpdateRequest request);




        Task<TransactionLogResponse> GetTransactionLogById(int transactionId);
        Task<ApproverResponse> ApproveTransaction(int transactionId, ApproverRequest request);
        Task<ApproverResponse> RejectTransaction(int transactionId, ApproverRequest request);
        Task<MultipleTransaApproverResponse> CompleteMultipleTransactions(MultipleTransaApproverRequest request);


      
    }
}



