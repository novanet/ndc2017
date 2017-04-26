using System;
using System.Drawing;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Drawing.Imaging;

namespace Upload
{
    public class RecognizerApiController : Controller
    {
        [Route("api/recognizer/image")]
        public IActionResult ProcessImage(IFormFile file)
        {
            var contestantData = new Contestant();

            var reader = new BinaryReader(file.OpenReadStream());
            var bytes = reader.ReadBytes((int)file.Length);

            var bitmapImg = (Image)new Bitmap(file.OpenReadStream());
            var containsOrientationId = bitmapImg.PropertyIdList.Contains(0x0112);

            if (containsOrientationId)
            {
                var item = bitmapImg.GetPropertyItem(0x0112);
                var rotation = GetRotateFlipTypeByExifOrientationData(item.Value[0]);
                bitmapImg.RotateFlip(rotation);
                bitmapImg.RemovePropertyItem(0x0112);
            }

            var byteArray = ImageToByteArray(bitmapImg);
            var imageBase64 = Convert.ToBase64String(byteArray);
            contestantData.Base64Image = imageBase64;

            //Do facial recognition   
            //         //var someresponse = someService.checkImage(stream);
            //         //if (someresponse != null)
            //         //{
            //             //contestantData.IsExisting = true;
            //             // existingContestantData.Name = someresponse.Name;
            //             // existingContestantData.Email = someresponse.Email;

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