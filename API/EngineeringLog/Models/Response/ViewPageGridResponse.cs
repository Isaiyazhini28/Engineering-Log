using EngineeringLog.Models.Entity;

namespace EngineeringLog.Models.Response
{
    public class ViewPageGridResponse
    {
        public int Count { get; set; }
        public int LocationId { get; set; }
        public string LocationName { get; set; }
        public List<TransactionEntryResponse> Data { get; set; }

    }
    public class TransactionEntryResponse
    {
        public int TransactionId { get; set; }
        public string RefId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string? RevisedBy { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public string Remarks { get; set; }
        public List<ViewPageTransactionValueResponse> TransactionValues { get; set; }
    }
    public class ViewPageTransactionValueResponse
    {
        public int ValueId { get; set; }
        public int FieldId { get; set; }
        public int FieldSequenceId { get; set; }
        public string FieldName { get; set; }
        public int? SubFieldId { get; set; }
        public int? SubFieldSequenceId { get; set; }
        public string? SubFieldName { get; set; }
        public string Value { get; set; }
    }

}
