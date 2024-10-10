using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EngineeringLog.Models.Entity
{
    public class TransactionValues
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("TransactionId")]
        public int TransactionId { get; set; }
        public TransactionEntries Transaction { get; set; }
        [ForeignKey("FieldId")]
        public int FieldId { get; set; }
        public FieldMaster Field { get; set; }
        [ForeignKey("SubFieldId")]
        public int? SubFieldId { get; set; }
        public SubFieldMaster SubField { get; set; }    
        public string Value { get; set; }
        public bool Reset { get; set; } = false;
        public float Difference { get; set; }
        public float PerHourAvg { get; set; }
        public float PerMinAvg { get; set; }
    }
}
