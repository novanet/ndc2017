SELECT TOP 1
	P.BlobUri, 
	U.[Name],
	E.Anger as 'AngerScore', 	
	E.Disgust as 'DisgustScore', 
	E.Fear as 'FearScore', 		
	E.Sadness as 'SadnessScore', 
	E.Surprise as 'SurpriseScore',  
	RANK() OVER (ORDER BY Anger DESC) AS [RankAnger], 
    RANK() OVER (ORDER BY Disgust DESC) AS [RankDisgust], 
    RANK() OVER (ORDER BY Fear DESC) AS [RankFear],     
    RANK() OVER (ORDER BY Sadness DESC) AS [RankSadness], 
    RANK() OVER (ORDER BY Surprise DESC) AS [RankSurprise], 
	(SELECT TOP 1 x 
		 FROM (VALUES 
			('Anger', Anger), 		
			('Disgust', Disgust), 
			('Fear', Fear), 	
			('Sadness', Sadness), 
			('Surprise', Surprise)) AS value(x,y)
		 ORDER BY y DESC) as [HighestScore]
FROM dbo.[Emotions] E 
INNER JOIN dbo.[Photo] P ON P.Id = E.PhotoId 
INNER JOIN dbo.[User] U ON U.Id = P.UserId 
WHERE LEN(P.BlobUri) > 1  
ORDER BY E.Added DESC  