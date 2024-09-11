using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace EngineeringLog.Migrations
{
    /// <inheritdoc />
    public partial class TransEntry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TransactionEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RefId = table.Column<string>(type: "text", nullable: false),
                    LocationId = table.Column<int>(type: "integer", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "text", nullable: false),
                    RevisedBy = table.Column<string>(type: "text", nullable: true),
                    ApprovalStatus = table.Column<int>(type: "integer", nullable: false),
                    ActionBy = table.Column<string>(type: "text", nullable: true),
                    ActionAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Remarks = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionEntries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TransactionValues",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TransactionId = table.Column<int>(type: "integer", nullable: false),
                    FieldId = table.Column<int>(type: "integer", nullable: false),
                    SubFieldId = table.Column<int>(type: "integer", nullable: true),
                    Value = table.Column<string>(type: "text", nullable: false),
                    Reset = table.Column<bool>(type: "boolean", nullable: false),
                    HourAvg = table.Column<float>(type: "real", nullable: false),
                    PerHourAvg = table.Column<float>(type: "real", nullable: false),
                    PerMinAvg = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionValues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TransactionValues_FieldMasters_FieldId",
                        column: x => x.FieldId,
                        principalTable: "FieldMasters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TransactionValues_SubFieldMasters_SubFieldId",
                        column: x => x.SubFieldId,
                        principalTable: "SubFieldMasters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TransactionValues_TransactionEntries_TransactionId",
                        column: x => x.TransactionId,
                        principalTable: "TransactionEntries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TransactionValues_FieldId",
                table: "TransactionValues",
                column: "FieldId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionValues_SubFieldId",
                table: "TransactionValues",
                column: "SubFieldId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionValues_TransactionId",
                table: "TransactionValues",
                column: "TransactionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TransactionValues");

            migrationBuilder.DropTable(
                name: "TransactionEntries");
        }
    }
}
