namespace EngineeringLog.Models.Response
{
    public class PreviousReadingResponse
    {
        public int FieldId { get; set; }
        public int? SubFieldId { get; set; }
        public string LastReading { get; set; }
    }
}
