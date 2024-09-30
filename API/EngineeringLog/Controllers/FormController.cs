using EngineeringLog.Models.Request;
using EngineeringLog.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EngineeringLog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FormController : ControllerBase
    {
        private readonly IFormService _formService;

        public FormController(IFormService formService)
        {
            _formService = formService;

        }

        [HttpPost("CreateTransaByLocationId")]
        public async Task<IActionResult> CreateTransaction(CreateTransactionRequest request)
        {
       
                int response = await _formService.CreateTransaction(request);
                return Ok(response);
        }

        [HttpGet("GetFieldsByLocationId")]
        public async Task<IActionResult> GetOpenTransactionValues(int locationId)
        {
            var result = await _formService.GetOpenTransactionValues(locationId);
            return Ok(result);
        }

        [HttpPut("UpdateFieldvalue")]
        public async Task<IActionResult> UpdateTransactionValue( UpdateTransactionValueRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request.");
            }

            var result = await _formService.UpdateTransactionValue(request);

            return Ok(result);
        }

        [HttpPut("UpdateTransactionStatus")]
        public async Task<IActionResult> UpdateTransactionStatus([FromBody] UpdateTransactionStatusRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request.");
            }

            var result = await _formService.UpdateTransactionStatus(request);
            
                return Ok($"{result} updated successfully.");
        }

        [HttpGet("ViewPage")]
        public async Task<IActionResult> GetViewPage(int locationId)
        {
            var result = await _formService.GetViewPage(locationId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpGet("activityLog")]
        public async Task<IActionResult> GetTransactionLogById(int transactionId)
        {
            var result = await _formService.GetTransactionLogById(transactionId);

            if (result == null)
            {
                return NotFound(new { message = "Transaction not found" });
            }

            return Ok(result);
        }
       /* 
        [HttpPut("ApproverTransaction")]
        public async Task<IActionResult> ApproveTransaction(int transactionId, [FromBody] ApproverRequest request)
        {
            var result = await _formService.ApproveTransaction(transactionId, request);
            return Ok(result);
        }
       
        [HttpPut("CompleteMultipleTransactions")]
        public async Task<IActionResult> CompleteMultipleTransactions([FromBody] MultipleTransaApproverRequest request)
        {
            var result = await _formService.CompleteMultipleTransactions(request);

            if (result.CompletedTransactionIds.Count == 0)
            {
                return NotFound(new { Message = "No transactions were found to complete." });
            }

            return Ok(result);
        }*/
    }
}
