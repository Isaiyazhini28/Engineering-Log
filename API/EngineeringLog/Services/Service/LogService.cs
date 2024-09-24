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
            var frequencyType = (FrequencyType)frequency;
            var todayTransactionEntries = _dbContext.TransactionEntries
                .Where(te => te.CreatedDate.Date == DateTime.UtcNow.Date) 
                .Select(te => te.LocationId)
                .ToHashSet(); 
            List<LocationResponse> locations = _dbContext.LocationMasters
                .Where(x => x.IsActive && x.Fields.Any(f => f.Frequency == frequencyType && f.IsActive))
                .Select(x => new LocationResponse
                {
                    Id = x.Id,
                    Name = x.Name,
                    SequenceId = x.SequenceId,
                    Status = todayTransactionEntries.Contains(x.Id) ? "Completed" : "Pending"
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
                                SequenceId = s.SequenceId,
                                Type = s.Type,

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
                    // Update MTD averages for subfields
                    field.ChildFields.ForEach(subField =>
                    {
                        subField.PreviousReading = lastReadings.Where(x => x.FieldId == field.Id && x.SubFieldId == subField.Id).Select(x => x.LastReading).FirstOrDefault("");
                        subField.MtdAvg = mtdAverages.Where(x => x.FieldId == field.Id && x.SubFieldId == subField.Id).Select(x => x.MtdAverage).FirstOrDefault(0);
                        var subFieldPreviousReading = lastReadings.FirstOrDefault(x => x.FieldId == field.Id && x.SubFieldId == subField.Id);
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
            var lastReadings = await (from te in _dbContext.TransactionEntries
                                      join tv in _dbContext.TransactionValues on te.Id equals tv.TransactionId
                                      where te.LocationId == locationId
                                      orderby te.CreatedDate descending
                                      select new PreviousReadingResponse
                                      {
                                          FieldId = tv.FieldId,
                                          SubFieldId = tv.SubFieldId,
                                          LastReading = tv.Value
                                      })
                                       .GroupBy(r => new { r.FieldId, r.SubFieldId })
                                       .Select(g => g.FirstOrDefault())
                                       .ToListAsync();

            return lastReadings;
        }
        public async Task<List<PreviousMonthAvgResponse>> PreviousMonthAverage(int locationId)
        {
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
                                              select new PreviousMonthAvgResponse
                                              {
                                                  FieldId = fieldGroup.Key.FieldId,
                                                  SubFieldId = fieldGroup.Key.SubFieldId,
                                                  PreviousMonthAvg = fieldGroup.Average(x => x.Difference)// Format to 5 decimal places
                                              }).ToListAsync();

            return previousMonthAvgData;
        }


        private string GenerateReferenceId(int locationId)
        {
            string currentDate = DateTime.UtcNow.ToString("yyyyMMdd");
            int transactionCount = _dbContext.TransactionEntries
                .Where(t => t.LocationId == locationId && t.CreatedDate.Date == DateTime.UtcNow.Date)
                .Count();

            string serialNumber = (transactionCount + 1).ToString("D4");
            return $"{currentDate}-{locationId}-{serialNumber}";
        }
        public async Task<List<TransactionEntryResponse>> CreateTransaction(TransactionRequest request)
        {
            string refId = GenerateReferenceId(request.LocationId);
            var latestTransaction = await _dbContext.TransactionEntries
               .Where(te => te.LocationId == request.LocationId)
               .OrderByDescending(te => te.CreatedDate)
               .FirstOrDefaultAsync();
            if (latestTransaction == null)
            {
                latestTransaction = new TransactionEntries { CreatedDate = DateTime.MinValue };
            }

            var previousEntries = await _dbContext.TransactionValues
                .Where(tv => tv.TransactionId == latestTransaction.Id &&
                             request.Fields.Select(f => f.FieldId).Contains(tv.FieldId))
                .GroupBy(tv => tv.FieldId)
                .Select(g => g.OrderByDescending(tv => tv.Transaction.CreatedDate).FirstOrDefault())
                .ToListAsync();
            var transactionEntry = new TransactionEntries
            {
                RefId = refId,
                LocationId = request.LocationId,
                CreatedBy = request.EmpId,
                CreatedDate = DateTime.UtcNow,
                ApprovalStatus = ApprovalStatus.Pending,
                RevisedBy = request.EmpId,
            };
            _dbContext.TransactionEntries.Add(transactionEntry);
            _dbContext.SaveChanges();

            List<TransactionValues>transactionValues = request.Fields.Select(field =>
            {
                var previousEntry = previousEntries
                      .FirstOrDefault(tv => tv.FieldId == field.FieldId);
                float perHourAvg = 0;
                float perMinAvg = 0;
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
                Action = $"Transaction created in Location ID: {request.LocationId}",
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
            transactionEntry.ApprovalStatus = ApprovalStatus.Pending;
            _dbContext.TransactionEntries.Update(transactionEntry);
            await _dbContext.SaveChangesAsync();
            var previousEntries = await _dbContext.TransactionValues
                .Where(tv => tv.TransactionId == transactionEntry.Id &&
                             request.Fields.Select(f => f.FieldId).Contains(tv.FieldId))
                .ToListAsync();
            var updatedTransactionValues = request.Fields.Select(field =>
            {
                var previousEntry = previousEntries
                    .FirstOrDefault(tv => tv.FieldId == field.FieldId);
                float perHourAvg = 0;
                float perMinAvg = 0;
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
                    ReferenceId = t.Transaction.RefId, 
                    Action = t.Action,
                    CreatedBy = t.CreatedBy,
                    CreatedAt = t.CreatedAt,
                    ModifiedBy = t.ModifiedBy,
                    ModifiedAt = t.ModifiedAt
                })
                .FirstOrDefaultAsync();

            return transactionLog;
        }

        public async Task<ApproverResponse> ApproveTransaction(int transactionId, ApproverRequest request)
        {
            // Retrieve the transaction entry by ID
            var transactionEntry = await _dbContext.TransactionEntries
                .FirstOrDefaultAsync(te => te.Id == transactionId);

            if (transactionEntry == null)
            {
                return new ApproverResponse
                {
                    TransactionId = transactionId,
                    Message = "Transaction not found",

                };
            }

            transactionEntry.ApprovalStatus = ApprovalStatus.Complete;
            transactionEntry.Remarks = request.Remark;
            transactionEntry.ActionBy = request.EmpId;
            transactionEntry.ActionAt = DateTime.UtcNow;

            // Update the transaction in the database
            _dbContext.TransactionEntries.Update(transactionEntry);

            // Log the action in the ActivityLog table
            var activityLog = new ActivityLog
            {
                TransactionId = transactionEntry.Id,
                Action = "Approved " + transactionEntry.RefId,
                CreatedBy = request.EmpId,
                CreatedAt = DateTime.UtcNow,
                ModifiedBy = request.EmpId,
                ModifiedAt = DateTime.UtcNow
            };

            _dbContext.ActivityLogs.Add(activityLog);
            await _dbContext.SaveChangesAsync();

            return new ApproverResponse
            {
                TransactionId = transactionEntry.Id,
                Message = "Approved-" + transactionEntry.RefId,
            };
        }
        public async Task<ApproverResponse> RejectTransaction(int transactionId, ApproverRequest request)
        {
            // Retrieve the transaction entry by ID
            var transactionEntry = await _dbContext.TransactionEntries
                .FirstOrDefaultAsync(te => te.Id == transactionId);

            if (transactionEntry == null)
            {
                return new ApproverResponse
                {
                    TransactionId = transactionId,
                    Message = "Transaction not found",

                };
            }

            transactionEntry.ApprovalStatus = ApprovalStatus.Reject;
            transactionEntry.Remarks = request.Remark;
            transactionEntry.ActionBy = request.EmpId;
            transactionEntry.ActionAt = DateTime.UtcNow;

            // Update the transaction in the database
            _dbContext.TransactionEntries.Update(transactionEntry);

            // Log the action in the ActivityLog table
            var activityLog = new ActivityLog
            {
                TransactionId = transactionEntry.Id,
                Action = "Rejected" + transactionEntry.RefId,
                CreatedBy = "CurrentUser", // Replace with actual logged-in user
                CreatedAt = DateTime.UtcNow,
                ModifiedBy = request.EmpId,
                ModifiedAt = DateTime.UtcNow
            };

            _dbContext.ActivityLogs.Add(activityLog);
            await _dbContext.SaveChangesAsync();

            return new ApproverResponse
            {
                TransactionId = transactionEntry.Id,
                Message = "Rejected-" + transactionEntry.RefId,
            };
        }
        public async Task<MultipleTransaApproverResponse> CompleteMultipleTransactions(MultipleTransaApproverRequest request)
        {
            var completedTransactionIds = new List<int>();

            foreach (var transactionId in request.TransactionIds)
            {
                // Retrieve the transaction entry by ID
                var transactionEntry = await _dbContext.TransactionEntries
                    .FirstOrDefaultAsync(te => te.Id == transactionId);


                transactionEntry.ApprovalStatus = ApprovalStatus.Complete;
                transactionEntry.Remarks = request.Remark;
                transactionEntry.ActionBy = request.EmpId;
                transactionEntry.ActionAt = DateTime.UtcNow;

                _dbContext.TransactionEntries.Update(transactionEntry);

                // Log the action in the ActivityLog table
                var activityLog = new ActivityLog
                {
                    TransactionId = transactionEntry.Id,
                    Action = "Transaction Completed",
                    CreatedBy = request.EmpId,
                    CreatedAt = DateTime.UtcNow,
                    ModifiedBy = request.EmpId,
                    ModifiedAt = DateTime.UtcNow
                };

                _dbContext.ActivityLogs.Add(activityLog);
                completedTransactionIds.Add(transactionId);
            }

            await _dbContext.SaveChangesAsync();

            return new MultipleTransaApproverResponse
            {
                CompletedTransactionIds = completedTransactionIds,
                Message = $"Successfully completed {completedTransactionIds.Count} transaction(s)."
            };
        }



    }
}

