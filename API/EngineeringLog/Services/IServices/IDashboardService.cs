using EngineeringLog.Models.Request;
using EngineeringLog.Models.Response;
using Microsoft.AspNetCore.Mvc;

namespace EngineeringLog.Services.IServices
{
    public interface IDashboardService
    {
        Task<MapResponse> GetMapByPlantId(string plantId);
        List<LocationResponse> GetLocations(int frequency);
        Task<FieldFrequencyResponse> GetFields(int locationId);
        Task<List<ApproverLocationResponse>> GetApproverDashboard(int frequency);
    }
}



