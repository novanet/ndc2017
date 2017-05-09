SELECT Emotion, [Rank], U.[Name] as [User], Score, P.BlobUri FROM (  
	SELECT 'Anger' AS Emotion, RANK() OVER (ORDER BY Anger DESC) AS [Rank], PhotoId, Anger AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Anger UNION ALL  
	SELECT 'Contempt' AS Emotion, RANK() OVER (ORDER BY Contempt DESC) AS [Rank], PhotoId, Contempt AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Contempt UNION ALL  
	SELECT 'Disgust' AS Emotion, RANK() OVER (ORDER BY Disgust DESC) AS [Rank], PhotoId, Disgust AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Disgust UNION ALL  
	SELECT 'Fear' AS Emotion, RANK() OVER (ORDER BY Fear DESC) AS [Rank], PhotoId, Fear AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Fear UNION ALL  
	SELECT 'Happiness' AS Emotion, RANK() OVER (ORDER BY Happiness DESC) AS [Rank], PhotoId, Happiness AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Happiness UNION ALL  
	SELECT 'Neutral' AS Emotion, RANK() OVER (ORDER BY Neutral DESC) AS [Rank], PhotoId, Neutral AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Neutral UNION ALL  
	SELECT 'Sadness' AS Emotion, RANK() OVER (ORDER BY Sadness DESC) AS [Rank], PhotoId, Sadness AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Sadness UNION ALL  
	SELECT 'Surprise' AS Emotion, RANK() OVER (ORDER BY Surprise DESC) AS [Rank], PhotoId, Surprise AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Surprise  
) A  
INNER JOIN dbo.[Photo] P ON P.Id = A.PhotoId  
INNER JOIN dbo.[User] U ON U.Id = P.UserId  
WHERE [Rank] <= 5  
AND LEN(P.BlobUri) > 1  
ORDER BY Emotion, [Rank], U.[Name]