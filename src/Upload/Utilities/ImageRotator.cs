using Microsoft.AspNetCore.Http;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;

namespace Upload.Utilities
{
    public class ImageRotator : IImageRotator
    {
        public byte[] RotateImageToByteArray(IFormFile image)
        {
            return ImageByteArray(DoRotation(image));
        }

        public string RotateImageToBase64(IFormFile image)
        {
            return Base64String(DoRotation(image));
        }

        private Image DoRotation(IFormFile file)
        {
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

            return bitmapImg;
        }

        private byte[] ImageByteArray(Image image)
        {
            using (var memoryStream = new MemoryStream())
            {
                image.Save(memoryStream, ImageFormat.Jpeg);
                return memoryStream.ToArray();
            }
        }

        private string Base64String(Image image)
        {
            using (var memoryStream = new MemoryStream())
            {
                image.Save(memoryStream, ImageFormat.Jpeg);
                return Convert.ToBase64String(memoryStream.ToArray());
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
