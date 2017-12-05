using Newtonsoft.Json;
using Microsoft.ProjectOxford.Face;
using Microsoft.Azure.WebJobs.Host;
using System.IO;
using System;
using System.Configuration;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
using System.Globalization;
using System.Net.Http.Headers;
using Microsoft.WindowsAzure.Storage.Blob;

namespace Novanet {
    public class IdentificationTraining {

        private const string PersonGroupId = "961f1e88-3847-40f4-b06b-9e05f8b87877";

        public static async Task Run(CloudBlockBlob imageBlob, string name, TraceWriter log)
        {
            var imageUri = imageBlob.Uri.ToString();
            var faceApiKey = Environment.GetEnvironmentVariable("faceApiKey", EnvironmentVariableTarget.Process);
            var faceServiceClient = new FaceServiceClient(faceApiKey, "https://westeurope.api.cognitive.microsoft.com/face/v1.0");

            try
            {
                // Detect face, or return
                var detectedFaces = await faceServiceClient.DetectAsync(imageUri);
                if (detectedFaces.Length == 0)
                {
                    log.Warning("No face detected...");
                    return;
                }

                // Prepare person group
                await faceServiceClient.CreatePersonGroupIfNotExising(PersonGroupId, "NovanetNDC2017");
                await faceServiceClient.WaitForPersonGroupStatusNotRunning(PersonGroupId, log);

                // Add user as new person to group, or return existing
                var user = await GetUserFromBlobName(imageBlob);
                if (user == null)
                {
                    log.Warning($"User not found for blob name {name}...");
                    return;
                }

                var personId = await faceServiceClient.CreateUserAsPersonIfNotExising(PersonGroupId, user);

                // Add face to person
                try
                {
                    // Using imageUri as user data, so we can display images later if needed
                    await faceServiceClient.AddPersonFaceAsync(PersonGroupId, personId, imageUri, imageUri);
                    log.Info($"Added new face to person with userId {user.Id} and name {user.Name}");
                }
                catch (FaceAPIException)
                {
                    // No face found, not a real person!
                    log.Warning("No face found in image. WHYYYY! THAT WAS THE FIRST THING WE CHECKED!!! OMG.");
                }

                // Train the person group
                await faceServiceClient.TrainPersonGroupAsync(PersonGroupId);
                var trainingStatus = await faceServiceClient.GetPersonGroupTrainingStatusAsync(PersonGroupId);
                log.Info($"Started training. Status: {trainingStatus.Status}");
            }
            catch (FaceAPIException tooUglyException)
            {
                log.Error($"Face API: {tooUglyException.ErrorMessage}");
                if (tooUglyException.InnerException != null)
                {
                    log.Error($"Face API: {tooUglyException.InnerException.Message}");
                }
            }
        }

        private static async Task<User> GetUserFromBlobName(CloudBlockBlob imageBlob)
        {
            var baseUrl = Environment.GetEnvironmentVariable("userApiBaseUrl", EnvironmentVariableTarget.Process);
            var apiKey = Environment.GetEnvironmentVariable("userApiKey", EnvironmentVariableTarget.Process);

            if (string.IsNullOrEmpty(baseUrl) || string.IsNullOrEmpty(apiKey))
            {
                throw new Exception("Missing userApiBaseUrl or userApiKey in environment variables.");
            }

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseUrl);
                client.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(apiKey);
                var guid = imageBlob.Name.Split('.')[0];
                var response = await client.GetAsync($"/api/user/byphotoid/{guid}");

                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsAsync<User>();
                }
            }
            return null;
        }
    }
}