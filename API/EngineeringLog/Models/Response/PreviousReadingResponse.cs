namespace EngineeringLog.Models.Response
{
    public class PreviousReadingResponse
    {
        public int Id { get; set; }
        public int LocationId { get; set; } // Added LocationId
        public int FieldId { get; set; }
        public int? SubFieldId { get; set; }
        public string Value { get; set; }

    }
}
