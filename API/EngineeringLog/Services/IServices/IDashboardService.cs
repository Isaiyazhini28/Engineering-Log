using EngineeringLog.Models.Request;
using EngineeringLog.Models.Response;
using Microsoft.AspNetCore.Mvc;

namespace EngineeringLog.Services.IServices
{
    public interface IDashboardService
    {
        Task<MapResponse> GetMapByPlantId(string plantId);
        List<LocationResponse> GetLocations(int frequency);
        Task<List<AllLocationResponse>> GetAllLocations();
        Task<List<ApproverLocationResponse>> GetApproverDashboard();
    }
}



