using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Upload.Utilities;
using Upload.src.app.Models;
using Upload.database;
using Microsoft.ProjectOxford.Face;
using Microsoft.ProjectOxford.Face.Contract;
using System.Threading.Tasks;
using System.IO;

namespace Upload.Controllers
{
    [Route("api/recognizer")]
    public class RecognizerApiController : Controller
    {
        private const string PersonGroupId = "961f1e88-3847-40f4-b06b-9e05f8b87877";

        private readonly IImageRotator _imageRotator;
        private readonly string FaceApiKey;
        
        public RecognizerApiController(IImageRotator imageRotator)
        {
            _imageRotator = imageRotator;
            FaceApiKey = Environment.GetEnvironmentVariable("FaceApiKey");
        }


        [HttpPost("image")]
        public async Task<IActionResult> ProcessImage(IFormFile file)
        {
            // Read file to bytes for use with Face API.
            var reader = new BinaryReader(file.OpenReadStream(), System.Text.Encoding.UTF8, true);
            var bytes = reader.ReadBytes((int)file.Length);

            var result = new UserViewModel();
            result.IsExisting = false;
            result.Base64Image = _imageRotator.RotateImageToBase64(file);
            return Ok(result);

            // Detect faces
            var faceServiceClient = new FaceServiceClient(FaceApiKey, "https://westeurope.api.cognitive.microsoft.com/face/v1.0");

            Face[] faces = null;
            try
            {
                using (var memoryStream = new MemoryStream(bytes))
                {
                    faces = await faceServiceClient.DetectAsync(memoryStream);
                }
            }
            catch (FaceAPIException e)
            {
                if(e.ErrorCode == "InvalidImageSize")
                {
                    return BadRequest(e.ErrorMessage);
                }
                var tmp = e;
                result.Message = "Unknown error";
                return NotFound(result);
            }

            // Evaluate faces
            if (faces?.Any() ?? false)
            {
                var face = faces[0];

                // Identify person
                try
                {
                    var faceIdentifications = await faceServiceClient.IdentifyAsync(PersonGroupId, new Guid[] { face.FaceId });

                    var personId = faceIdentifications?
                        .FirstOrDefault()?
                        .Candidates?
                        .FirstOrDefault()?
                        .PersonId;

                    if(personId == null)
                    {
                        result.Message = "Did not find person";
                        return Ok(result);
                    }

                    var person = await faceServiceClient.GetPersonAsync(PersonGroupId, personId.Value);
                    var userId = person.UserData;
                    
                    // Load user
                    using (var db = new NdcContext())
                    {
                        var user = db.User.Find(userId);
                        if(user == null)
                        {
                            result.Message = "did not find user " + userId;
                            return NotFound(result);
                        }

                        result.Company = user.Company;
                        result.Name = user.Name;
                        result.Email = user.Email;
                        result.Id = user.Id;
                        result.IsExisting = true;
                        result.TwitterHandle = user.TwitterHandle;
                        
                        return Ok(result);
                    }                    
                }
                catch (FaceAPIException)
                {
                    result.Message = "faceapi exception";
                    return NotFound(result.Message);
                }
            }

            return BadRequest("No face found in the image");
        }
    }
}