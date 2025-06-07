using EngineeringLog.Data;
using EngineeringLog.Models.Entity;
using EngineeringLog.Models.Request;
using EngineeringLog.Models.Response;
using EngineeringLog.Services.IServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;


namespace EngineeringLog.Services.Service
{
    public class FormService : IFormService
    {

        private readonly ApiContext _dbContext;
        public FormService(ApiContext dbContext)
        {
            _dbContext = dbContext;
        }
        private string GenerateReferenceId(int locationId)
        {
            string currentDate = DateTime.UtcNow.ToString("yyyyMMdd");
            int transactionCount = _dbContext.TransactionEntries
                .Where(t => t.LocationId == locationId)
                .Count();
            string serialNumber = (transactionCount + 1).ToString("D4");
            return $"{currentDate}-{locationId}-{serialNumber}";
        }   

        public async Task<int> CreateTransaction(CreateTransactionRequest request)
        {
            var existingTransaction = await _dbContext.TransactionEntries
                                    .Where(te => te.LocationId == request.LocationId
                                              && te.CreatedDate.Date == DateTime.UtcNow.Date
                                              && te.ApprovalStatus == ApprovalStatus.Open)
                                    .FirstOrDefaultAsync();
            if (existingTransaction != null)
            {
                 
                return existingTransaction.Id;
            }

            var transactionEntry = new TransactionEntries
            {
                RefId = GenerateReferenceId(request.LocationId),
                LocationId = request.LocationId,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = request.EmployeeId,
                ApprovalStatus = ApprovalStatus.Open,
                Remarks = null
            };
            _dbContext.TransactionEntries.Add(transactionEntry);
            await _dbContext.SaveChangesAsync();
            var fieldMasters = await _dbContext.FieldMasters
                                .Include(f => f.SubFields)
                                .Where(f => f.LocationId == request.LocationId)
                                .ToListAsync();

            var transactionValues = fieldMasters.SelectMany(field =>
                field.HasChild && field.SubFields != null && field.SubFields.Any()
                    ? field.SubFields.Select(subField => new TransactionValues
                    {
                        TransactionId = transactionEntry.Id,
                        FieldId = field.Id,
                        SubFieldId = subField.Id,
                        Value = string.Empty,
                        Difference = 0,
                        Reset = false,
                        PerHourAvg = 0,
                        PerMinAvg = 0
                    })
                    : new List<TransactionValues>
                    {
                    new TransactionValues
                    {
                        TransactionId = transactionEntry.Id,
                        FieldId = field.Id,
                        SubFieldId = null, 
                        Value = string.Empty,
                        Difference = 0,
                        Reset = false,
                        PerHourAvg = 0,
                        PerMinAvg = 0
                    }
                    }
            );
            await _dbContext.TransactionValues.AddRangeAsync(transactionValues);
            await _dbContext.SaveChangesAsync();
            var location = await _dbContext.LocationMasters
                            .Where(l => l.Id == request.LocationId)
                            .FirstOrDefaultAsync();
            var activityLog = new ActivityLog
            {
                TransactionId = transactionEntry.Id,
                Action = $"Created Transaction in {location.Name}",
                CreatedBy = request.EmployeeId,
                CreatedAt = DateTime.UtcNow,
                ActivityType = ActivityType.Log
            };
            _dbContext.ActivityLogs.Add(activityLog);
            await _dbContext.SaveChangesAsync();
            return transactionEntry.Id;
        }

