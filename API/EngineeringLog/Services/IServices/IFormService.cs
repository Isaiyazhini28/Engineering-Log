using EngineeringLog.Models.Request;
using EngineeringLog.Models.Response;

namespace EngineeringLog.Services.IServices
{
    public interface IFormService
    {
        //InsertPage
        Task<int> CreateTransaction(CreateTransactionRequest request);

        Task<TransactionValueResponse> GetOpenTransactionValues(int locationId);
        Task<string> UpdateTransactionStatus(UpdateTransactionStatusRequest request);
        Task<string> UpdateTransactionValue(UpdateTransactionValueRequest request);

        //ViewPage
        Task<ViewPageResponse> GetViewPage(int locationId);
        Task<List<TransactionLogResponse>> GetTransactionLogById(int transactionId); 
        //ApproverPage
        Task<ApproverResponse> ApproveTransaction(int transactionId, ApproverRequest request);
        Task<MultipleTransaApproverResponse> CompleteMultipleTransactions(MultipleTransaApproverRequest request);

        //Task<List<TransactionEntryResponse>> UpdateTransaction(TransactionUpdateRequest request);  


    }
}
