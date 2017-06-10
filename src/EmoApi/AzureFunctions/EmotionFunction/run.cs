using Newtonsoft.Json;
using Microsoft.ProjectOxford.Emotion;
using Microsoft.Azure.WebJobs.Host;
using System.IO;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Globalization;

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
                anger = ConvertEmotion(firstEmotion.Scores?.Anger),
                contempt = ConvertEmotion(firstEmotion.Scores?.Contempt),
                disgust = ConvertEmotion(firstEmotion.Scores?.Disgust),
                fear = ConvertEmotion(firstEmotion.Scores?.Fear),
                happiness = ConvertEmotion(firstEmotion.Scores?.Happiness),
                neutral = ConvertEmotion(firstEmotion.Scores?.Neutral),
                sadness = ConvertEmotion(firstEmotion.Scores?.Sadness),
                surprise = ConvertEmotion(firstEmotion.Scores?.Surprise),
            };
            
            var highscoreApiUri = Environment.GetEnvironmentVariable("highscoreApiPostEmotionsUri", EnvironmentVariableTarget.Process);
            var result = await PostResult(highscoreApiUri, emotionOutput, log);
            log.Info(result);
        }

        private static string ConvertEmotion(float? emotion)
        {
            if (emotion == null)
                return "0";
            
            return emotion.Value.ToString("0.######");
        }

        private static async Task<string> PostResult(string uri, dynamic contents, TraceWriter log)
        {
            using (var client = new HttpClient())
            {
                var json = JsonConvert.SerializeObject(contents);
                log.Info(json);
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