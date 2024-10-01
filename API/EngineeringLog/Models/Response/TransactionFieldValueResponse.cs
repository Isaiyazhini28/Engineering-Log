using EngineeringLog.Models.Entity;

namespace EngineeringLog.Models.Response
{
    public class TransactionFieldValueResponse
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
        public string PreviousReading {  get; set; }
        public float MtdAvg { get; set; }
        public float PreviousMonthAvg { get; set; }

    }
}
