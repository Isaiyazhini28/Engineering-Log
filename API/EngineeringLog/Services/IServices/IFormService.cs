using EngineeringLog.Models.Request;
using EngineeringLog.Models.Response;

namespace EngineeringLog.Services.IServices
{
    public interface IFormService
    {
        
        //Task<string>CreateTransaction(TransactionRequest request
        //Task<List<TransactionEntryResponse>> UpdateTransaction(TransactionUpdateRequest request);
        Task<ViewPageResponse> GetViewPage(int locationId);
        Task<List<TransactionLogResponse>> GetTransactionLogById(int transactionId); 
        Task<ApproverResponse> ApproveTransaction(int transactionId, ApproverRequest request);
        Task<MultipleTransaApproverResponse> CompleteMultipleTransactions(MultipleTransaApproverRequest request);

        Task<int> CreateTransaction(CreateTransactionRequest request);
        Task<string> UpdateTransactionStatus(UpdateTransactionStatusRequest request);
        Task<TransactionValueResponse> GetOpenTransactionValues(int locationId);
        Task<int> UpdateTransactionValue(UpdateTransactionValueRequest request);
    }
}
