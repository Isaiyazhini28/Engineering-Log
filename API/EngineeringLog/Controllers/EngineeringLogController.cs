using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using EngineeringLog.Models.Response;
using EngineeringLog.Services.IServices;
using EngineeringLog.Models.Request;
using Microsoft.AspNetCore.Authorization;
namespace EngineeringLog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    
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

        [HttpGet("GetLastReadings")]
        public async Task<IActionResult> GetLastReadings(int locationId)
        {
            // Validate input
            if (locationId <= 0)
            {
                return BadRequest("Invalid location ID.");
            }

            // Fetch the last readings for the specified location
            var response = await EngService.GetLastReadings(locationId);

            // Return the response
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

        [HttpPut("UpdateTransaction")]
        public async Task<IActionResult> UpdateTransaction([FromBody] TransactionUpdateRequest request)
        {
            var response = await EngService.UpdateTransaction(request);
            return Ok(response);
        }
        [HttpGet("activityLog")]
        public async Task<IActionResult> GetTransactionLogById(int transactionId)
        {
            var transactionLog = await EngService.GetTransactionLogById(transactionId);

            if (transactionLog == null)
            {
                return NotFound(new { message = "Transaction not found" });
            }

            return Ok(transactionLog);
        }
      /*  [HttpGet("ViewPage")]
        public async Task<IActionResult> GetViewPageData(int locationId)
        {
            var result = await EngService.GetViewPageData(locationId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }*/
    }
}
