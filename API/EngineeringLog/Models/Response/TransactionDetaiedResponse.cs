using EngineeringLog.Models.Entity;

namespace EngineeringLog.Models.Response
{
    public class TransactionDetaiedResponse
    {
        public int CurrentReadingTransactionId { get; set; }
        public int LocationId { get; set; }
        public string LocationName { get; set; }
        public string ReferenceNo { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public List<TransactionFieldResponse> Fields { get; set; }
    }

    public class TransactionFieldResponse
    {
        public int TransactionValueId { get; set; }
        public int FieldId { get; set; }
        public string FieldName { get; set; }
        public int FieldSequenceId { get; set; }
        public int? SubFieldId { get; set; }
        public string? SubFieldName { get; set; }
        public int? SubFieldSequenceId { get; set; }
        public string Value { get; set; }
        public float Difference { get; set; }
        public string Type { get; set; }
        public FrequencyType Frequency { get; set; }
        public string PreviousReading { get; set; }
        public float MtdAvg { get; set; }
        public float PreviousMonthAvg { get; set; }
    }
}
