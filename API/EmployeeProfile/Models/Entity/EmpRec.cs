using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EmployeeProfile.Models.Request;

namespace EmployeeProfile.Models.Entity
{
    public class EmpRec:BaseEnitity
    {
        [Key]
        public int ID { get; set; }
        public string EmployeeName { get; set; }
        public string Gender { get; set; }
        public string? Email { get; set; }
        public string PhoneNumber { get; set; }
        [ForeignKey("DepartmentId")]
        public int DepartmentId { get; set; }
        public Department Department { get; set; }
        public void AddEmployee(EmployeeRequest request)
        {

            EmployeeName = request.EmployeeName;
            DepartmentId = request.DepartmentId;
            Email = request.Email;
            PhoneNumber = request.MobileNo;
            Gender = request.Gender;
            CreatedBy = request.CreatedBy;
            ModifiedBy = request.CreatedBy;
            CreatedAt = DateTime.UtcNow;
            ModifiedAt = DateTime.UtcNow;
        }
        public void UpdateEmployee(EmployeeRequestUpdate request)
        {
            EmployeeName = request.EmployeeName;
            DepartmentId = request.DepartmentId;
            Email = request.Email;
            PhoneNumber = request.MobileNo;
            Gender = request.Gender;
            ModifiedBy = request.ModifiedBy;
            ModifiedAt = DateTime.UtcNow;
        }
    }
}
