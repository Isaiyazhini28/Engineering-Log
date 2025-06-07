using EngineeringLog.Models.Entity;
using Microsoft.EntityFrameworkCore;

namespace EngineeringLog.Data
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

            options.UseNpgsql(Configuration.GetConnectionString("EngineeringLog"));
        }
        public DbSet<LocationMaster> LocationMasters { get; set; }
        public DbSet<FieldMaster> FieldMasters { get; set; }
        public DbSet<SubFieldMaster> SubFieldMasters { get; set; }
        public DbSet<MapMaster> MapMasters { get; set; }
        public DbSet<TransactionValues> TransactionValues { get; set; }
        public DbSet<TransactionEntries> TransactionEntries { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }
        public DbSet<User>Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
         

        }
    }
}

              