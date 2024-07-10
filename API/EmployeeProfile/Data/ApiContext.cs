using EmployeeProfile.Models.Entity;
using Microsoft.EntityFrameworkCore;

namespace EmployeeProfile.Data
{
    public class ApiContext : DbContext
    {
        protected readonly IConfiguration Configuration;
        public ApiContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {

            options.UseNpgsql(Configuration.GetConnectionString("EmployeeAdmin"));
        }

        public DbSet<EmpRec> EmployeesData { get; set; }
        public DbSet<Department> Departments {  get; set; }
        public DbSet<User> Users { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Department>()
                .HasKey(d => d.DepartmentId); // Primary key configuration

            modelBuilder.Entity<Department>().HasData(
                new Department { DepartmentId = 1, DepartmentName = "IT", ManagerName= "Abhinav", TLName="Angitha"},
                new Department { DepartmentId = 2, DepartmentName = "HR", ManagerName= "Subikasha",TLName="Isai"},
                new Department { DepartmentId = 3, DepartmentName = "Marketing", ManagerName="Madhu",TLName="Kiruthika" }
            );

            base.OnModelCreating(modelBuilder);
        }

    }
}
