using ContactsApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContactsApp.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Middlename { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public ICollection<Contact> Contacts { get; set; }

        public User()
        {
            Contacts = new List<Contact>();
        }

        public static explicit operator User(RegisterModel model)
        {
            return new User
            {
                Username = model.Username,
                Password = model.Password,
                Firstname = model.FirstName,
                Lastname = model.LastName,
                Middlename = model.Middlename,
                Role = model.Role
            };
        }
    }
}
