using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage;
using System;
using System.Threading.Tasks;

namespace Upload.Controllers
{
    [Route("api/photo")]
    [Authorize(ActiveAuthenticationSchemes = "apikey")]
    public class PhotoController : Controller
    {
        [HttpPost("{userId}")]
        public async Task<IActionResult> Post(int userId, IFormFile file)
        {

            if (file == null)
            {
                return BadRequest("Action accepts only requests containing a single file");
            }

            var storageAccount = CloudStorageAccount.Parse(
                Environment.GetEnvironmentVariable("CUSTOMCONNSTR_EmoStorage")                
            );

            var blobClient = storageAccount.CreateCloudBlobClient();

            var container = blobClient.GetContainerReference("incomingphotos");

            var photoId = Guid.NewGuid();
            var blockBlob = container.GetBlockBlobReference(photoId.ToString());
            await blockBlob.UploadFromStreamAsync(file.OpenReadStream());

            return CreatedAtRoute("PhotoLink", new { photoId }, photoId);
        }

        [HttpGet("{PhotoId}", Name = "PhotoLink")]
        public async Task<IActionResult> Get(Guid photoId)
        {
            
            return Ok();
        }
    }
}
