using Microsoft.AspNetCore.Http;
using System.Drawing;
using System.IO;

namespace Upload.Utilities
{
    public interface IImageRotator
    {
        byte[] RotateImageToByteArray(IFormFile image);
        string RotateImageToBase64(IFormFile image);
    }
}
