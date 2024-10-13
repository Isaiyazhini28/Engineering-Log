using EngineeringLog.Models.Entity;
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
        //Task<ViewPageResponse> GetViewPage(int locationId);
        Task<ViewPageGridResponse> GetViewPageGrid(int pageNo, int pageSize, int locationId);
        Task<TransactionDetaiedResponse> GetTransactionDetails(int transactionId);
        Task<List<TransactionLogResponse>> GetTransactionLogById(int transactionId);
        Task<int> AddComment(ActivityLogCommentRequest request);
        //ApproverPage
        Task<TransaApproverResponse> TransactionsApproval(ApproverRequest request);
        Task<ViewPageGridResponse> GetReportPage(int locationId, DateTime startDate, DateTime endDate, int pageNo, int pageSize, int? status = null);

        //Task<List<TransactionEntryResponse>> UpdateTransaction(TransactionUpdateRequest request);  


    }
}
