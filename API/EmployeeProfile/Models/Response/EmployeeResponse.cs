using EmployeeProfile.Models.Entity;

namespace EmployeeProfile.Models.Response
{
    public class EmployeeResponse
    {

        public int ID { get; set; }
        public string EmployeeName { get; set; }
        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public string Gender { get; set; }
        public string? Email { get; set; }
        public string PhoneNumber { get; set; }
        public string CreatedBy { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public static EmployeeResponse FromEmployeeEntity(EmpRec empRec)
        {
            return new EmployeeResponse
            {
                ID = empRec.ID,
                EmployeeName = empRec.EmployeeName,
                DepartmentId = empRec.DepartmentId,
                DepartmentName = empRec.Department?.DepartmentName,
                Gender = empRec.Gender,
                Email = empRec.Email,
                PhoneNumber = empRec.PhoneNumber,
                CreatedBy = empRec.CreatedBy,
                CreatedDate = empRec.CreatedAt,
                ModifiedBy = empRec.ModifiedBy,
                UpdatedDate = empRec.ModifiedAt,

            };
        }
    }
}
