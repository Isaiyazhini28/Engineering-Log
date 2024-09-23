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

        public async Task<FieldFrequencyResponse> GetLastReadings(int locationId)
        {

            var fieldsResponse = GetFields(locationId);
            var latestTransaction = await _dbContext.TransactionEntries
                .Where(te => te.LocationId == locationId)
                .OrderByDescending(te => te.CreatedDate)
                .FirstOrDefaultAsync();
            var transactionValues = latestTransaction != null
                ? await _dbContext.TransactionValues
                    .Where(tv => tv.TransactionId == latestTransaction.Id)
                    .ToListAsync()
                : new List<TransactionValues>();
            foreach (var field in fieldsResponse.DailyFields.Concat(fieldsResponse.MonthlyFields))
            {
                if (field.HasChild)
                {
                    foreach (var child in field.ChildFields)
                    {
                        var transactionValue = transactionValues.FirstOrDefault(tv => tv.SubFieldId == child.Id);
                        child.Type = transactionValue?.Value ?? string.Empty;
                    }
                }
                else
                {
                    var transactionValue = transactionValues.FirstOrDefault(tv => tv.FieldId == field.Id);
                    field.Type = transactionValue?.Value ?? string.Empty;
                }
            }
            return fieldsResponse;
            /*var latestTransaction = await _dbContext.TransactionEntries
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

           
            return transactionValues;*/
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

        public async Task<List<TransactionEntryResponse>> CreateTransaction(TransactionRequest request)
        {
            var refId = GenerateReferenceId(request.LocationId);
            var latestTransaction = await _dbContext.TransactionEntries
               .Where(te => te.LocationId == request.LocationId)
               .OrderByDescending(te => te.CreatedDate)
               .FirstOrDefaultAsync();
            if (latestTransaction == null)
            {
                // Handle the case where no previous transactions exist
                latestTransaction = new TransactionEntries { CreatedDate = DateTime.MinValue };
            }
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
                RevisedBy = request.EmpId,
                Remarks = request.Remark
            };
            _dbContext.TransactionEntries.Add(transactionEntry);
            _dbContext.SaveChanges();
            // Get the latest transaction for the location

            // var previousEntries = await GetLastReadings(request.LocationId);
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
                    perHourAvg = field.Difference / (float)timeDifferenceInHours;
                    perMinAvg = perHourAvg / 60;
                }
                else
                {
                    perHourAvg = field.Difference / 24;
                    perMinAvg = perHourAvg / 60;
                }
                return new TransactionValues
                {
                    TransactionId = transactionEntry.Id,
                    FieldId = field.FieldId,
                    SubFieldId = field.SubFieldId,
                    Value = field.Value,
                    Reset = field.Reset,
                    Difference = field.Difference,
                    PerHourAvg = perHourAvg,
                    PerMinAvg = perMinAvg,
                };
            }).ToList();
            _dbContext.TransactionValues.AddRange(transactionValues);
            var activityLog = new ActivityLog
            {
                TransactionId = transactionEntry.Id,
                Action = "Transaction  Created",
                CreatedBy = request.EmpId,
                CreatedAt = DateTime.UtcNow,
                ModifiedBy = request.EmpId,
                ModifiedAt = DateTime.UtcNow
            };

            _dbContext.ActivityLogs.Add(activityLog);
            await _dbContext.SaveChangesAsync();
            _dbContext.ChangeTracker.Clear();
            var response = transactionValues.Select(tv => new TransactionEntryResponse
            {
                FieldId = tv.FieldId,
                SubFieldId = tv.SubFieldId,
                Value = tv.Value,

            }).ToList();

            return response;
        }

        public async Task<FieldFrequencyResponse> MTDAverage(int locationId)
        {
            var fieldsResponse = GetFields(locationId);
            var currentDate = DateTime.UtcNow;
            var startOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var mtdAvgData = await (from te in _dbContext.TransactionEntries
                                    join tv in _dbContext.TransactionValues on te.Id equals tv.TransactionId
                                    where te.LocationId == locationId &&
                                          te.CreatedDate >= startOfMonth &&
                                          te.CreatedDate <= currentDate
                                    group tv by new { tv.FieldId, tv.SubFieldId } into fieldGroup
                                    select new
                                    {
                                        FieldId = fieldGroup.Key.FieldId,
                                        SubFieldId = fieldGroup.Key.SubFieldId,
                                        MtdAverage = fieldGroup.Average(x => x.Difference).ToString("F5") // Format to 2 decimal places
                                    }).ToListAsync();
            foreach (var field in fieldsResponse.DailyFields.Concat(fieldsResponse.MonthlyFields))
            {
                if (field.HasChild)
                {
                    foreach (var child in field.ChildFields)
                    {
                        var mtdAverage = mtdAvgData.FirstOrDefault(x => x.SubFieldId == child.Id)?.MtdAverage ?? string.Empty;
                        child.Type = mtdAverage;
                    }
                }
                else
                {
                    var mtdAverage = mtdAvgData.FirstOrDefault(x => x.FieldId == field.Id)?.MtdAverage ?? string.Empty;
                    field.Type = mtdAverage;
                }
            }
            return fieldsResponse;
        }

        public async Task<FieldFrequencyResponse> PreviousMonthAverage(int locationId)
        {
            var fieldsResponse = GetFields(locationId);

            // Calculate the start and end dates for the previous month
            var currentDate = DateTime.UtcNow;
            var firstDayOfCurrentMonth = new DateTime(currentDate.Year, currentDate.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var lastDayOfPreviousMonth = firstDayOfCurrentMonth.AddDays(-1); // Last day of the previous month
            var firstDayOfPreviousMonth = new DateTime(lastDayOfPreviousMonth.Year, lastDayOfPreviousMonth.Month, 1, 0, 0, 0, DateTimeKind.Utc);

            var previousMonthAvgData = await (from te in _dbContext.TransactionEntries
                                              join tv in _dbContext.TransactionValues on te.Id equals tv.TransactionId
                                              where te.LocationId == locationId &&
                                                    te.CreatedDate >= firstDayOfPreviousMonth &&
                                                    te.CreatedDate <= lastDayOfPreviousMonth
                                              group tv by new { tv.FieldId, tv.SubFieldId } into fieldGroup
                                              select new
                                              {
                                                  FieldId = fieldGroup.Key.FieldId,
                                                  SubFieldId = fieldGroup.Key.SubFieldId,
                                                  PreviousMonthAverage = fieldGroup.Average(x => x.Difference).ToString("F5") // Format to 5 decimal places
                                              }).ToListAsync();

            foreach (var field in fieldsResponse.DailyFields.Concat(fieldsResponse.MonthlyFields))
            {
                if (field.HasChild)
                {
                    foreach (var child in field.ChildFields)
                    {
                        var previousMonthAverage = previousMonthAvgData.FirstOrDefault(x => x.SubFieldId == child.Id)?.PreviousMonthAverage ?? string.Empty;
                        child.Type = previousMonthAverage; // Assuming "Type" is used for storing the previous month average
                    }
                }
                else
                {
                    var previousMonthAverage = previousMonthAvgData.FirstOrDefault(x => x.FieldId == field.Id)?.PreviousMonthAverage ?? string.Empty;
                    field.Type = previousMonthAverage; // Assuming "Type" is used for storing the previous month average
                }
            }

            return fieldsResponse;
        }
        public async Task<List<TransactionEntryResponse>> UpdateTransaction(TransactionUpdateRequest request)
        {
            var transactionEntry = await _dbContext.TransactionEntries
                .FirstOrDefaultAsync(te => te.RefId == request.RefId || te.Id == request.TransactionId);

            if (transactionEntry == null)
            {
                throw new Exception("Transaction not found");
            }

           
            transactionEntry.RevisedBy = request.EmpId;
            transactionEntry.Remarks = request.Remarks;
            transactionEntry.ApprovalStatus = ApprovalStatus.Pending; // Assuming status is reset to Pending upon update
            transactionEntry.RevisedBy = request.EmpId;
            /* transactionEntry.REvisedAt = DateTime.UtcNow;*/

            _dbContext.TransactionEntries.Update(transactionEntry);
            await _dbContext.SaveChangesAsync();

            // Retrieve the previous entries for comparison
            var previousEntries = await _dbContext.TransactionValues
                .Where(tv => tv.TransactionId == transactionEntry.Id &&
                             request.Fields.Select(f => f.FieldId).Contains(tv.FieldId))
                .ToListAsync();

            // Update the transaction values
            var updatedTransactionValues = request.Fields.Select(field =>
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
                    perHourAvg = field.Difference / (float)timeDifferenceInHours;
                    perMinAvg = perHourAvg / 60;
                }
                else
                {
                    perHourAvg = field.Difference / 24;
                    perMinAvg = perHourAvg / 60;
                }

               
                if (previousEntry != null)
                {
                    previousEntry.Value = field.Value;
                    previousEntry.Reset = field.Reset;
                    previousEntry.Difference = field.Difference;
                    previousEntry.PerHourAvg = perHourAvg;
                    previousEntry.PerMinAvg = perMinAvg;

                    return previousEntry;
                }
                else
                {
                    return new TransactionValues
                    {
                        TransactionId = transactionEntry.Id,
                        FieldId = field.FieldId,
                        SubFieldId = field.SubFieldId,
                        Value = field.Value,
                        Reset = field.Reset,
                        Difference = field.Difference,
                        PerHourAvg = perHourAvg,
                        PerMinAvg = perMinAvg,
                    };
                }
            }).ToList();

            _dbContext.TransactionValues.UpdateRange(updatedTransactionValues);


            var activityLog = new ActivityLog
            {
                TransactionId = transactionEntry.Id,
                Action = "Transaction Updated",
                CreatedBy = request.EmpId,
                CreatedAt = DateTime.UtcNow,
                ModifiedBy = request.EmpId,
                ModifiedAt = DateTime.UtcNow
            };

            _dbContext.ActivityLogs.Add(activityLog);
            await _dbContext.SaveChangesAsync();

            _dbContext.ChangeTracker.Clear();

            var response = updatedTransactionValues.Select(tv => new TransactionEntryResponse
            {
                FieldId = tv.FieldId,
                SubFieldId = tv.SubFieldId,
                Value = tv.Value,
            }).ToList();

            return response;
        }

        public async Task<TransactionLogResponse> GetTransactionLogById(int transactionId)
        {
            var transactionLog = await _dbContext.ActivityLogs
                .Where(t => t.TransactionId == transactionId)
                .Select(t => new TransactionLogResponse
                {
                    TransactionId = t.TransactionId,
                    ReferenceId = t.Transaction.RefId, // Assuming there's a relationship between ActivityLog and TransactionEntries
                    Action = t.Action,
                    CreatedBy = t.CreatedBy,
                    CreatedAt = t.CreatedAt,
                    ModifiedBy = t.ModifiedBy,
                    ModifiedAt = t.ModifiedAt
                })
                .FirstOrDefaultAsync();

            return transactionLog;
        }

       /* public async Task<ViewPageResponse> GetViewPageData(int locationId)
        {

            var fieldsResponse = GetFields(locationId);
            var lastReadings = await GetLastReadings(locationId);
            var mtdAverages = await MTDAverage(locationId);
            var previousMonthAverages = await PreviousMonthAverage(locationId);

            var viewPageResponse = new ViewPageResponse
            {
                DailyFields = new List<ViewPageFieldResponse>(),
                MonthlyFields = new List<ViewPageFieldResponse>()
            };

            var allFields = fieldsResponse.DailyFields.Concat(fieldsResponse.MonthlyFields).ToList();
            var allLastReadings = lastReadings.DailyFields.Concat(lastReadings.MonthlyFields).ToList();
            var allMtdAverages = mtdAverages.DailyFields.Concat(mtdAverages.MonthlyFields).ToList();
            var allPreviousMonthAverages = previousMonthAverages.DailyFields.Concat(previousMonthAverages.MonthlyFields).ToList();

            foreach (var field in allFields)
            {
                var lastReading = allLastReadings.FirstOrDefault(f => f.Id == field.Id);
                var mtdAverage = allMtdAverages.FirstOrDefault(f => f.Id == field.Id);
                var previousMonthAverage = allPreviousMonthAverages.FirstOrDefault(f => f.Id == field.Id);

                var viewPageFieldResponse = new ViewPageFieldResponse
                {
                    FieldId = field.Id,
                    FieldName = field.Name,
                    SequenceId = field.SequenceId,
                    Frequency = field.Frequency,
                    LastTransactionValue = lastReading?.Type ?? string.Empty,
                    MtdAverage = mtdAverage?.Type ?? string.Empty,
                    PreviousMonthAverage = previousMonthAverage?.Type ?? string.Empty,
                    HasChild = field.HasChild,
                    SubFields = new List<SubFieldTransactionResponse>()
                };

                if (field.HasChild)
                {
                    var subFields = await _dbContext.SubFieldMasters
                        .Where(sf => sf.FieldId == field.Id)
                        .ToListAsync();

                    foreach (var subField in subFields)
                    {
                        var lastSubFieldTransaction = allLastReadings.FirstOrDefault(f => f.Id == subField.Id);

                        var subFieldMtdAverage = allMtdAverages.FirstOrDefault(f => f.Id == subField.Id);
                        var subFieldPreviousMonthAverage = allPreviousMonthAverages.FirstOrDefault(f => f.Id == subField.Id);

                        var subFieldResponse = new SubFieldTransactionResponse
                        {
                            SubFieldId = subField.Id,
                            SubFieldName = subField.Name,
                            SequenceId = subField.SequenceId,
                            LastTransactionValue = lastSubFieldTransaction?.Type ?? string.Empty,
                            MtdAverage = subFieldMtdAverage?.Type ?? string.Empty,
                            PreviousMonthAverage = subFieldPreviousMonthAverage?.Type ?? string.Empty

                        };

                        viewPageFieldResponse.SubFields.Add(subFieldResponse);
                    }
                }


                if (field.Frequency == FrequencyType.Daily)
                {
                    viewPageResponse.DailyFields.Add(viewPageFieldResponse);
                }
                else if (field.Frequency == FrequencyType.Monthly)
                {
                    viewPageResponse.MonthlyFields.Add(viewPageFieldResponse);
                }
            }

            return viewPageResponse;
        }
*/

    }
}

