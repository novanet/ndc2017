using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
