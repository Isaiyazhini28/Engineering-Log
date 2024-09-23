namespace EngineeringLog.Models.Request
{
    public class TransactionUpdateRequest
    {
        public int TransactionId { get; set; }      // Optional: Can also update by RefId
        public string RefId { get; set; }           // Optional: Update by Reference Id
        public string EmpId { get; set; }              // Employee updating the transaction
        public string Remarks { get; set; }         // Optional: Remarks for the update
        public List<TransactionFieldRequest> Fields { get; set; }
    }
}
