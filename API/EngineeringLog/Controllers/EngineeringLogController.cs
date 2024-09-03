using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using EngineeringLog.Models.Response;
using EngineeringLog.Services.IServices;
using EngineeringLog.Models.Request;
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

        [HttpGet("PreviousReading")]
        public async Task<IActionResult> GetLastReadings(int locationId)
        {
            var response =await EngService.GetLastReadings(locationId);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction(TransactionRequest request)
        {
          

            var transactionId = await EngService.CreateTransaction(request);

            return Ok(new { TransactionId = transactionId });
        }

        [HttpGet("GetMTDAverage")]
        public async Task<IActionResult> MTDAverage(int locationId)
        {
            var response = await EngService.MTDAverage(locationId);
            return Ok(response);
        }

        [HttpGet("GetPreviousMonthAvgerage")]
        public async Task<IActionResult> PreviousMonthAverageg (int locationId)
        {
            var result = await EngService.PreviousMonthAverage(locationId);
            return Ok(result);
        }
    }
}
