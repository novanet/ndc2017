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

                var photoId = await StoreToBlob(file);
                user.Photos.Add(new Photo { Id = photoId, UserId = userId });
                await db.SaveChangesAsync();

                return CreatedAtRoute("PhotoLink", new { photoId }, photoId);
            }
        }

        private async Task<Guid> StoreToBlob(IFormFile file)
        {
            var storageAccount = CloudStorageAccount.Parse(
                Environment.GetEnvironmentVariable("CUSTOMCONNSTR_EmoStorage")
            );

            var blobClient = storageAccount.CreateCloudBlobClient();

            var container = blobClient.GetContainerReference("incomingphotos");

            var photoId = Guid.NewGuid();
            var blockBlob = container.GetBlockBlobReference(photoId.ToString());
            await blockBlob.UploadFromStreamAsync(file.OpenReadStream());

            return photoId;
        }

        [HttpGet("{PhotoId}", Name = "PhotoLink")]
        public IActionResult Get(Guid photoId)
        {
            
            return Ok();
        }
    }
}
