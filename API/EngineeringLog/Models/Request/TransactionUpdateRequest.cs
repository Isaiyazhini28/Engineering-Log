namespace EngineeringLog.Models.Request
{
    public class TransactionUpdateRequest
    {
        public int TransactionId { get; set; }      
        public string RefId { get; set; }           
        public string EmpId { get; set; }              
        public string Remarks { get; set; }
        public List<TransactionFieldRequest> Fields { get; set; }
    }
}
