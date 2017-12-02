using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Mvc;

namespace Novanet.Ndc2017.Api.Controllers
{
    [Route("api/[controller]")]
    public class HighscoreController : Controller
    {
        // GET api/values
        [HttpGet]
        public IEnumerable<dynamic> Get()
        {
            using (IDbConnection db = new SqlConnection("Server=tcp:ndc.database.windows.net,1433;Initial Catalog=ndc2017;Persist Security Info=False;User ID=ndc;Password=w8ing4dooM!!!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"))
            {
                return db.Query<dynamic>(@"SELECT Emotion, [Rank], U.[Name] as [User], Score, P.BlobUri FROM (  
	                                            SELECT 'Anger' AS Emotion, RANK() OVER (ORDER BY Anger DESC) AS [Rank], PhotoId, Anger AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Anger UNION ALL 
	                                            SELECT 'Disgust' AS Emotion, RANK() OVER (ORDER BY Disgust DESC) AS [Rank], PhotoId, Disgust AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Disgust UNION ALL 
	                                            SELECT 'Fear' AS Emotion, RANK() OVER (ORDER BY Fear DESC) AS [Rank], PhotoId, Fear AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Fear UNION ALL 
	                                            SELECT 'Sadness' AS Emotion, RANK() OVER (ORDER BY Sadness DESC) AS [Rank], PhotoId, Sadness AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Sadness UNION ALL 
	                                            SELECT 'Surprise' AS Emotion, RANK() OVER (ORDER BY Surprise DESC) AS [Rank], PhotoId, Surprise AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Surprise
                                            ) A  
                                            INNER JOIN dbo.[Photo] P ON P.Id = A.PhotoId  
                                            INNER JOIN dbo.[User] U ON U.Id = P.UserId  
                                            WHERE [Rank] <= 5  
                                            AND LEN(P.BlobUri) > 1  
                                            ORDER BY Emotion, [Rank], U.[Name]");
            }
        }
    }
}
