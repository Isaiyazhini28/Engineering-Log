using System.ComponentModel.DataAnnotations;

namespace EmployeeProfile.Models.Entity
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; }
        public string password { get; set; }


    }
}
