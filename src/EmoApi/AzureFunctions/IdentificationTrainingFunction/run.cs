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

namespace Novanet {
    public class IdentificationTraining {

        private const string PersonGroupId = "NovanetNdcStandGroupA";

        public static async Task Run(Stream myBlob, string name, TraceWriter log)
        {
            log.Info($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");

            var imageUri = Environment.GetEnvironmentVariable("storageAccountContainerUri", EnvironmentVariableTarget.Process) + "/" + name;          
            var faceApiKey = Environment.GetEnvironmentVariable("faceApiKey", EnvironmentVariableTarget.Process);
            var faceServiceClient = new FaceServiceClient(faceApiKey);

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
            var user = await GetUserFromBlobName(name);
            var personId = await faceServiceClient.CreateUserAsPersonIfNotExising(PersonGroupId, user);

            // Add face to person
            try
            {
                // Using imageUri as user data, so we can display images later if needed
                await faceServiceClient.AddPersonFaceAsync(PersonGroupId, personId, imageUri, imageUri);
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

        private static async Task<User> GetUserFromBlobName(string name)
        {
            var baseUrl = Environment.GetEnvironmentVariable("userApiBaseUrl", EnvironmentVariableTarget.Process);
            var apiKey = Environment.GetEnvironmentVariable("userApiKey", EnvironmentVariableTarget.Process);

            if (string.IsNullOrEmpty(baseUrl) || string.IsNullOrEmpty(apiKey))
            {
                throw new ConfigurationErrorsException("Missing userApiBaseUrl or userApiKey in environment variables.");
            }

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(baseUrl);
                client.DefaultRequestHeaders.Authorization = AuthenticationHeaderValue.Parse(apiKey);
                var response = await client.GetAsync($"/api/user/byphotoid/{name}");

                if (response.IsSuccessStatusCode)
                {
                    return await response.Content.ReadAsAsync<User>();
                }
            }
            return null;
        }
    }
}