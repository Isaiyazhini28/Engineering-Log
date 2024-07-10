using Microsoft.AspNetCore.Mvc;
using EmployeeProfile.Models.Request;
using EmployeeProfile.Services;
using EmployeeProfile.Data;
using EmployeeProfile.Models.Response;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
namespace EmployeeProfile.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeServices empService;
        
        public EmployeeController(EmployeeServices employeeService)
        {
            empService = employeeService;

        }

        [HttpPost]
        public IActionResult Create(EmployeeRequest request)
        {
            var response = empService.CreateEmployee(request);
            if (response == null) { return BadRequest("Employee is not added") ; }
            else { return Ok(response); }
        }
    

        [HttpPut("{id}")]
        public IActionResult Update(int id, EmployeeRequestUpdate request)
        {
            var response = empService.UpdateEmployee(id, request);
            if (response == null) { return BadRequest(); } else { return Ok(response); }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            string response = empService.DeleteEmployee(id);
            return !string.IsNullOrEmpty(response) ? Ok(response) : NotFound(response);
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var employee = empService.GetEmployee(id);
            return employee != null ? Ok(employee) : NotFound();
        }

        [HttpGet("department/{departmentid}")]
        public ActionResult <List<EmployeeResponse>> GetEmployeesByDepartment(int departmentid)
        {
            var employee = empService.GetEmployeeByDepartment(departmentid);
            if (employee == null) { return NotFound("No user is found in the department"); }
            return Ok(employee); 
        }
        
        [HttpGet("department-summaries")]
        public ActionResult<IEnumerable<DepartmentSummary>> GetDepartmentSummaries()
        {
            var departmentSummaries = empService.GetDepartmentSummaries();
            return Ok(departmentSummaries);
        }
        [HttpGet("leftjoin")]
        public ActionResult LeftJoinEmplloyee()
        {
            var employees = empService.LeftJoinEmployee();
            return Ok(employees);
        }
        [HttpGet("Rightjoin")]
        public ActionResult RightJoinEmployee()
        {
            var employees = empService.RightJoinEmployee();
            return Ok(employees);
        }
    }
}

