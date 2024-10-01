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
        private readonly IDashboardService dashboardService;

        public DashboardController(IDashboardService engineeringLogService)
        {
            dashboardService = engineeringLogService;

        }

        [HttpGet("Map")]
        public async Task<IActionResult> GetMapByPlantId(string plantId)
        {
            try
            {
                var result = dashboardService.GetMapByPlantId(plantId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
        }

        [HttpGet("location")]
        public ActionResult GetLocations(int frequency)
        {
            var result = dashboardService.GetLocations(frequency);

            return Ok(result);
        }

        [HttpGet("ApproverDashboard")]
        public async Task<IActionResult> GetApproverDashboard(int frequency)
        {
            var result = await dashboardService.GetApproverDashboard(frequency);
            return Ok(result);

        }
    }
}
