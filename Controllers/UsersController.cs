using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ContactsApp.Services;
using ContactsApp.Entities;
using ContactsApp.Models;
using ContactsApp.Data;

namespace ContactsApp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private IUserService _userService;
        private readonly ApplicationContext _context;

        public UsersController(IUserService userService, ApplicationContext context)
        {
            _userService = userService;
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]AuthenticateModel model)
        {
            var user = _userService.Authenticate(model.Username, model.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

            return Ok(user);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody]RegisterModel model)
        {
            var user = _userService.Register(model);

            if (user == null)
                return BadRequest(new { message = "Username  is already taken" });

            return Ok(user);
        }

        [Authorize(Roles = Role.Admin)]
        [HttpGet]
        [Route("getAllUsers")]
        public IActionResult GetAll()
        {
            var users =  _userService.GetAll();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var currentUserId = int.Parse(User.Identity.Name);
            if (id != currentUserId && !User.IsInRole(Role.Admin))
                return Forbid();

            var user =  _userService.GetById(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPut]
        [Authorize(Roles = Role.Admin)]
        [Route("updateUser")]
        public IActionResult Update([FromBody] User item)
        {
            if (item == null)
            {
                return BadRequest();
            }

            var user = _userService.GetById(item.Id);
            if (user == null)
            {
                return NotFound();
            }

            user.Id = item.Id;
            user.Username = item.Username;
            user.Firstname = item.Firstname;
            user.Lastname = item.Lastname;
            user.Middlename = item.Middlename;
            user.Role = item.Role;

            _context.Users.Update(user);
            _context.SaveChanges();
            return Ok(new { message = "User is updated successfully." });
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = Role.Admin)]
        [Route("deleteUser")]
        public IActionResult Delete([FromQuery]int id)
        {
            var user = _userService.GetById(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            _context.SaveChanges();
            return Ok(new { message = "User is deleted successfully." });
        }
    }
}
