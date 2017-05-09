SELECT TOP 1 E.*, 
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
	 P.BlobUri, 
	 U.[Name] 
FROM dbo.[Emotions] E   		
INNER JOIN dbo.[Photo] P ON P.Id = E.PhotoId  
INNER JOIN dbo.[User] U ON U.Id = P.UserId              
WHERE LEN(P.BlobUri) > 1  
ORDER BY E.Added DESC   