using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EngineeringLog.Models.Entity
{
    

    public class FieldMaster
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int SequenceId { get; set; }
        [ForeignKey("LocationId")]
        public int LocationId { get; set; }
        public LocationMaster Location { get; set; }
        public bool IsActive { get; set; } = true;
        public string Type { get; set; }
        public FrequencyType Frequency { get; set; } 
        public bool HasChild { get; set; } = false;
        public List<SubFieldMaster> SubFields { get; set; }
    }
}
