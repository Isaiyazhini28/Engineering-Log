using EngineeringLog.Models.Response;
using EngineeringLog.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EngineeringLog.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientUrlController : ControllerBase
    {
        private readonly IClientUrlServices urlService;

        public ClientUrlController(IClientUrlServices ClientUrlService)
        {
            urlService = ClientUrlService;

        }

        [HttpGet("Businessunits")]
        public async Task<ActionResult<List<BusinessUnitResponse>>> GetBusinessUnitsByCountryId(string countryId)
        {
            var businessUnits = await urlService.GetBusinessUnitsByCountryIdAsync(countryId);

            if (businessUnits == null || !businessUnits.Any())
            {
                return NotFound(new { Message = "No business units found for the given CountryId." });
            }

            return Ok(businessUnits);
        }

        [HttpGet("Plants")]
        public async Task<ActionResult<List<PlantResponse>>> GetPlantsByBusinessUnitId(string businessUnitId)
        {
            var plants= await urlService.GetPlantsByBusinessUnitIdAsync(businessUnitId);

            if (plants == null || !plants.Any())
            {
                return NotFound("No Plants found for the given BusinessUnitId." );
            }

            return Ok(plants);
        }
    }
}
