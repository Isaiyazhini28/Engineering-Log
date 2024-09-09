namespace EngineeringLog.Models.Response
{
    public class FieldFrequencyResponse
    {
        public List<FieldResponse> DailyFields { get; set; } 
        public List<FieldResponse> MonthlyFields { get; set; }
       
    }
}
