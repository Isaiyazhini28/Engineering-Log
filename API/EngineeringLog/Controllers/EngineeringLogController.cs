using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using EngineeringLog.Models.Response;
using EngineeringLog.Services.IServices;
namespace EngineeringLog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EngineeringLogController : ControllerBase
    {
        private readonly IService EngService;

        public EngineeringLogController(IService engineeringLogService)
        {
            EngService = engineeringLogService;

        }
      
        [HttpGet("map")]
        public ActionResult GetMapByPlantId(string plantId) 
        {
            var response = EngService.GetMapByPlantId(plantId);
            return Ok(response);
        }
        [HttpGet("dashboard")]
        public ActionResult GetLocations()
        {
            var response = EngService.GetLocations();
           
            return Ok(response);
        }
        [HttpGet("form")]
        public ActionResult<FieldFrequencyResponse> GetFields(int locationId)
        {
            var response = EngService.GetFields(locationId);
            return Ok(response);
        }
       
    }
}
