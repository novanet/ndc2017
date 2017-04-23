using Newtonsoft.Json;
using Microsoft.ProjectOxford.Emotion;
using Microsoft.Azure.WebJobs.Host;
using System.IO;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Net.Http;
using System.Text;

namespace Novanet {
    public class Emotion {
        public static async Task Run(Stream myBlob, string name, TraceWriter log)
        {
            log.Info($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");

            var emotionsApiKey = Environment.GetEnvironmentVariable("emotionApiKey", EnvironmentVariableTarget.Process);
            var emotionClient = new EmotionServiceClient(emotionsApiKey);
            var emotions = await emotionClient.RecognizeAsync(myBlob);

            var blobUri = Environment.GetEnvironmentVariable("storageAccountContainerUri", EnvironmentVariableTarget.Process) + "/" + name;
            
            var firstEmotion = emotions.FirstOrDefault();

            var emotionOutput = new
            {
                photoId = name,
                blobUri = blobUri,
                anger = firstEmotion.Scores?.Anger ?? 0,
                contempt = firstEmotion.Scores?.Contempt ?? 0,
                disgust = firstEmotion.Scores?.Disgust ?? 0,
                fear = firstEmotion.Scores?.Fear ?? 0,
                happiness = firstEmotion.Scores?.Happiness ?? 0,
                neutral = firstEmotion.Scores?.Neutral ?? 0,
                sadness = firstEmotion.Scores?.Sadness ?? 0,
                surprise = firstEmotion.Scores?.Surprise ?? 0,
            };

            var converted = JsonConvert.SerializeObject(emotionOutput);
            log.Info(converted);

            var highscoreApiUri = Environment.GetEnvironmentVariable("highscoreApiPostEmotionsUri", EnvironmentVariableTarget.Process);
            var result = await PostResult(highscoreApiUri, emotionOutput);
            log.Info(result);
        }

        private static async Task<string> PostResult(string uri, dynamic contents)
        {
            using (var client = new HttpClient())
            {
                var json = JsonConvert.SerializeObject(contents);
                var requestData = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync(uri, requestData);
                var result = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                    throw new Exception($"Sending emotion api result to {uri} failed with httpstatusCode = {response.StatusCode}, reasonPhrase = {response.ReasonPhrase} and content = {result}. Request body was: {json}");

                return result;
            }
        }
    }
}