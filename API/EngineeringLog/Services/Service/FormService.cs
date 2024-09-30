using EngineeringLog.Data;
using EngineeringLog.Models.Entity;
using EngineeringLog.Models.Request;
using EngineeringLog.Models.Response;
using EngineeringLog.Services.IServices;
using Microsoft.EntityFrameworkCore;

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
                .Where(t => t.LocationId == locationId && t.CreatedDate.Date == DateTime.UtcNow.Date)
                .Count();

            string serialNumber = (transactionCount + 1).ToString("D4");
            return $"{currentDate}-{locationId}-{serialNumber}";
        }


        public async Task<int> CreateTransactionAsync(CreateTransactionRequest request)
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
                        SubFieldId = 0, 
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


            return transactionEntry.Id;
        }
        public async Task<List<TransactionValueResponse>> GetOpenTransactionValuesAsync(int locationId)
        {
            var transactionValues = await _dbContext.TransactionValues
                .Include(tv => tv.Field) 
                .Include(tv => tv.SubField) 
                .Where(tv => tv.Transaction.LocationId == locationId && tv.Transaction.CreatedDate >= DateTime.UtcNow.Date && tv.Transaction.CreatedDate < DateTime.UtcNow.Date.AddDays(1)
                          && tv.Transaction.ApprovalStatus == ApprovalStatus.Open)
                .Select(tv => new TransactionValueResponse
                {
                    TransactionValueId = tv.Id,
                    FieldId = tv.Field.Id,
                    FieldName = tv.Field.Name,
                    SubFieldId = tv.SubField.Id,
                    SubFieldName = tv.SubField != null ? tv.SubField.Name : null,
                    Value = tv.Value,
                    Difference = tv.Difference
                })
                .ToListAsync();

            return transactionValues;
        }

        public async Task<int> UpdateTransactionValueAsync(UpdateTransactionValueRequest request)
        {
            var transactionValue = await _dbContext.TransactionValues
                .Include(tv => tv.Transaction) 
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

           
            if (previousEntry == null)
            {
                Console.WriteLine("No previous entry found for the current transaction value.");
            }

            float perHourAvg;
            float perMinAvg;

            if (previousEntry == null || previousEntry.Transaction == null)
            {
                // No previous entry found; use default values
                perHourAvg = transactionValue.Difference / 24; // Default per hour average
                perMinAvg = perHourAvg / 60; // Default per minute average
            }
            else
            {
                // Calculate the time difference in hours
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

            return request.TransactionValueId;
        }
        public async Task<string> UpdateTransactionStatusAsync(UpdateTransactionStatusRequest request)
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
            string response= transactionEntry.Location.Name;

            return response; 
        }























        public async Task<string> CreateTransaction(TransactionRequest request)
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
            _dbContext.ActivityLogs.Add(activityLog);*/
            await _dbContext.SaveChangesAsync();
            _dbContext.ChangeTracker.Clear();
           
            return $" submitted successfully.";
        }

        public async Task<ViewPageResponse> GetViewPage(int locationId)
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
            List<MtdAverageResponse> mtdAverages = await MTDAverage(locationId);
            List<PreviousMonthAvgResponse> previousMonthAverages = await PreviousMonthAverage(locationId);

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

            // Retrieve previous readings from the last transaction
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

        private async Task<List<MtdAverageResponse>> MTDAverage(int locationId)
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
                                                  PreviousMonthAvg = fieldGroup.Average(x => x.Difference)
                                              }).ToListAsync();

            return previousMonthAvgData;
        }
        public async Task<List<TransactionLogResponse>> GetTransactionLogById(int transactionId)
        {
            var transactionLogs = await _dbContext.ActivityLogs
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
                .ToListAsync(); 

            return transactionLogs; 
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





        public async Task<ApproverResponse> ApproveTransaction(int transactionId, ApproverRequest request)
            {
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
            _dbContext.TransactionEntries.Update(transactionEntry);
            var activityLog = new ActivityLog
            {
                TransactionId = transactionEntry.Id,
                Action = "Rejected" + transactionEntry.RefId,
                CreatedBy=request.EmpId,
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

                 var activityLog = new ActivityLog
                 {
                     TransactionId = transactionEntry.Id,
                     Action = "Approved-"+transactionEntry.RefId,
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
                 Message = $"Approved {completedTransactionIds.Count} transaction(s)."
             };
         }

    }
}
