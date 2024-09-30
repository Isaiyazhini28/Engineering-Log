namespace EngineeringLog.Models.Request
{
    public class UpdateTransactionStatusRequest
    {
        public int TransactionId { get; set; }
        public bool Submitted { get; set; }
        public string EmployeeId { get; set; }
        public string Remark { get; set; }
    }
}
