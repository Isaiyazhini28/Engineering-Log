using EngineeringLog.Models.Entity;
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
        public async Task<IActionResult> UpdateTransactionStatus( UpdateTransactionStatusRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request.");
            }

            var result = await _formService.UpdateTransactionStatus(request);
            
                return Ok(result);
        }

        [HttpGet("GetViewPageGrid")]
        public async Task<IActionResult> GetViewPageGrid(int PageNo,int PageSize,int locationId)
        {
           
                var response = await _formService.GetViewPageGrid(PageNo,PageSize,locationId);
                return Ok(response);
            
           
        }
        [HttpGet("GetViewPageDetailed")]
        public async Task<IActionResult> GetTransactionDetails(int transactionId)
        {
            var transactionDetails = await _formService.GetTransactionDetails(transactionId);

            if (transactionDetails == null)
            {
                return NotFound(); 
            }

            return Ok(transactionDetails); 
        }
        [HttpGet("ActivityLog")]
        public async Task<IActionResult> GetTransactionLogById(int transactionId)
        {
            var result = await _formService.GetTransactionLogById(transactionId);

            if (result == null)
            {
                return NotFound(new { message = "Transaction not found" });
            }

            return Ok(result);
        }
        [HttpPost("ActivityLogComment")]
        public async Task<IActionResult> AddComment(ActivityLogCommentRequest request)
        {

                // Call the service to add the comment
                var activityLogId = await _formService.AddComment(request);
                return Ok(new { Message = "Comment added successfully.", ActivityLogId = activityLogId });
        }

        [HttpPut("TransactionsApproval")]
        public async Task<IActionResult> TransactionsApproval( ApproverRequest request)
        {
            var result = await _formService.TransactionsApproval(request);

            if (result.CompletedTransactionIds.Count == 0)
            {
                return NotFound(new { Message = "No transactions were found to complete." });
            }

            return Ok(result);
        }
        [HttpGet("Report")]
        public async Task<IActionResult> GetReportPage(int locationId, DateTime startDate, DateTime endDate, int pageNo, int pageSize, int? status = null)
        {
                var result = await _formService.GetReportPage(locationId, startDate, endDate, pageNo, pageSize,status);
                return Ok(result);
            
        }
    }
}
