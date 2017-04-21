using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Upload.Controllers
{
    public class LoginModel
    {
        public string Password { get; set; }
    }

    [Route("api/login")]
    [Authorize(ActiveAuthenticationSchemes = "apikey")]
    public class LoginController : Controller
    {
        public IActionResult Post([FromBody]LoginModel model)
        {
            return Ok($"hello: {model.Password}");
        }
    }
}
