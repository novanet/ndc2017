using Microsoft.AspNetCore.Mvc;

namespace Upload.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            ViewData["Title"] = "Upload";
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