        public async Task<TransactionValueResponse> GetOpenTransactionValues(int locationId)
        {
            DateTime transactionDate = DateTime.UtcNow;
            List<ViewPagePreReaResponse> previousReadings = await PreviousReadings(locationId, transactionDate);
            List<MtdAverageResponse> mtdAverages = await MTDAverage(locationId, transactionDate);
            List<PreviousMonthAvgResponse> previousMonthAverages = await PreviousMonthAverage(locationId, transactionDate);
            var transactionValues = await _dbContext.TransactionValues
                .Include(tv => tv.Field) 
                .Include(tv => tv.SubField) 
                .Where(tv => tv.Transaction.LocationId == locationId && tv.Transaction.CreatedDate >= DateTime.UtcNow.Date && tv.Transaction.CreatedDate < DateTime.UtcNow.Date.AddDays(1)
                          && tv.Transaction.ApprovalStatus == ApprovalStatus.Open)
                .Select(tv => new TransactionFieldValueResponse
                {
                    TransactionValueId = tv.Id,
                    FieldId = tv.Field.Id,
                    FieldName = tv.Field.Name,
                    FieldSequenceId=tv.Field.SequenceId,
                    SubFieldId = tv.SubField.Id,
                    SubFieldName = tv.SubField != null ? tv.SubField.Name : null,
                    SubFieldSequenceId=tv.SubFieldId != null ? tv.SubField.SequenceId: null, 
                    Value = tv.Value,
                    Difference = tv.Difference,
                    Frequency = tv.Field.Frequency,
                    Type= tv.Field.Type
                })
                 .OrderBy(tv => tv.FieldSequenceId) 
                .ThenBy(tv => tv.SubFieldSequenceId)    
                .ToListAsync();
            foreach (var field in transactionValues.GroupBy(tv => tv.FieldId))
            {
                var currentField = field.FirstOrDefault();

                if (field.Any(f => f.SubFieldId != null))
                {
                    foreach (var subField in field.Where(f => f.SubFieldId != null))
                    {
                        subField.PreviousReading = previousReadings
                            .Where(x => x.FieldId == subField.FieldId && x.SubFieldId == subField.SubFieldId)
                            .Select(x => x.LastReading).FirstOrDefault() ?? string.Empty;

                        subField.MtdAvg = mtdAverages
                            .Where(x => x.FieldId == subField.FieldId && x.SubFieldId == subField.SubFieldId)
                            .Select(x => x.MtdAverage).FirstOrDefault();

                        subField.PreviousMonthAvg = previousMonthAverages
                            .Where(x => x.FieldId == subField.FieldId && x.SubFieldId == subField.SubFieldId)
                            .Select(x => x.PreviousMonthAvg).FirstOrDefault();
                    }
                }
                else
                {
                    currentField.PreviousReading = previousReadings
                        .Where(x => x.FieldId == currentField.FieldId && x.SubFieldId == null)
                        .Select(x => x.LastReading).FirstOrDefault() ?? string.Empty;
                    currentField.MtdAvg = mtdAverages
                        .Where(x => x.FieldId == currentField.FieldId && x.SubFieldId == null)
                        .Select(x => x.MtdAverage).FirstOrDefault();
                    currentField.PreviousMonthAvg = previousMonthAverages
                        .Where(x => x.FieldId == currentField.FieldId && x.SubFieldId == null)
                        .Select(x => x.PreviousMonthAvg).FirstOrDefault();
                }
            }
            var groupedTransactionValues = new TransactionValueResponse
            {
                DailyFields = transactionValues.Where(tv => tv.Frequency == FrequencyType.Daily).ToList(),
                MonthlyFields = transactionValues.Where(tv => tv.Frequency == FrequencyType.Monthly).ToList()
            };

            return groupedTransactionValues;
        }

