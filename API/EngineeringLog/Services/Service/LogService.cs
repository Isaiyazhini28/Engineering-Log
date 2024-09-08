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
    public class LogService : IService
    {
        private readonly ApiContext _dbContext;
        public LogService(ApiContext dbContext)
        {
            _dbContext = dbContext;
        }
        public MapResponse GetMapByPlantId(string plantId)
        {
            var mapMaster = _dbContext.Set<MapMaster>()
                .Where(m => m.PlantId == plantId)
                .Select(m => new MapResponse
                {
                    Id = m.Id,
                    html = m.html,
                    PlantId = m.PlantId,
                }).FirstOrDefault();
            return mapMaster;
        }
        public List<LocationResponse> GetLocations()
        {
            var locations = _dbContext.Set<LocationMaster>()
                                .Where(l => l.IsActive)
                                .Select(l => new LocationResponse
                                {
                                    Id = l.Id,
                                    Name = l.Name,
                                    SequenceId = l.SequenceId
                                })
                                .ToList();

            return locations;

        }
        public FieldFrequencyResponse GetFields(int locationId)
        {
            var fields = _dbContext.Set<FieldMaster>()
                .Where(f => f.LocationId == locationId && f.IsActive)
                .Select(f => new FieldResponse
                {
                    Id = f.Id,
                    Name = f.Name,
                    SequenceId = f.SequenceId,
                    Frequency = f.Frequency,
                    Type = f.Type,
                    HasChild = f.HasChild,
                    ChildFields = f.HasChild
                        ? _dbContext.Set<SubFieldMaster>()
                            .Where(sf => sf.FieldId == f.Id && sf.IsActive)
                            .Select(sf => new SubFieldResponse
                            {
                                Id = sf.Id,
                                Name = sf.Name,
                                SequenceId = sf.SequenceId,
                                Type = sf.Type,
                                HasChild = sf.HasChild
                            }).ToList()
                        : new List<SubFieldResponse>()
                })
                .ToList();
            var groupedFields = fields.GroupBy(f => f.Frequency);
            var dailyFields = new List<FieldResponse>();
            var monthlyFields = new List<FieldResponse>();

            foreach (var group in groupedFields)
            {
                if (group.Key == FrequencyType.Daily)
                {
                    dailyFields.AddRange(group);
                }
                else if (group.Key == FrequencyType.Monthly)
                {
                    monthlyFields.AddRange(group);
                }
            }
            var response = new FieldFrequencyResponse
            {
                DailyFields = dailyFields,
                MonthlyFields = monthlyFields
            };

            return response;
        }

        public async Task<List<PreviousReadingResponse>> GetLastReadings(int locationId)
        {
            var latestTransaction = await _dbContext.TransactionEntries
               .Where(te => te.LocationId == locationId)
               .OrderByDescending(te => te.CreatedDate)
               .FirstOrDefaultAsync();

            var transactionValues = await _dbContext.TransactionValues
                                    .Where(tv => tv.TransactionId == latestTransaction.Id)
                                    .Select(tv => new PreviousReadingResponse
                                    {
                                        Id = tv.Id,
                                        LocationId = locationId, 
                                        FieldId = tv.FieldId,
                                        SubFieldId = tv.SubFieldId,
                                        Value = tv.Value
                                    })
                                    .ToListAsync();

           
            return transactionValues;

        }

        private string GenerateReferenceId(int locationId)
        {
            var currentDate = DateTime.UtcNow.ToString("yyyyMMdd");
            var transactionCount = _dbContext.TransactionEntries
                .Where(t => t.LocationId == locationId && t.CreatedDate.Date == DateTime.UtcNow.Date)
                .Count();

            var serialNumber = (transactionCount + 1).ToString("D4");
            return $"{currentDate}-{locationId}-{serialNumber}";
        }

        public async Task<string> CreateTransaction(TransactionRequest request)
        {
            var refId = GenerateReferenceId(request.LocationId);
            var latestTransaction = await _dbContext.TransactionEntries
               .Where(te => te.LocationId == request.LocationId)
               .OrderByDescending(te => te.CreatedDate)
               .FirstOrDefaultAsync();

            // Get previous transaction values for the requested fields
            var previousEntries = await _dbContext.TransactionValues
                .Where(tv => tv.TransactionId == latestTransaction.Id &&
                             request.Fields.Select(f => f.FieldId).Contains(tv.FieldId))
                .GroupBy(tv => tv.FieldId)
                .Select(g => g.OrderByDescending(tv => tv.Transaction.CreatedDate).FirstOrDefault())
                .ToListAsync();

            // Create a new TransactionEntry
            var transactionEntry = new TransactionEntries
            {
                RefId = refId,
                LocationId = request.LocationId,
                CreatedBy = request.EmpId,
                CreatedDate = DateTime.UtcNow,
                ApprovalStatus = ApprovalStatus.Pending, 
                RevisedBy=request.EmpId,
                Remarks = request.Remark
            };
            _dbContext.TransactionEntries.Add(transactionEntry);
            _dbContext.SaveChanges();
            // Get the latest transaction for the location
           
            // var previousEntries = await GetLastReadings(request.LocationId);

            // Create TransactionValues for each field
            var transactionValues = request.Fields.Select(field =>
            {
                // Find the most recent previous entry for the current field
                var previousEntry = previousEntries
                      .FirstOrDefault(tv => tv.FieldId == field.FieldId);
                float perHourAvg = 0;
                float perMinAvg = 0;
                // Calculate PerHourAvg and PerMinAvg
                if (previousEntry != null)
                {
                    var timeDifferenceInHours = (transactionEntry.CreatedDate - previousEntry.Transaction.CreatedDate).TotalHours;
                    perHourAvg = field.HourAvg / (float)timeDifferenceInHours;
                    perMinAvg = perHourAvg / 60;
                }
                return new TransactionValues
                {
                    TransactionId = transactionEntry.Id,
                    FieldId = field.FieldId,
                    SubFieldId = field.SubFieldId,
                    Value = field.Value,
                    Reset = field.Reset,
                    HourAvg = field.HourAvg,
                    PerHourAvg = perHourAvg,
                    PerMinAvg = perMinAvg,
                };
            }).ToList();
            _dbContext.TransactionValues.AddRange(transactionValues);
            _dbContext.SaveChanges();

            // Clear the ChangeTracker to detach the entities from the context
            _dbContext.ChangeTracker.Clear();

            return transactionEntry.RefId;
        }

        public async Task<List<AvgResponse>> MTDAverage(int locationId)
        { 
            var currentDate = DateTime.UtcNow;
            var startOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1, 0, 0 ,0, DateTimeKind.Utc);
            var mtdAvgData = await (from te in _dbContext.TransactionEntries
                                    join tv in _dbContext.TransactionValues on te.Id equals tv.TransactionId
                                    where te.LocationId == locationId &&
                                          te.CreatedDate >= startOfMonth &&
                                          te.CreatedDate <= currentDate
                                    group tv by tv.FieldId into fieldGroup
                                    select new AvgResponse
                                    {
                                        FieldId = fieldGroup.Key,
                                        SubfiledId= fieldGroup.Key,
                                        Averaage = fieldGroup.Average(x => x.HourAvg)
                                    }).ToListAsync();

            return mtdAvgData;
        }

        public async Task<List<AvgResponse>> PreviousMonthAverage(int locationId)
        {
            // Calculate the start and end dates for the previous month
            var currentDate = DateTime.UtcNow;
            var firstDayOfCurrentMonth = new DateTime(currentDate.Year, currentDate.Month, 1,0,0,0,DateTimeKind.Utc);
            var lastDayOfPreviousMonth = firstDayOfCurrentMonth.AddDays(-1); // Last day of the previous month
            var firstDayOfPreviousMonth = new DateTime(lastDayOfPreviousMonth.Year, lastDayOfPreviousMonth.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var previousMonthAvgData = await (from te in _dbContext.TransactionEntries
                                              join tv in _dbContext.TransactionValues on te.Id equals tv.TransactionId
                                              where te.LocationId == locationId &&
                                                    te.CreatedDate >= firstDayOfPreviousMonth &&
                                                    te.CreatedDate <= lastDayOfPreviousMonth
                                              group tv by tv.FieldId into fieldGroup
                                              select new AvgResponse
                                              {
                                                  FieldId = fieldGroup.Key,
                                                  SubfiledId=fieldGroup.Key,
                                                  Averaage = fieldGroup.Average(x => x.HourAvg)
                                              }).ToListAsync();

            return previousMonthAvgData;
        }
    }

}

