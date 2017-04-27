using System;
using System.Drawing;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Drawing.Imaging;
using Upload.Utilities;
using Upload.src.app.Models;

namespace Upload
{
    public class RecognizerApiController : Controller
    {
        private readonly IImageRotator _imageRotator;

        public RecognizerApiController(IImageRotator imageRotator)
        {
            _imageRotator = imageRotator;
        }

        [Route("api/recognizer/image")]
        public IActionResult ProcessImage(IFormFile file)
        {
            var user = new UserViewModel();

            var imageBase64 = _imageRotator.RotateImageToBase64(file);
            user.Base64Image = imageBase64;

            //Do facial recognition   
            //         //var someresponse = someService.checkImage(stream);
            //         //if (someresponse != null)
            //         //{
            //             //user.IsExisting = true;
            //             // user.Name = someresponse.Name;
            //             // user.Email = someresponse.Email;
            //             // user.Company = someresponse.Company;
            //             // user.TwitterHandle = someresponse.TwitterHandle;

            //         //}

            return Ok(user);
        }
    }
}