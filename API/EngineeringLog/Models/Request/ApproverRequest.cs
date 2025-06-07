namespace EngineeringLog.Models.Request
{
    public class ApproverRequest
    {
        public List<int> TransactionsId { get; set; }
        public string Remark { get; set; } // Changed to PascalCase
        public bool IsApproved { get; set; }
        public string EmpId { get; set; }
    }
}
