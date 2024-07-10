using EmployeeProfile.Data;
using EmployeeProfile.Models.Entity;
using EmployeeProfile.Models.Response;
using EmployeeProfile.Models.Request;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeProfile.Services
{
    public class EmployeeServices
    {
        private readonly ApiContext context;
        public EmployeeServices(ApiContext empcontext)
        {
            context = empcontext;
        }
        /*
        var innerJoinQuery = from category in categories
                               join prod in products on category.ID equals prod.CategoryID
                               select new { ProductName = prod.Name, Category = category.Name };//produces flat sequence
        var innerGroupJoinQuery2 = from category in categories
                                   join prod in products on category.ID equals prod.CategoryID into prodGroup
                                   from prod2 in prodGroup
                                   where prod2.UnitPrice > 2.50M
                                   select prod2;
       */
        public String CreateEmployee(EmployeeRequest request)
        {

            EmpRec employee = new EmpRec();
            employee.AddEmployee(request);
            context.EmployeesData.Add(employee);
            context.SaveChanges();

            return $"{employee.ID}was added";
        }

        public string UpdateEmployee(int id, EmployeeRequestUpdate request)
        {

            var employee = context.EmployeesData.Find(id);
            if (employee == null)
            {
                return "Employee not found";
            }
            employee.UpdateEmployee(request);
            context.EmployeesData.Update(employee);
            context.SaveChanges();
            return $"{employee.ID} was updated";
        }

        public string DeleteEmployee(int id)
        {
            var employee = context.EmployeesData.Find(id);
            if (employee == null)
            {
                return "Employee not found";
            }

            context.EmployeesData.Remove(employee);
            context.SaveChanges();
            return $"{employee.ID} was deleted";
        }

        public EmployeeResponse GetEmployee(int id)
        {

            var employee = (from e in context.EmployeesData where e.ID == id select e).Include(e => e.Department).FirstOrDefault();
            if (employee == null)
            {
                return null;
            }
            return EmployeeResponse.FromEmployeeEntity(employee);
        }

        public List<EmployeeResponse> GetEmployeeByDepartment(int departmentId)
        {
            var employees = (from e in context.EmployeesData 
                             where e.DepartmentId == departmentId orderby e.EmployeeName select e)
                            .Include(e => e.Department)
                            .ToList();
            return employees.Select(EmployeeResponse.FromEmployeeEntity).ToList();

        }
        public List<DepartmentSummary> GetDepartmentSummaries()
        {
            /*var groupedData = collection1
                            .Join(collection2,
                                item1 => item1.CommonProperty,
                                item2 => item2.CommonProperty,
                                (item1, item2) => new { Item1 = item1, Item2 = item2 })
                            .GroupBy(
                                result => new { result.Item1.GroupByProperty, result.Item2.GroupByProperty },
                                result => new { result.Item1.Property, result.Item2.Property })
                            .Select(group => new
                                {
                                    Key = group.Key,
                                    Values = group.ToList()
                                });

             var joinedData = collection1
                            .GroupJoin(collection2,
                                item1 => item1.CommonProperty,
                                item2 => item2.CommonProperty,
                                (item1, item2Group) => new { Item1 = item1, Item2Group = item2Group })
                            .SelectMany(
                                result => result.Item2Group.DefaultIfEmpty(),
                                (result, item2) => new { Item1 = result.Item1, Item2 = item2 });

              var departmentSummaries = context.EmployeesData
                                    .Join(
                                        context.Departments,
                                        emp => emp.DepartmentId,
                                        dept => dept.DepartmentId,
                                        (emp, dept) => new { emp, dept })
                                    .GroupBy(
                                        result => result.dept.DepartmentName,
                                        result => result.emp,
                                        (key, g) => new DepartmentSummary
                                        {
                                            DepartmentName = key,
                                            EmployeeCount = g.Count()
                                        })
                                    .ToList();
            */
            var departmentSummaries = (from emp in context.EmployeesData
                                       join dept in context.Departments
                                       on emp.DepartmentId equals dept.DepartmentId
                                       group emp by dept.DepartmentName into g
                                       select new DepartmentSummary
                                       {
                                           DepartmentName = g.Key,
                                           EmployeeCount = g.Count()
                                       }).ToList();

            return departmentSummaries;
        }
        public List<EmployeewithDeparment> LeftJoinEmployee()
        {
            var query = from emp in context.EmployeesData
                        join dept in context.Departments
                        on emp.DepartmentId equals dept.DepartmentId into empDept
                        from dept in empDept.DefaultIfEmpty()
                        select new EmployeewithDeparment
                        {
                            Id = emp.ID,
                            EmployeeName = emp.EmployeeName,
                            PhoneNo = emp.PhoneNumber,
                            Email = emp.Email,
                            Gender = emp.Gender,
                            DepartmentId = dept != null ? dept.DepartmentId : (int?)null,
                            DepartmentName = dept != null ? dept.DepartmentName : null,
                            ManagerName = dept != null ? dept.ManagerName : null,
                            TLName = dept != null ? dept.TLName : null
                        };

            return query.ToList();
        }
        public List<EmployeewithDeparment> RightJoinEmployee()
        {
            var query = from dept in context.Departments
                        join emp in context.EmployeesData
                        on dept.DepartmentId equals emp.DepartmentId into deptEmp
                        from emp in deptEmp.DefaultIfEmpty()
                        select new EmployeewithDeparment
                        {
                            Id = emp.ID,
                            EmployeeName = emp != null ? emp.EmployeeName : null,
                            PhoneNo = emp != null ? emp.PhoneNumber : null,
                            Email = emp != null ? emp.Email : null,
                            Gender = emp != null ? emp.Gender : null,
                            DepartmentId = dept.DepartmentId,
                            DepartmentName = dept.DepartmentName,
                            ManagerName = dept.ManagerName,
                            TLName = dept.TLName
                        };

            return query.ToList();
        }



    }
}
/*Synrax
 * var joinedData = collection1
    .GroupJoin(collection2, 
        item1 => item1.KeyProperty,
        item2 => item2.KeyProperty,
        (item1, item2Group) => new
        {
            Item1 = item1,
            Item2 = item2Group.DefaultIfEmpty()
        })
    .SelectMany(result => result.Item2.Select(item2 => new
    {
        Item1 = result.Item1,
        Item2 = item2
    }));


 orderby           :var sortedList = myList.OrderBy(item => item.PropertyName).ToList();
 orderby descending:var sortedListDesc = myList.OrderByDescending(item => item.PropertyName).ToList();
 Groupby           :var groupedResult = myList.GroupBy(item => item.PropertyName)
                          .Select(group => new 
                          {
                              Key = group.Key,
                              Items = group.ToList()
                          }).ToList();
 leftJoin          :var leftJoinResult = from item1 in list1
                     join item2 in list2 on item1.Id equals item2.List1Id into joinedItems
                     from item2 in joinedItems.DefaultIfEmpty()
                     select new 
                     {
                         Item1 = item1,
                         Item2 = item2 // this will be null if no matching item in list2
                     };
 

 */