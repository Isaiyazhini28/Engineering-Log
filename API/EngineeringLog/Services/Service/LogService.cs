using EngineeringLog.Data;
using EngineeringLog.Models.Entity;
using EngineeringLog.Models.Response;
using EngineeringLog.Services.IServices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Xml;

namespace EngineeringLog.Services.Service
{
    public class LogService : IService
    {
        private readonly ApiContext context;
        public LogService(ApiContext engcontext)
        {
            context = engcontext;
        }
        public MapResponse GetMapByPlantId(string plantId)
        {
            var mapMaster = context.Set<MapMaster>()
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
            var locations = context.Set<LocationMaster>()
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
            var fields = context.Set<FieldMaster>()
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
                        ? context.Set<SubFieldMaster>()
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

            // Initialize the response
            var response = new FieldFrequencyResponse
            {
                DailyFields = dailyFields,
                MonthlyFields = monthlyFields
            };

            return response;
        }


    }


}
