using EngineeringLog.Data;
using EngineeringLog.Models.Entity;
using EngineeringLog.Models.Request;
using EngineeringLog.Models.Response;
using EngineeringLog.Services.IServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Xml;

namespace EngineeringLog.Services.Service
{
    public class DashboardService : IDashboardService
    {
        private readonly ApiContext _dbContext;
        public DashboardService(ApiContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<MapResponse> GetMapByPlantId(string plantId)
        {
            var mapMaster = _dbContext.MapMasters
                .Where(x => x.PlantId == plantId)
                .Select(x => new MapResponse
                {
                    Id = x.Id,
                    html = x.html,
                    PlantId = x.PlantId,
                }).FirstOrDefault();
            return mapMaster;
        }

        public List<LocationResponse> GetLocations(int frequency)
        { 
            List<LocationResponse> locations = _dbContext.LocationMasters
                .Where(x => x.IsActive && x.Fields.Any(f => f.Frequency == (FrequencyType)frequency && f.IsActive))
                .Select(x => new LocationResponse
                {
                    Id = x.Id,
                    Name = x.Name,
                    SequenceId = x.SequenceId,
                    Status = _dbContext.TransactionEntries.Where(te => te.CreatedDate.Date == DateTime.UtcNow.Date)
                               .Select(te => te.LocationId).Contains(x.Id) ? true : false
                })
                .ToList();
            return locations;
        }
       
        public async Task<List<ApproverLocationResponse>> GetApproverDashboard(int frequency)
        {
            List<ApproverLocationResponse> locations = await _dbContext.LocationMasters.Where(x => x.IsActive && x.Fields.Any(f => f.Frequency == (FrequencyType)frequency && f.IsActive))
                                                               .Select(x => new ApproverLocationResponse
                                                               {
                                                                   LocationId = x.Id,
                                                                   LocationName = x.Name,
                                                                   SequenceId = x.SequenceId,
                                                                   PendingCount = "Pending Count -" + _dbContext.TransactionEntries
                                                                                  .Where(te => te.LocationId == x.Id && te.ApprovalStatus == ApprovalStatus.Pending)
                                                                                  .Count()
                                                               })
                                                               .ToListAsync();

            return locations;
        }
    }
}