        public async Task<string> UpdateTransactionValue(UpdateTransactionValueRequest request)
        {
            var transactionValue = await _dbContext.TransactionValues
                .Include(tv => tv.Transaction)
                .Include(tv => tv.Field)
                .FirstOrDefaultAsync(tv => tv.Id == request.TransactionValueId);

            transactionValue.Value = request.Value;
            transactionValue.Difference = request.Difference;
            transactionValue.Reset= request.Reset;

            var previousEntry = await _dbContext.TransactionValues
                                .Include(tv => tv.Transaction) 
                                .Where(tv => tv.FieldId == transactionValue.FieldId &&
                                             tv.Transaction != null &&
                                             tv.Transaction.CreatedDate < transactionValue.Transaction.CreatedDate)
                                .OrderByDescending(tv => tv.Transaction.CreatedDate)
                                .FirstOrDefaultAsync();
            float perHourAvg;
            float perMinAvg;
            if (previousEntry == null || previousEntry.Transaction == null)
            { 
                perHourAvg = transactionValue.Difference / 24; 
                perMinAvg = perHourAvg / 60;
            }
            else
            {
                var timeDifference = (transactionValue.Transaction.CreatedDate - previousEntry.Transaction.CreatedDate).TotalHours;

                if (timeDifference > 0)
                {
                    perHourAvg = transactionValue.Difference / (float)timeDifference;
                    perMinAvg = perHourAvg / 60;
                }
                else
                {
                    perHourAvg = 0;
                    perMinAvg = 0;
                }
            }
            transactionValue.PerHourAvg = perHourAvg;
            transactionValue.PerMinAvg = perMinAvg;
            transactionValue.Transaction.RevisedBy = request.EmployeeId;

            await _dbContext.SaveChangesAsync();
            var activityLog = new ActivityLog
            {
                TransactionId = transactionValue.Transaction.Id,
                Action = $"Updated {transactionValue.Field.Name}",
                CreatedBy = request.EmployeeId,
                CreatedAt = DateTime.UtcNow,
                ActivityType=ActivityType.Log
            };
            _dbContext.ActivityLogs.Add(activityLog);
            await _dbContext.SaveChangesAsync();

            string response = transactionValue.Field.Name;

            return $"{response} updated successfully.";
        }

        public async Task<string> UpdateTransactionStatus(UpdateTransactionStatusRequest request)
        {
            var transactionEntry = await _dbContext.TransactionEntries
                .Include(te => te.Location)
                .FirstOrDefaultAsync(te => te.Id == request.TransactionId);
            if (request.Submitted)
            {
                transactionEntry.ApprovalStatus = ApprovalStatus.Pending;
                transactionEntry.RevisedBy = request.EmployeeId;
                transactionEntry.Remarks = request.Remark;
            }
            await _dbContext.SaveChangesAsync();
            var activityLog = new ActivityLog
            {
                TransactionId = transactionEntry.Id,
                Action = $"Updated {transactionEntry.Location.Name}",
                CreatedBy = request.EmployeeId.ToString(),
                CreatedAt = DateTime.UtcNow,
                ActivityType= ActivityType.Log
            };
            _dbContext.ActivityLogs.Add(activityLog);
            await _dbContext.SaveChangesAsync();
            string response= transactionEntry.Location.Name;

            return $"{response} updated successfully."; 
        }

