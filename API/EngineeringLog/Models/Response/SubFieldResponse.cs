namespace EngineeringLog.Models.Response
{
    public class SubFieldResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int SequenceId { get; set; }

        public string Type { get; set; }
        public bool HasChild { get; set; } 
    }
}
