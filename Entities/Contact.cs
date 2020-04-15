using ContactsApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ContactsApp.Entities
{
    public class Contact
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public byte Gender { get; set; }
        public DateTime? Birth { get; set; }
        public string Message { get; set; }
        public bool Deleted { get; set; }
        public User User { get; set; }

        public Contact()
        {
            Deleted = false;
        }

        public static explicit operator Contact(ContactModel model)
        {
            return new Contact
            {
                Name = model.Name,
                Email = model.Email,
                Gender = model.Gender,
                Birth = model.Birth,
                Message = model.Message,
                User = model.User
            };
        }
    }
}
