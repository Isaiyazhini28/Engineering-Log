using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EngineeringLog.Models.Entity
{
    public class SubFieldMaster
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int SequenceId { get; set; }
        [ForeignKey("FieldId")]
        public int FieldId { get; set; }
        public FieldMaster field { get; set; }
        public bool IsActive { get; set; } = true;
        public string Type { get; set; }
        public bool HasChild { get; set; } = false;
    }
}
