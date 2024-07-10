namespace EmployeeProfile.Models.Response
{
    public class EmployeewithDeparment
    {
 
            public int Id { get; set; }
            public string EmployeeName { get; set; } = string.Empty;
            public string? PhoneNo { get; set; }
            public string? Email { get; set; }
            public string? Gender { get; set; }
            public int? DepartmentId { get; set; }
            public string? DepartmentName { get; set; }
            public string? ManagerName { get; set; }
            public string? TLName { get; set; }

    }
}
