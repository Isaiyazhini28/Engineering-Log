namespace EngineeringLog.Models.Response
{
    public class PreviousMonthAvgResponse
    {
        public int FieldId { get; set; }
        public int? SubFieldId { get; set; }
        public float PreviousMonthAvg { get; set; }
    }
}
