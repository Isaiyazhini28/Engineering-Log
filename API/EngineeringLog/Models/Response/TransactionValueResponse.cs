namespace EngineeringLog.Models.Response
{
    public class TransactionValueResponse
    {
        public int TransactionValueId { get; set; }
        public int FieldId {  get; set; } 
        public string FieldName { get; set; }
        public int? SubFieldId { get; set; } 
        public string? SubFieldName { get; set; } 
        public string Value { get; set; }
        public float Difference { get; set; }
      
    }

}
