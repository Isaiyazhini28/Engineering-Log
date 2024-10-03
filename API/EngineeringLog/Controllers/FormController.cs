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

       /* [HttpGet("ViewPage")]
        public async Task<IActionResult> GetViewPage(int locationId)
        {
            var result = await _formService.GetViewPage(locationId);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }*/

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
    }
}
