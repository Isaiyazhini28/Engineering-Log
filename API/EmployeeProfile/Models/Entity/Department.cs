using System.ComponentModel.DataAnnotations;

namespace EmployeeProfile.Models.Entity
{
    public class Department
    {
        [Key]
        public int DepartmentId { get; set; }
        public string DepartmentName  { get; set; }
        public string ManagerName { get; set; }
        public string TLName { get; set; }
        public ICollection<EmpRec> EmployeeData { get; set; } 
    }
}
