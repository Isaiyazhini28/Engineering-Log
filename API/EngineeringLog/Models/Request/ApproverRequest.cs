namespace EngineeringLog.Models.Request
{
    public class ApproverRequest
    {
        public List<TransactionsIdRequest> Transactions { get; set; }
        public bool IsApproved { get; set; }
        public string EmpId { get; set; }
    }

    public class TransactionsIdRequest
    {
        public int TransactionId { get; set; } 
        public string Remarks { get; set; }
    }
}
