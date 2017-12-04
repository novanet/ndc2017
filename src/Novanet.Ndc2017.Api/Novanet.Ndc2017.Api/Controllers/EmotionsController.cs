using System;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace Novanet.Ndc2017.Api.Controllers
{
    [Route("api/[controller]")]
    public class EmotionsController : Controller
    {
        // GET api/values
        [HttpPost]
        public void Post([FromBody]Emotions emotions)
        {

            using (IDbConnection db = new SqlConnection(Environment.GetEnvironmentVariable("ndc2017sql")))
            {
                db.Execute(@"INSERT INTO 
[dbo].[Emotions]([PhotoId],[Anger],[Contempt],[Disgust],[Fear],[Happiness],[Neutral],[Sadness],[Surprise], [Added]) 
VALUES (@photoId, @anger, @contempt, @disgust, @fear, @happiness, @neutral, @sadness, @surprise, GETDATE())",
                    new
                    {
                        emotions.photoId,
                        emotions.anger,
                        emotions.contempt,
                        emotions.disgust,
                        emotions.fear,
                        emotions.happiness,
                        emotions.neutral,
                        emotions.sadness,
                        emotions.surprise
                    });
            }
        }
    }

    public class Emotions
    {
        public string photoId { get; set; }
        public string blobUri { get; set; }
        public string anger { get; set; }
        public string contempt { get; set; }
        public string disgust { get; set; }
        public string fear { get; set; }
        public string happiness { get; set; }
        public string neutral { get; set; }
        public string sadness { get; set; }
        public string surprise { get; set; }
    }
}
