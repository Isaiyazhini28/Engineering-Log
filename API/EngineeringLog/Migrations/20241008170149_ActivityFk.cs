using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EngineeringLog.Migrations
{
    /// <inheritdoc />
    public partial class ActivityFk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ModifiedAt",
                table: "ActivityLogs");

            migrationBuilder.DropColumn(
                name: "ModifiedBy",
                table: "ActivityLogs");

            migrationBuilder.AddColumn<int>(
                name: "ActivityType",
                table: "ActivityLogs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TransactionValues_SubFieldId",
                table: "TransactionValues",
                column: "SubFieldId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionEntries_LocationId",
                table: "TransactionEntries",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionEntries_LocationMasters_LocationId",
                table: "TransactionEntries",
                column: "LocationId",
                principalTable: "LocationMasters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionValues_SubFieldMasters_SubFieldId",
                table: "TransactionValues",
                column: "SubFieldId",
                principalTable: "SubFieldMasters",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TransactionEntries_LocationMasters_LocationId",
                table: "TransactionEntries");

            migrationBuilder.DropForeignKey(
                name: "FK_TransactionValues_SubFieldMasters_SubFieldId",
                table: "TransactionValues");

            migrationBuilder.DropIndex(
                name: "IX_TransactionValues_SubFieldId",
                table: "TransactionValues");

            migrationBuilder.DropIndex(
                name: "IX_TransactionEntries_LocationId",
                table: "TransactionEntries");

            migrationBuilder.DropColumn(
                name: "ActivityType",
                table: "ActivityLogs");

            migrationBuilder.AddColumn<DateTime>(
                name: "ModifiedAt",
                table: "ActivityLogs",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "ModifiedBy",
                table: "ActivityLogs",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
