using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EngineeringLog.Models.Entity
{
    public class TransactionEntries
    {
        [Key]
        public int Id { get; set; }
        public string RefId { get; set; }
        [ForeignKey("LocationId")]
        public int LocationId { get; set; }
        public LocationMaster Location { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string? RevisedBy { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Open;
        public string? ActionBy { get; set; }
        public DateTime? ActionAt { get; set; }
        public string? Remarks { get; set; }
        public ICollection<TransactionValues> TransactionValues { get; set; }
    }
}

