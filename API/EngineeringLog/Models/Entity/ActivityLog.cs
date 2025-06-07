using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EngineeringLog.Models.Entity
{
    public class ActivityLog
    {
        [Key]
        public int LogID { get; set; }

        [ForeignKey("TransactionEntries")]
        public int TransactionId { get; set; }
        public TransactionEntries Transaction { get; set; }
        public string Action { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public ActivityType ActivityType { get; set; }
    }
}

