SELECT TOP 1 E.*, 
	 P.BlobUri, 
	 U.[Name],
	(SELECT TOP 1 x 
	 FROM (VALUES 
		('Anger', Anger), 
		('Contempt', Contempt), 
		('Disgust', Disgust), 
		('Fear', Fear), 
		('Happiness', Happiness), 
		('Neutral', Neutral), 
		('Sadness', Sadness), 
		('Surprise', Surprise)) AS value(x,y)
	 ORDER BY y DESC) as [HighestScore], 
	RANK() OVER (ORDER BY Anger DESC) AS [RankAnger],  
    RANK() OVER (ORDER BY Contempt DESC) AS [RankContempt],  
    RANK() OVER (ORDER BY Disgust DESC) AS [RankDisgust],  
    RANK() OVER (ORDER BY Happiness DESC) AS [RankHappiness],  
    RANK() OVER (ORDER BY Neutral DESC) AS [RankNeutral],  
    RANK() OVER (ORDER BY Sadness DESC) AS [RankSadness],  
    RANK() OVER (ORDER BY Surprise DESC) AS [RankSurprise] 
FROM dbo.[Emotions] E   		
INNER JOIN dbo.[Photo] P ON P.Id = E.PhotoId  
INNER JOIN dbo.[User] U ON U.Id = P.UserId              
WHERE LEN(P.BlobUri) > 1  
ORDER BY E.Added DESC  