using System.ComponentModel.DataAnnotations;

namespace EngineeringLog.Models.Request
{
    public class TransactionRequest
    {
        public int LocationId { get; set; }
        public string EmpId { get; set; }
        public string Remark { get; set; }
        public List<TransactionFieldRequest> Fields { get; set; } = new List<TransactionFieldRequest>();
    }

    public class TransactionFieldRequest
    {
        public int FieldId { get; set; }
        public int? SubFieldId { get; set; }
        public string Value { get; set; }
        public bool Reset { get; set; } = false;
        public float Difference { get; set; }
    }
}


