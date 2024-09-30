using EngineeringLog.Models.Entity;

namespace EngineeringLog.Models.Response
{
    public class ViewPageResponse
    {
        public int CurrentReadingTransactionId { get; set; }
        public ApprovalStatus ApprovalStatus { get; set; }
        public List<ViewPageFieldResponse> Fields { get; set; }
        
    }
    public class ViewPageFieldResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int SequenceId { get; set; }
        public string Type { get; set; }
        public FrequencyType Frequency { get; set; }
        public string PreviousReading { get; set; }
        public string CurrentReading{ get; set; }
        public float MtdAvg { get; set; }
        public float PreviousMonthAvg { get; set; }
        public bool HasChild { get; set; }
        public List<ViewPageSubFieldResponse> ChildFields { get; set; } 
    }
    public class ViewPageSubFieldResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int SequenceId { get; set; }
        public FrequencyType Frequency { get; set; }
        public string Type { get; set; }

        public string PreviousReading { get; set; }
        public string CurrentReading { get; set; }
        public float MtdAvg { get; set; }
        public float PreviousMonthAvg { get; set; }
        public bool HasChild { get; set; }
    }

}
