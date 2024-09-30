using EngineeringLog.Models.Entity;

namespace EngineeringLog.Models.Response
{
    public class ViewPageCurrentReaResponse
    {
        public int FieldId { get; set; }
        public int? SubFieldId { get; set; }
        public int TransactionId { get; set; }
        public string CurrentReading { get; set; }

        public ApprovalStatus ApprovalStatus { get; set; }

    }
}
