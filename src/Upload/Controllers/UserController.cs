using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
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

            using (var db = new NdcContext())
            {
                if (string.IsNullOrEmpty(user.Name) || string.IsNullOrEmpty(user.Email))
                    return BadRequest("MissingFields");

                var existingUser = db.User
                    .FirstOrDefault(u => u.Name == user.Name || u.Email == user.Email);
                if (existingUser != null)
                {
                    if ((!string.IsNullOrEmpty(user.Name) && existingUser.Name.ToLower() != user.Name.ToLower())
                       || (!string.IsNullOrEmpty(user.Email) && existingUser.Email.ToLower() != user.Email.ToLower()))
                    {
                        return BadRequest("NameOrEmailMismatch");
                    }
                    return Ok(existingUser.Id);
                }

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

        [HttpGet("ByPhotoId/{photoId}")]
        public IActionResult ByPhotoId(Guid photoId)
        {

            using (var db = new NdcContext())
            {
                var result = db.User
                    .Include(u => u.Photos)
                    .Where(u => u.Photos.Any(p => p.Id == photoId))
                    .SingleOrDefault();
                if (result == null)
                    return NotFound();

                return Ok(result);
            }
        }


    }
}
