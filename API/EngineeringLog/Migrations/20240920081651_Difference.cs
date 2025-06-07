using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EngineeringLog.Migrations
{
    /// <inheritdoc />
    public partial class Difference : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "HourAvg",
                table: "TransactionValues",
                newName: "Difference");

            migrationBuilder.AlterColumn<string>(
                name: "Remarks",
                table: "TransactionEntries",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Difference",
                table: "TransactionValues",
                newName: "HourAvg");

            migrationBuilder.AlterColumn<string>(
                name: "Remarks",
                table: "TransactionEntries",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
