namespace EmployeeProfile.Models.Request
{
    public class EmployeeRequest
    {

        public string EmployeeName { get; set; }
        public int DepartmentId { get; set; }
        public string Gender { get; set; }
        public string? Email { get; set; }
        public string MobileNo { get; set; }
        public string CreatedBy { get; set; }
    }
}
