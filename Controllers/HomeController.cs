using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ContactsApp.Data;
using ContactsApp.Entities;
using ContactsApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace ContactsApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : Controller
    {
        private readonly ApplicationContext _context;

        public HomeController(ApplicationContext context)
        {
            _context = context;
        }

        [Route("getAllContacts")]
        public IEnumerable<Contact> GetAll()
        {
            var userId = int.Parse(User.Identity.Name);
            var contacts = _context.Contacts.Where(x => !x.Deleted && x.User.Id == userId);

            return contacts;
        }

        [HttpGet("{id}")]
        [Route("getContact")]
        public IActionResult GetById(int id)
        {
            var userId = Convert.ToInt32(User.Identity.Name);
            var item = _context.Contacts.FirstOrDefault(t => t.Id == id && t.User.Id == userId);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }
        [HttpPost]
        [Route("addContact")]
        public IActionResult Create([FromBody] ContactModel item)
        {
            if (item == null)
            {
                return BadRequest();
            }
            item.User = _context.Users.FirstOrDefault(x => x.Id == Convert.ToInt32(User.Identity.Name));
            if(item.User == null)
            {
                return BadRequest();
            }

            _context.Contacts.Add((Contact)item);
            _context.SaveChanges();

            return Ok(new { message = "Contact is added successfully." });
        }

        [HttpPut("{id}")]
        [Route("updateContact")]
        public IActionResult Update(int id, [FromBody] Contact item)
        {
            // set bad request if contact data is not provided in body
            if (item == null || id == 0)
            {
                return BadRequest();
            }

            var contact = _context.Contacts.FirstOrDefault(t => t.Id == id);
            if (contact == null)
            {
                return NotFound();
            }

            contact.Name = item.Name;
            contact.Email = item.Email;
            contact.Gender = item.Gender;
            contact.Birth = item.Birth;
            contact.Message = item.Message;

            _context.Contacts.Update(contact);
            _context.SaveChanges();
            return Ok(new { message = "Contact is updated successfully." });
        }


        [HttpDelete("{id}")]
        [Route("deleteContact")]
        public IActionResult Delete(int id)
        {
            var contact = _context.Contacts.FirstOrDefault(t => t.Id == id);
            if (contact == null)
            {
                return NotFound();
            }

            _context.Contacts.Update(contact);
            contact.Deleted = true;
            _context.SaveChanges();
            return Ok(new { message = "Contact is deleted successfully." });
        }
    }
}