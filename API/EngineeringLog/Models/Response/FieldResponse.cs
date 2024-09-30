using EngineeringLog.Models.Entity;

namespace EngineeringLog.Models.Response
{

    public class FieldResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int SequenceId { get; set; }
        public FrequencyType Frequency { get; set; }
        public string Type { get; set; }
        public string PreviousReading { get; set; }
        public float MtdAvg { get; set; }
        public float PreviousMonthAvg { get; set; }
        public bool HasChild { get; set; }
 
        public List<SubFieldResponse> ChildFields { get; set; }
    }
}
