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
    
    
    public class DashboardController : ControllerBase
    {
        private readonly IService EngService;

        public DashboardController(IService engineeringLogService)
        {
            EngService = engineeringLogService;

        }

        [HttpGet("map")]
        public ActionResult GetMapByPlantId(string plantId)
        {
            var response = EngService.GetMapByPlantId(plantId);
            return Ok(response);
        }

        [HttpGet("location")]
        public ActionResult GetLocations(int frequency)
        {
            var response = EngService.GetLocations(frequency);

            return Ok(response);
        }

        [HttpGet("fields")]
        public async Task<IActionResult>GetFields(int locationId)
        {
            var response =await EngService.GetFields(locationId);
            return Ok(response);
        }

        [HttpPost("Form")]
        public async Task<IActionResult> CreateTransaction(TransactionRequest request)
        {
          

            var transactionId = await EngService.CreateTransaction(request);

            return Ok(new { TransactionId = transactionId });
        }





        [HttpPut("UpdateTransaction")]
        public async Task<IActionResult> UpdateTransaction( TransactionUpdateRequest request)
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
        [HttpPut("ApproveTransaction")]
        public async Task<IActionResult> ApproveTransaction(int transactionId, [FromBody] ApproverRequest request)
        {
            var result = await EngService.ApproveTransaction(transactionId, request);
            return Ok(result);
        }
       [HttpPut("RejectTransaction")]
        public async Task<IActionResult> RejectTransaction(int transactionId, [FromBody] ApproverRequest request)
        {
            var result = await EngService.RejectTransaction(transactionId, request);
            return Ok(result);
        }
        [HttpPut("CompleteMultipleTransactions")]
        public async Task<IActionResult> CompleteMultipleTransactions([FromBody] MultipleTransaApproverRequest request)
        {
            var result = await EngService.CompleteMultipleTransactions(request);

            if (result.CompletedTransactionIds.Count == 0)
            {
                return NotFound(new { Message = "No transactions were found to complete." });
            }

            return Ok(result);
        }
    }
}
