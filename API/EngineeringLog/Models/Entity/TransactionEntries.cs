using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EngineeringLog.Models.Entity
{
    public class TransactionEntries
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50)]
        public string RefId { get; set; }

        [ForeignKey("LocationMaster")]
        public int LocationId { get; set; }
        // Navigation Property
        public LocationMaster Location { get; set; }

        public DateTime CreatedDate { get; set; }

        [StringLength(100)]
        public string CreatedBy { get; set; }

        [StringLength(100)]
        public string RevisedBy { get; set; }

        public ApprovalStatus ApprovalStatus { get; set; } = ApprovalStatus.Pending;

        [StringLength(100)]
        public string ActionBy { get; set; }

        public DateTime? ActionAt { get; set; }

        [StringLength(500)]
        public string Remarks { get; set; }

        
    }

}

