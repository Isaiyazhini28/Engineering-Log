using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace EngineeringLog.Models.Entity
{
    public class LocationMaster
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int SequenceId { get; set; }
        public bool IsActive { get; set; } = true;
        [ForeignKey("PlantId")]
        public  string PlantId { get; set; }
        public ICollection<FieldMaster> Fields { get; set; }
    }
}
