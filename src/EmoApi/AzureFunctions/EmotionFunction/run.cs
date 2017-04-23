using Newtonsoft.Json;
using Microsoft.ProjectOxford.Emotion;
using Microsoft.Azure.WebJobs.Host;
using System.IO;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace Novanet {
    public class Emotion {
        public static async Task<object> Run(Stream myBlob, string name, TraceWriter log)
        {
            log.Info($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myBlob.Length} Bytes");

            //Do emotions stuff here
            var emotionsApiKey = Environment.GetEnvironmentVariable("emotionApiKey", EnvironmentVariableTarget.Process);
            var emotionClient = new EmotionServiceClient(emotionsApiKey);
            var emotions = await emotionClient.RecognizeAsync(myBlob);

            var blobUri = Environment.GetEnvironmentVariable("storageAccountContainerUri", EnvironmentVariableTarget.Process) + "/" + name;

            var emotionList = emotions.Select(e => new
            {
                e.Scores.Anger,
                e.Scores.Contempt,
                e.Scores.Disgust,
                e.Scores.Fear,
                e.Scores.Happiness,
                e.Scores.Neutral,
                e.Scores.Sadness,
                e.Scores.Surprise,
                e.FaceRectangle
            }).ToList();

            var outputDocument = new
            {
                id = name,
                FileName = name,
                BlobUri = blobUri,
                Emotions = emotionList
            };

            var converted = JsonConvert.SerializeObject(outputDocument);
            log.Info(converted);
            return converted;
        }
    }
}