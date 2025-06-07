using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EngineeringLog.Migrations
{
    /// <inheritdoc />
    public partial class subfieldchild : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasChild",
                table: "SubFieldMasters",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasChild",
                table: "SubFieldMasters");
        }
    }
}
