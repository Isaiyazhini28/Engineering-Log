using EngineeringLog.Models.Entity;
namespace EngineeringLog.Models.Response
{
    public class TransactionLogResponse
    {
        public int LogID { get; set; }
        public int TransactionId { get; set; }
        public string ReferenceId { get; set; } 
        public string CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Action { get; set; }
        public ActivityType ActivityType { get; set; }
    }
}
