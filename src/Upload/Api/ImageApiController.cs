using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Upload
{
    public class ImageApiController : Controller
    {
        [Route("api/image/processimage")]
        public IActionResult ProcessImage(IFormFile file)
        {

            var files = new List<IFormFile>();
            files.Add(file);
            long size = files.Sum(f => f.Length);

            var filePath = Path.GetTempFileName();

            var fileBase64 = "";

            foreach (var fil in files)
            {
                if (fil.Length > 0)
                {
                    using (var stream = fil.OpenReadStream())
                    {
                        
                        using (var reader = new BinaryReader(stream))
                        {
                            var fileContent = reader.ReadBytes((int)fil.Length);

                            fileBase64 = Convert.ToBase64String(fileContent);
                        }
                        //await fil.CopyToAsync(stream);
                       
                    }
                }
            }

            return Ok(new { image = fileBase64 });
        }
    }
}