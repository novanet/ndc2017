using Dapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Novanet.Ndc2017.Api.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        // GET api/values
        [HttpGet]
        [Route("{userId}")]
        public IEnumerable<dynamic> Get(string userId)
        {
            using (IDbConnection db = new SqlConnection(Environment.GetEnvironmentVariable("ndc2017sql")))
            {
                return db.Query<dynamic>(@"SELECT * FROM (  
	                                        SELECT  U.Id AS UserId, 
			                                        U.NAME AS UserName,  
                                                    E.Anger, 
                                                    E.Disgust, 
                                                    E.Fear, 
                                                    E.Sadness, 
                                                    E.Surprise,  
				                                        (SELECT TOP 1 x 
				                                         FROM (VALUES 
					                                        ('Anger', Anger), 
					                                        ('Disgust', Disgust), 
					                                        ('Fear', Fear), 
					                                        ('Sadness', Sadness), 
					                                        ('Surprise', Surprise)) AS value(x,y) 
				                                        ORDER BY y DESC) as [HighestScore], 
                                                    RANK() OVER (ORDER BY Anger DESC) AS [RankAnger],  
                                                    RANK() OVER (ORDER BY Disgust DESC) AS [RankDisgust],  
                                                    RANK() OVER (ORDER BY Fear DESC) AS [RankFear],  
                                                    RANK() OVER (ORDER BY Sadness DESC) AS [RankSadness],  
                                                    RANK() OVER (ORDER BY Surprise DESC) AS [RankSurprise],  
                                                    P.Id AS PhotoId,  
                                                    P.BlobUri  
		                                        FROM dbo.[Emotions] E  
		                                        INNER JOIN dbo.[Photo] P ON P.Id = E.PhotoId   
		                                        INNER JOIN dbo.[User] U ON U.Id = P.UserId  
		                                        AND LEN(P.BlobUri) > 1   
	                                        ) P  
                                        WHERE P.UserId = @userId",
                                        new
                                        {
                                            userId
                                        });
            }
        }
    }
}
