using ContactsApp.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ContactsApp.Models
{
    public class ContactModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public byte Gender { get; set; }
        [Required]
        public DateTime? Birth { get; set; }
        [Required]
        public string Message { get; set; }

        public User User { get; set; }

    }
}
