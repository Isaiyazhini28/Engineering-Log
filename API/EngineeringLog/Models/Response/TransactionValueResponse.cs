using EngineeringLog.Models.Entity;

namespace EngineeringLog.Models.Response
{
    public class TransactionValueResponse
    {
        public List<TransactionFieldValueResponse>? DailyFields { get; set; } = new List<TransactionFieldValueResponse>();
        public List<TransactionFieldValueResponse>? MonthlyFields { get; set; } = new List<TransactionFieldValueResponse>();
    }
}
