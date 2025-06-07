using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EngineeringLog.Models.Entity
{
    public class MapMaster
    {
        [Key]
        public int Id { get; set; }
        public string html { get; set; }
        [ForeignKey("PlantId")]
        public string PlantId { get; set; }
        
    }
}
