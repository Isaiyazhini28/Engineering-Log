namespace EngineeringLog.Models.Response
{
    public class TransactionLogResponse
    {
        public int TransactionId { get; set; }
        public string ReferenceId { get; set; } // Assuming ReferenceId is a string
        public string CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedAt { get; set; } // Nullable in case it has not been modified
        public string Action { get; set; }
    }
}
