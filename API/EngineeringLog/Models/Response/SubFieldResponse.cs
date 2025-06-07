namespace EngineeringLog.Models.Response
{
    public class SubFieldResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int SequenceId { get; set; }

        public string Type { get; set; }
        public string PreviousReading { get; set; }
        public float MtdAvg { get; set; }
        public float PreviousMonthAvg { get; set; }
        public bool HasChild { get; set; }
       
    }
}