        /* public async Task<ViewPageResponse> GetViewPage(int locationId)
         {
             List<ViewPageFieldResponse> fields = await _dbContext.FieldMasters
                 .Where(x => x.LocationId == locationId && x.IsActive)
                 .Select(x => new ViewPageFieldResponse
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
                             .Select(s => new ViewPageSubFieldResponse
                             {
                                 Id = s.Id,
                                 Name = s.Name,
                                 SequenceId = s.SequenceId,
                                 Type = s.Type,
                                 HasChild = s.HasChild
                             }).ToList()
                         : new List<ViewPageSubFieldResponse>()
                 })
                 .ToListAsync();

             List<ViewPageCurrentReaResponse> currentReadings = await GetCurrentReading(locationId);
             List<ViewPagePreReaResponse> previousReadings = await GetPreviousReadings(locationId);
             List<MtdAverageResponse> mtdAverages = await GetMTDAverage(locationId);
             List<PreviousMonthAvgResponse> previousMonthAverages = await GetPreviousMonthAverage(locationId);

             fields.ForEach(field =>
             {
                 if (field.HasChild)
                 {
                     field.ChildFields.ForEach(subField =>
                     {
                         subField.CurrentReading = currentReadings
                             .Where(x => x.FieldId == field.Id && x.SubFieldId == subField.Id)
                             .Select(x => x.CurrentReading).FirstOrDefault("");
                         subField.PreviousReading = previousReadings
                             .Where(x => x.FieldId == field.Id && x.SubFieldId == subField.Id)
                             .Select(x => x.LastReading).FirstOrDefault("");
                         subField.MtdAvg = mtdAverages
                             .Where(x => x.FieldId == field.Id && x.SubFieldId == subField.Id)
                             .Select(x => x.MtdAverage).FirstOrDefault(0);
                         subField.PreviousMonthAvg = previousMonthAverages
                             .Where(x => x.FieldId == field.Id && x.SubFieldId == subField.Id)
                             .Select(x => x.PreviousMonthAvg).FirstOrDefault(0);
                     });
                 }
                 else
                 {
                     field.CurrentReading = currentReadings
                             .Where(x => x.FieldId == field.Id && x.SubFieldId == 0)
                             .Select(x => x.CurrentReading).FirstOrDefault("");
                     field.PreviousReading = previousReadings
                         .Where(x => x.FieldId == field.Id && x.SubFieldId == 0)
                         .Select(x => x.LastReading).FirstOrDefault("");
                     field.MtdAvg = mtdAverages
                         .Where(x => x.FieldId == field.Id && x.SubFieldId == 0)
                         .Select(x => x.MtdAverage).FirstOrDefault(0);
                     field.PreviousMonthAvg = previousMonthAverages
                         .Where(x => x.FieldId == field.Id && x.SubFieldId == 0)
                         .Select(x => x.PreviousMonthAvg).FirstOrDefault(0);
                 }
             });
             var response = new ViewPageResponse
             {
                 CurrentReadingTransactionId = currentReadings
                                             .FirstOrDefault()?.TransactionId ?? 0,
                 ApprovalStatus = currentReadings.FirstOrDefault()?.ApprovalStatus ?? ApprovalStatus.Pending,

                 Fields = fields
             };

             return response;

         }
         private async Task<List<ViewPageCurrentReaResponse>> GetCurrentReading(int locationId)
        {
            var lastTransaction = await _dbContext.TransactionEntries
                                   .Where(te => te.LocationId == locationId)
                                   .OrderByDescending(te => te.CreatedDate)
                                   .FirstOrDefaultAsync();

            if (lastTransaction == null)
            {
                return new List<ViewPageCurrentReaResponse>();
            }

            List<ViewPageCurrentReaResponse> lastReadings = await (from tv in _dbContext.TransactionValues
                                                                   where tv.TransactionId == lastTransaction.Id
                                                                   select new ViewPageCurrentReaResponse
                                                                   {
                                                                       FieldId = tv.FieldId,
                                                                       SubFieldId = tv.SubFieldId,
                                                                       CurrentReading = tv.Value,
                                                                       TransactionId = lastTransaction.Id,
                                                                       ApprovalStatus = lastTransaction.ApprovalStatus
                                                                   }).ToListAsync();

            return lastReadings;
        }
         private async Task<List<ViewPagePreReaResponse>> GetPreviousReadings(int locationId)
         {
             var lastTransaction = await _dbContext.TransactionEntries
                                    .Where(te => te.LocationId == locationId)
                                    .OrderByDescending(te => te.CreatedDate)
                                    .Skip(1)
                                    .Select(te => te.Id)
                                    .FirstOrDefaultAsync();

             if (lastTransaction == null)
             {
                 return new List<ViewPagePreReaResponse>();
             }
             var lastReadings = await _dbContext.TransactionValues
                                         .Where(tv => tv.TransactionId == lastTransaction)
                                         .Select(g => new ViewPagePreReaResponse
                                         {
                                             FieldId = g.FieldId,
                                             SubFieldId = g.SubFieldId,
                                             LastReading = g.Value
                                         }).ToListAsync();

             return lastReadings;
         }

         private async Task<List<MtdAverageResponse>> GetMTDAverage(int locationId)
         {
             var currentDate = DateTime.UtcNow;
             var startOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1, 0, 0, 0, DateTimeKind.Utc);
             List<MtdAverageResponse> mtdAvgData = await (from te in _dbContext.TransactionEntries
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

         public async Task<List<PreviousMonthAvgResponse>> GetPreviousMonthAverage(int locationId)
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
         }*/

