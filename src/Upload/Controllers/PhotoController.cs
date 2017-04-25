using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.WindowsAzure.Storage;
using System;
using System.Threading.Tasks;
using Upload.database;

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

            using (var db = new NdcContext())
            {
                var user = await db
                                .User
                                .Include(u => u.Photos)
                                .FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                    return NotFound("User not in database");

                var (photoId, blobUri) = await StoreToBlob(file);
                user.Photos.Add(new Photo { Id = photoId, UserId = userId, BlobUri = blobUri });
                await db.SaveChangesAsync();

                return CreatedAtRoute("PhotoLink", new { photoId }, photoId);
            }
        }

        private async Task<(Guid photoId, string blobUri)> StoreToBlob(IFormFile file)
        {
            var storageAccount = CloudStorageAccount.Parse(
                Environment.GetEnvironmentVariable("CUSTOMCONNSTR_EmoStorage")
            );
            
            var blobClient = storageAccount.CreateCloudBlobClient();

            var container = blobClient.GetContainerReference("incomingphotos");

            var photoId = Guid.NewGuid();
            var ext = file.Name.EndsWith(".png") ? "png" : "jpg";
            var fileName = $"{photoId.ToString()}.{ext}";
            var blockBlob = container.GetBlockBlobReference(fileName);
            await blockBlob.UploadFromStreamAsync(file.OpenReadStream());

            return (photoId, $"{storageAccount.BlobEndpoint}/incomingphotos/{fileName}");
        }

        [HttpGet("{PhotoId}", Name = "PhotoLink")]
        public IActionResult Get(Guid photoId)
        {
            
            return Ok();
        }
    }
}
