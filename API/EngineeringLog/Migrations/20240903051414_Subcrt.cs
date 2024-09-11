using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EngineeringLog.Migrations
{
    /// <inheritdoc />
    public partial class Subcrt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TransactionValues_SubFieldMasters_SubFieldId",
                table: "TransactionValues");

            migrationBuilder.DropIndex(
                name: "IX_TransactionValues_SubFieldId",
                table: "TransactionValues");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_TransactionValues_SubFieldId",
                table: "TransactionValues",
                column: "SubFieldId");

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionValues_SubFieldMasters_SubFieldId",
                table: "TransactionValues",
                column: "SubFieldId",
                principalTable: "SubFieldMasters",
                principalColumn: "Id");
        }
    }
}
