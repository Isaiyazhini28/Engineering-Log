using EngineeringLog.Models.Request;
using EngineeringLog.Models.Response;
using Microsoft.AspNetCore.Mvc;

namespace EngineeringLog.Services.IServices
{
    public interface IDashboardService
    {
        //Map
        Task<MapResponse> GetMapByPlantId(string plantId);
        //Locations-Dashboard
        List<LocationResponse> GetLocations(int frequency);



        //approverDashboard
        Task<List<ApproverLocationResponse>> GetApproverDashboard(int frequency);
    }
}



