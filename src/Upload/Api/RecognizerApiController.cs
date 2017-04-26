using System;
using System.Drawing;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Drawing.Imaging;
using Upload.Utilities;

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
            var contestantData = new Contestant();

            var imageBase64 = _imageRotator.RotateImageToBase64(file);
            contestantData.Base64Image = imageBase64;

            //Do facial recognition   
            //         //var someresponse = someService.checkImage(stream);
            //         //if (someresponse != null)
            //         //{
            //             //contestantData.IsExisting = true;
            //             // existingContestantData.Name = someresponse.Name;
            //             // existingContestantData.Email = someresponse.Email;
            //             // existingContestantData.Company = someresponse.Company;
            //             // existingContestantData.TwitterHandle = someresponse.TwitterHandle;

            //         //}

            return Ok(contestantData);
        }
    }
}