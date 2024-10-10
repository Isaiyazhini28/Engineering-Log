namespace EngineeringLog.Models.Request
{
    public class ActivityLogCommentRequest
    {
        public int TransactionId { get; set; } 
        public string Comment { get; set; } 
        public string EmpId { get; set; }
    }
}
