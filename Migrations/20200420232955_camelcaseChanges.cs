using Microsoft.EntityFrameworkCore.Migrations;

namespace ContactsApp.Migrations
{
    public partial class camelcaseChanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MiddleName",
                table: "Users",
                newName: "Middlename");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "Users",
                newName: "Lastname");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "Users",
                newName: "Firstname");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Middlename",
                table: "Users",
                newName: "MiddleName");

            migrationBuilder.RenameColumn(
                name: "Lastname",
                table: "Users",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "Firstname",
                table: "Users",
                newName: "FirstName");
        }
    }
}
