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
        public async Task<FieldFrequencyResponse> GetFields(int locationId)
        {
            List<FieldResponse> fields = await _dbContext.FieldMasters
                .Where(x => x.LocationId == locationId && x.IsActive)
                .Select(x => new FieldResponse
                {
                    Id = x.Id,
                    Name = x.Name,
                    SequenceId = x.SequenceId,
                    Frequency = x.Frequency,
                    Type = x.Type,
                    HasChild = x.HasChild,
                    ChildFields = x.HasChild
                        ? _dbContext.SubFieldMasters
                            .Where(s => s.FieldId == x.Id && s.IsActive)
                            .Select(s => new SubFieldResponse
                            {
                                Id = s.Id,
                                Name = s.Name,
                                Type = s.Type,
                                SequenceId = s.SequenceId,
                                HasChild = s.HasChild
                            }).ToList()
                        : new List<SubFieldResponse>()
                })
                .ToListAsync();
            List<PreviousReadingResponse> lastReadings = await GetLastReadings(locationId);
            List<MtdAverageResponse> mtdAverages = await MTDAverage(locationId);
            List<PreviousMonthAvgResponse> fieldPreviousMonthAvg = await PreviousMonthAverage(locationId);
            fields.ForEach(field =>
            {
                if (field.HasChild)
                {
                    field.ChildFields.ForEach(subField =>
                    {
                        subField.PreviousReading = lastReadings.Where(x => x.FieldId == field.Id && x.SubFieldId == subField.Id).Select(x => x.LastReading).FirstOrDefault("");
                        subField.MtdAvg = mtdAverages.Where(x => x.FieldId == field.Id && x.SubFieldId == subField.Id).Select(x => x.MtdAverage).FirstOrDefault(0);
                        subField.PreviousMonthAvg = fieldPreviousMonthAvg.Where(x => x.FieldId == field.Id && x.SubFieldId == subField.Id).Select(x => x.PreviousMonthAvg).FirstOrDefault(0);
                    });
                }
                else
                {
                    field.PreviousReading = lastReadings.Where(x => x.FieldId == field.Id && x.SubFieldId == 0).Select(x => x.LastReading).FirstOrDefault("");
                    field.MtdAvg = mtdAverages.Where(x => x.FieldId == field.Id && x.SubFieldId == 0).Select(x => x.MtdAverage).FirstOrDefault(0);
                    field.PreviousMonthAvg = fieldPreviousMonthAvg.Where(x => x.FieldId == field.Id && x.SubFieldId == 0).Select(x => x.PreviousMonthAvg).FirstOrDefault(0);
                }
            });
            var groupedFields = fields.GroupBy(f => f.Frequency);
            List<FieldResponse> dailyFields = groupedFields.FirstOrDefault(g => g.Key == FrequencyType.Daily)?.ToList() ?? new List<FieldResponse>();
            List<FieldResponse> monthlyFields = groupedFields.FirstOrDefault(g => g.Key == FrequencyType.Monthly)?.ToList() ?? new List<FieldResponse>();
            var response = new FieldFrequencyResponse
            {
                DailyFields = dailyFields,
                MonthlyFields = monthlyFields
            };
            return response;
        }

        private async Task<List<MtdAverageResponse>> MTDAverage(int locationId)
        {
            var currentDate = DateTime.UtcNow;
            var startOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            List<MtdAverageResponse>mtdAvgData = await (from te in _dbContext.TransactionEntries
                                    join tv in _dbContext.TransactionValues on te.Id equals tv.TransactionId
                                    where te.LocationId == locationId &&
                                          te.CreatedDate >= startOfMonth &&
                                          te.CreatedDate <= currentDate
                                    group tv by new { tv.FieldId, tv.SubFieldId } into fieldGroup
                                    select new MtdAverageResponse
                                    {
                                        FieldId = fieldGroup.Key.FieldId,
                                        SubFieldId = fieldGroup.Key.SubFieldId,
                                        MtdAverage = fieldGroup.Average(x => x.Difference)
                                    }).ToListAsync();

            return mtdAvgData;
        }
        private async Task<List<PreviousReadingResponse>> GetLastReadings(int locationId)
        {
            var lastTransaction = await _dbContext.TransactionEntries
                                   .Where(te => te.LocationId == locationId)
                                   .OrderByDescending(te => te.CreatedDate)
                                   .FirstOrDefaultAsync(); 

            if (lastTransaction == null)
            {
                return new List<PreviousReadingResponse>(); 
            }
            List<PreviousReadingResponse> lastReadings = await (from tv in _dbContext.TransactionValues
                                      where tv.TransactionId == lastTransaction.Id
                                      select new PreviousReadingResponse
                                      {
                                          FieldId = tv.FieldId,
                                          SubFieldId = tv.SubFieldId,
                                          LastReading = tv.Value
                                      }).ToListAsync();

            return lastReadings;
        }
        public async Task<List<PreviousMonthAvgResponse>> PreviousMonthAverage(int locationId)
        {
            var currentDate = DateTime.UtcNow;
            var firstDayOfCurrentMonth = new DateTime(currentDate.Year, currentDate.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var lastDayOfPreviousMonth = firstDayOfCurrentMonth.AddDays(-1); 
            var firstDayOfPreviousMonth = new DateTime(lastDayOfPreviousMonth.Year, lastDayOfPreviousMonth.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var previousMonthAvgData = await (from te in _dbContext.TransactionEntries
                                              join tv in _dbContext.TransactionValues on te.Id equals tv.TransactionId
                                              where te.LocationId == locationId &&
                                                    te.CreatedDate >= firstDayOfPreviousMonth &&
                                                    te.CreatedDate <= lastDayOfPreviousMonth
                                              group tv by new { tv.FieldId, tv.SubFieldId } into fieldGroup
                                              select new PreviousMonthAvgResponse
                                              {
                                                  FieldId = fieldGroup.Key.FieldId,
                                                  SubFieldId = fieldGroup.Key.SubFieldId,
                                                  PreviousMonthAvg = fieldGroup.Average(x => x.Difference)
                                              }).ToListAsync();

            return previousMonthAvgData;
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

