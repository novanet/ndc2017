using Microsoft.AspNetCore.Http;
using System.Drawing;
using System.IO;

namespace Upload.Utilities
{
    public interface IImageRotator
    {
        MemoryStream RotateImage(IFormFile image);
        string RotateImageToBase64(IFormFile image);
    }
}