        public async Task<List<TransactionLogResponse>> GetTransactionLogById(int transactionId)
        {
            var transactionLogs = await _dbContext.ActivityLogs
                .Where(t => t.TransactionId == transactionId)
                .Select(t => new TransactionLogResponse
                {
                    LogID=t.LogID,   
                    TransactionId = t.TransactionId,
                    ReferenceId = t.Transaction.RefId,
                    Action = t.Action,
                    CreatedBy = t.CreatedBy,
                    CreatedAt = t.CreatedAt,
                    ActivityType= t.ActivityType
                    
                })
                .ToListAsync(); 

            return transactionLogs; 
        }
        public async Task<int> AddComment(ActivityLogCommentRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Comment))
            {
                throw new ArgumentException("Invalid comment request.");
            }
            var activityLog = new ActivityLog
            {
                TransactionId = request.TransactionId,
                Action = request.Comment,
                CreatedBy = request.EmpId,
                CreatedAt = DateTime.UtcNow,
                ActivityType = ActivityType.comment
            };
            await _dbContext.ActivityLogs.AddAsync(activityLog);
            await _dbContext.SaveChangesAsync();

            return activityLog.LogID;
        }

        public async Task<ViewPageGridResponse> GetViewPageGrid(int pageNo, int pageSize, int locationId)
        {

            var totalCount = await _dbContext.TransactionEntries.Where(te => te.LocationId == locationId).CountAsync();
            var transactionEntries = await _dbContext.TransactionEntries.Where(te => te.LocationId == locationId).OrderBy(te => te.ApprovalStatus) 
        .ThenByDescending(te => te.CreatedDate)
                .Skip((pageNo - 1) * pageSize)
                .Take(pageSize)
                .Select(te => new TransactionEntryResponse
                {
                    TransactionId = te.Id,
                    RefId = te.RefId,
                    CreatedDate = te.CreatedDate,
                    CreatedBy=te.CreatedBy,
                    RevisedBy=te.RevisedBy,
                    ApprovalStatus = te.ApprovalStatus,
                    Remarks = te.Remarks,
                    TransactionValues = _dbContext.TransactionValues
                        .Where(tv => tv.TransactionId == te.Id)
                        .Select(tv => new ViewPageTransactionValueResponse
                        {
                            ValueId = tv.Id,
                            FieldId = tv.FieldId,
                            FieldSequenceId = tv.Field.SequenceId,
                            FieldName = tv.Field.Name,
                            SubFieldId = tv.SubField.Id,
                            SubFieldSequenceId = tv.SubFieldId != null ? tv.SubField.SequenceId : null,
                            SubFieldName = tv.SubField != null ? tv.SubField.Name : null,
                            Value = tv.Value
                        }).OrderBy(tv => tv.FieldSequenceId) 
                          .ThenBy(tv => tv.SubFieldSequenceId).ToList()
                }).ToListAsync();
            return new ViewPageGridResponse
            {
                Count = totalCount,
                LocationId = locationId,
                LocationName = await _dbContext.LocationMasters.Where(l => l.Id == locationId).Select(l => l.Name).FirstOrDefaultAsync(),
                Data = transactionEntries
            };
        }

        public async Task<TransactionDetaiedResponse> GetTransactionDetails(int transactionId)
        {
            var transactionEntry = await _dbContext.TransactionEntries
                .Include(te => te.Location)
                .FirstOrDefaultAsync(te => te.Id == transactionId);

            if (transactionEntry == null)
            {
                return null; 
            }

            var transactionValues = await _dbContext.TransactionValues
                .Where(tv => tv.TransactionId == transactionId)
                .Include(tv => tv.Field)
                .Include(tv => tv.SubField)
                .ToListAsync();
            var previousReadings = await PreviousReadings(transactionEntry.LocationId, transactionEntry.CreatedDate);
            var mtdAvg = await MTDAverage(transactionEntry.LocationId, transactionEntry.CreatedDate);
            var previousMonthAvg = await PreviousMonthAverage(transactionEntry.LocationId, transactionEntry.CreatedDate);
            var response = new TransactionDetaiedResponse
            {
                CurrentReadingTransactionId = transactionEntry.Id,
                LocationId = transactionEntry.LocationId,
                LocationName = transactionEntry.Location.Name,
                ReferenceNo = transactionEntry.RefId,
                ApprovalStatus = transactionEntry.ApprovalStatus,
                Fields = transactionValues.Select(tv => new TransactionFieldResponse
                {
                    TransactionValueId = tv.Id,
                    FieldId = tv.FieldId,
                    FieldName = tv.Field.Name,
                    FieldSequenceId = tv.Field.SequenceId,
                    SubFieldId = tv.SubField?.Id,
                    SubFieldName = tv.SubField?.Name,
                    SubFieldSequenceId = tv.SubField?.SequenceId,
                    Value = tv.Value,
                    Difference = tv.Difference,
                    Type = tv.Field.Type,
                    Frequency = tv.Field.Frequency,
                    PreviousReading = previousReadings.FirstOrDefault(pr => pr.FieldId == tv.FieldId && pr.SubFieldId == tv.SubFieldId)?.LastReading,
                    MtdAvg = mtdAvg.FirstOrDefault(m => m.FieldId == tv.FieldId && m.SubFieldId == tv.SubFieldId)?.MtdAverage ?? 0,
                    PreviousMonthAvg = previousMonthAvg.FirstOrDefault(pm => pm.FieldId == tv.FieldId && pm.SubFieldId == tv.SubFieldId)?.PreviousMonthAvg ?? 0
                }).ToList()
            };

            return response;
        }

        private async Task<List<ViewPagePreReaResponse>> PreviousReadings(int locationId, DateTime transactionDate)
        {

            var lastTransaction = await _dbContext.TransactionEntries
                .Where(te => te.LocationId == locationId && te.CreatedDate <= transactionDate)
                .OrderByDescending(te => te.CreatedDate)
                .Skip(1)
                .Select(te => te.Id)
                .FirstOrDefaultAsync();

            if (lastTransaction == 0)
            {
                return new List<ViewPagePreReaResponse>();
            }

            var lastReadings = await _dbContext.TransactionValues
                .Where(tv => tv.TransactionId == lastTransaction)
                .Select(g => new ViewPagePreReaResponse
                {
                    FieldId = g.FieldId,
                    SubFieldId = g.SubFieldId,
                    LastReading = g.Value != null ? g.Value.ToString() : ""
                }).ToListAsync();
            foreach (var reading in lastReadings)
            {
                Console.WriteLine($"FieldId: {reading.FieldId}, SubFieldId: {reading.SubFieldId}, LastReading: {reading.LastReading}");
            }

            return lastReadings;
        }

        private async Task<List<MtdAverageResponse>> MTDAverage(int locationId, DateTime transactionDate)
        {
            var startOfMonth = new DateTime(transactionDate.Year, transactionDate.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var currentDate = transactionDate;

            var mtdAvgData = await (from te in _dbContext.TransactionEntries
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

        private async Task<List<PreviousMonthAvgResponse>> PreviousMonthAverage(int locationId, DateTime transactionDate)
        {
            var firstDayOfCurrentMonth = new DateTime(transactionDate.Year, transactionDate.Month, 1, 0, 0, 0, DateTimeKind.Utc);
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


        public async Task<TransaApproverResponse> TransactionsApproval(ApproverRequest request)
        {
            var completedTransactionIds = new List<int>();
            var actionType = request.IsApproved ? "Approved" : "Rejected";

            foreach (var transactionId in request.TransactionsId)
            {
                var transactionEntry = await _dbContext.TransactionEntries.FirstOrDefaultAsync(te => te.Id == transactionId); 

                if (transactionEntry != null)
                {
                    transactionEntry.ApprovalStatus = request.IsApproved ? ApprovalStatus.Complete : ApprovalStatus.Reject;
                    transactionEntry.Remarks = request.Remark ?? string.Empty;
                    transactionEntry.ActionBy = request.EmpId;
                    transactionEntry.ActionAt = DateTime.UtcNow;
                    _dbContext.TransactionEntries.Update(transactionEntry);
                    var activityLog = new ActivityLog
                    {
                        TransactionId = transactionEntry.Id,
                        Action = $"{actionType}-{transactionEntry.RefId}",
                        CreatedBy = request.EmpId,
                        CreatedAt = DateTime.UtcNow,
                        ActivityType=ActivityType.Log
                    };
                    _dbContext.ActivityLogs.Add(activityLog);
                    completedTransactionIds.Add(transactionId);
                }
            }
            await _dbContext.SaveChangesAsync();

            return new TransaApproverResponse
            {
                CompletedTransactionIds = completedTransactionIds,
                Message = $"{actionType} {completedTransactionIds.Count} transaction(s)."
            };
        }

        public async Task<ViewPageGridResponse> GetReportPage(int locationId, DateTime startDate, DateTime endDate, int pageNo, int pageSize, int? status = null)
        {
            startDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
            endDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);
            var query = _dbContext.TransactionEntries
                .Where(te => te.LocationId == locationId && te.CreatedDate >= startDate && te.CreatedDate <= endDate);
            if (status.HasValue)
            {
                var approvalStatus = (ApprovalStatus)status.Value;
                query = query.Where(te => te.ApprovalStatus == approvalStatus);
            }
            var totalCount = await query.CountAsync();
            var transactionEntries = await query
                .OrderBy(te => te.CreatedDate)
                .Skip((pageNo - 1) * pageSize)
                .Take(pageSize)
                .Select(te => new TransactionEntryResponse
                {
                    TransactionId = te.Id,
                    RefId = te.RefId,
                    CreatedDate = te.CreatedDate,
                    ApprovalStatus = te.ApprovalStatus,
                    Remarks = te.Remarks,
                    TransactionValues = _dbContext.TransactionValues
                        .Where(tv => tv.TransactionId == te.Id)
                        .Select(tv => new ViewPageTransactionValueResponse
                        {
                            ValueId = tv.Id,
                            FieldId = tv.FieldId,
                            FieldSequenceId = tv.Field.SequenceId,
                            FieldName = tv.Field.Name,
                            SubFieldId = tv.SubField != null ? tv.SubField.Id : (int?)null, 
                            SubFieldSequenceId = tv.SubFieldId != null ? tv.SubField.SequenceId : (int?)null,
                            SubFieldName = tv.SubField != null ? tv.SubField.Name : null,
                            Value = tv.Value
                        }).ToList()
                }).ToListAsync();
            return new ViewPageGridResponse
            {
                Count = totalCount,
                LocationId = locationId,
                LocationName = await _dbContext.LocationMasters
                    .Where(l => l.Id == locationId)
                    .Select(l => l.Name)
                    .FirstOrDefaultAsync(),
                Data = transactionEntries
            };
        }
    }
}
/* public async Task<List<TransactionEntryResponse>> UpdateTransaction(TransactionUpdateRequest request)
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
       */
/* public async Task<string> CreateTransaction(TransactionRequest request)
        {
            string refId = GenerateReferenceId(request.LocationId);
            var transactionEntry = new TransactionEntries
            {
                RefId = refId,
                LocationId = request.LocationId,
                CreatedBy = request.EmpId,
                Remarks=request.Remark,
                CreatedDate = DateTime.UtcNow,
                ApprovalStatus = ApprovalStatus.Pending,
                RevisedBy = request.EmpId,
            };
            _dbContext.TransactionEntries.Add(transactionEntry);
            _dbContext.SaveChanges();
            var previousEntryDate = await _dbContext.TransactionEntries
                                   .Where(te => te.LocationId == request.LocationId)
                                   .OrderByDescending(te => te.CreatedDate)
                                   .FirstOrDefaultAsync();
            List<TransactionValues> transactionValues = request.Fields.Select(field =>
            {
                float perHourAvg = 0;
                float perMinAvg = 0;
                if (previousEntryDate == null)
                {
                    perHourAvg = field.Difference / 24;
                    perMinAvg = perHourAvg / 60;
                }
                else
                {
                    var timeDifference = (transactionEntry.CreatedDate - previousEntryDate.CreatedDate).TotalHours;
                    perHourAvg = timeDifference > 0 ? field.Difference / (float)timeDifference : 0;
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
           /*ActivityLog activityLog = new 
            {
                TransactionId = transactionEntry.Id,
                Action = $"Readings entered in Location ID:{transactionEntry.Location.Name}",
                CreatedBy = request.EmpId,
                CreatedAt = DateTime.UtcNow,
                ModifiedBy = request.EmpId,
                ModifiedAt = DateTime.UtcNow
            };
            _dbContext.ActivityLogs.Add(activityLog);
await _dbContext.SaveChangesAsync();
_dbContext.ChangeTracker.Clear();

return $" submitted successfully.";
        }*/