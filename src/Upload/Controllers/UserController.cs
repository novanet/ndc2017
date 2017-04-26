using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Upload.database;

namespace Upload.Controllers
{
    [Route("api/user")]
    [Authorize(ActiveAuthenticationSchemes = "apikey")]
    public class UserController : Controller
    {
        [HttpPost("")]
        public async Task<IActionResult> Post([FromBody]User user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (string.IsNullOrEmpty(user.Name) || string.IsNullOrEmpty(user.Email))
                return BadRequest("Both Name and Email is required");

            using (var db = new NdcContext())
            {
                var existingUser = db.User
                    .Any(u => u.Name == user.Name || u.Email == user.Email);
                if (existingUser)
                    return BadRequest("User with Name or Email exist");
                db.User.Add(user);
                var id = await db.SaveChangesAsync();
                return CreatedAtRoute("UserLink", new { id = user.Id }, user.Id);
            }
        }

        [HttpGet("{id}", Name = "UserLink")]
        public IActionResult Id(int id)
        {
            using (var db = new NdcContext())
            {
                var result = db.User
                    .Find(id);
                return Ok(result);
            }
        }

        [HttpGet("ByName/{name}")]
        public IActionResult ByName(string name)
        {
            using (var db = new NdcContext())
            {
                var result = db.User
                    .Where(u => u.Name.StartsWith(name))
                    .ToList();
                return Ok(result);
            }
        }

        [HttpGet("ByEmail/{email}")]
        public IActionResult ByEmail(string email)
        {
            using (var db = new NdcContext())
            {
                var result = db.User
                    .Where(u => u.Email.StartsWith(email))
                    .ToList();
                return Ok(result);
            }
        }

        [HttpGet("ByCompany/{company}")]
        public IActionResult ByCompany(string company)
        {
            using (var db = new NdcContext())
            {
                var result = db.User
                    .Where(u => u.Company.StartsWith(company))
                    .ToList();
                return Ok(result);
            }
        }

    }
}
