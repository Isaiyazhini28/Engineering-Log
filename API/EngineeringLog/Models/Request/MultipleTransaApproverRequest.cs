namespace EngineeringLog.Models.Request
{
    public class MultipleTransaApproverRequest
    {

        public string EmpId { get; set; }
        public List<int> TransactionIds { get; set; }
        public string Remark { get; set; }
    }
}
