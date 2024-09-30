namespace EngineeringLog.Models.Request
{
    public class UpdateTransactionValueRequest
    {
        public int TransactionValueId { get; set; }
        public string Value { get; set; }
        public float Difference { get; set; }
        public string EmployeeId { get; set; }
        public bool Reset { get; set; } = false;
    }
}
