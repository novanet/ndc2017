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

            //var image = _imageRotator.RotateImage(file);
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

        private byte[] ImageToByteArray(Image imageIn)
        {
            using (var memoryStream = new MemoryStream())
            {
                imageIn.Save(memoryStream, ImageFormat.Jpeg);
                return memoryStream.ToArray();
            }
        }

        public static RotateFlipType GetRotateFlipTypeByExifOrientationData(int orientation)
        {
            switch (orientation)
            {
                case 1:
                default:
                    return RotateFlipType.RotateNoneFlipNone;
                case 2:
                    return RotateFlipType.RotateNoneFlipX;
                case 3:
                    return RotateFlipType.Rotate180FlipNone;
                case 4:
                    return RotateFlipType.Rotate180FlipX;
                case 5:
                    return RotateFlipType.Rotate90FlipX;
                case 6:
                    return RotateFlipType.Rotate90FlipNone;
                case 7:
                    return RotateFlipType.Rotate270FlipX;
                case 8:
                    return RotateFlipType.Rotate270FlipNone;
            }
        }

    }
}