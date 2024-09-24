using EngineeringLog.Models.Entity;

namespace EngineeringLog.Models.Response
{
    public class ViewPageResponse
    {
        public List<ViewPageFieldResponse> DailyFields { get; set; } = new List<ViewPageFieldResponse>();
        public List<ViewPageFieldResponse> MonthlyFields { get; set; } = new List<ViewPageFieldResponse>();

    }
    public class ViewPageFieldResponse
    {
        public int FieldId { get; set; }
        public string FieldName { get; set; }
        public int SequenceId { get; set; }
        public FrequencyType Frequency { get; set; }
        public bool HasChild { get; set; }
        public string LastTransactionValue { get; set; }
        public string? MtdAverage { get; set; }
        public string? PreviousMonthAverage { get; set; }
        public List<SubFieldTransactionResponse> SubFields { get; set; } = new List<SubFieldTransactionResponse>();
    }
    public class SubFieldTransactionResponse
    {
        public int SubFieldId { get; set; }
        public string SubFieldName { get; set; }
        public int SequenceId { get; set; }
        public string LastTransactionValue { get; set; }
        public string? MtdAverage { get; set; }
        public string? PreviousMonthAverage { get; set; }
    }

}
