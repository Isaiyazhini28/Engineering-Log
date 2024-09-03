using System.ComponentModel.DataAnnotations;

namespace EngineeringLog.Models.Request
{
    public class TransactionRequest
    {
        [Required]
        public int LocationId { get; set; }

        [Required]
        public string EmpId { get; set; }
        public string Remark { get; set; }

        [Required]
        public List<TransactionFieldRequest> Fields { get; set; } = new List<TransactionFieldRequest>();
    }

    public class TransactionFieldRequest
    {
        [Required]
        public int FieldId { get; set; }

        public int? SubFieldId { get; set; }

        [Required]
        public string Value { get; set; }

        public bool Reset { get; set; } = false;

        public float HourAvg { get; set; }
    }
}


