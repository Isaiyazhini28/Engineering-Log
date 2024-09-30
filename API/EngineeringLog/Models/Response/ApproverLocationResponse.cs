namespace EngineeringLog.Models.Response
{
    public class ApproverLocationResponse
    {
        public int LocationId { get; set; }
        public string LocationName { get; set; }
        public int SequenceId { get; set; }
        public string PendingCount { get; set; }
    }
}
