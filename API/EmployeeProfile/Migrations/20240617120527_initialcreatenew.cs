using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EmployeeProfile.Migrations
{
    /// <inheritdoc />
    public partial class initialcreatenew : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Department",
                table: "EmployeesData");

            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "EmployeesData",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    DepartmentId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DepartmentName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.DepartmentId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmployeesData_DepartmentId",
                table: "EmployeesData",
                column: "DepartmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_EmployeesData_Departments_DepartmentId",
                table: "EmployeesData",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "DepartmentId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmployeesData_Departments_DepartmentId",
                table: "EmployeesData");

            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropIndex(
                name: "IX_EmployeesData_DepartmentId",
                table: "EmployeesData");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "EmployeesData");

            migrationBuilder.AddColumn<string>(
                name: "Department",
                table: "EmployeesData",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
