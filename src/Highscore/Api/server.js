// BASE SETUP
// =============================================================================
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// AZURE SQL DATABASE CONNECTION USING SERIATE
// ===================================================================================
var sql = require( "seriate" );
var config = {  
    "server": process.env.server,
	"port": 1433,
    "user": process.env.user,
    "password": process.env.password,
    "database": process.env.database,
    "pool": { "max": 5, "min": 1 },
	"options": { "encrypt": true }
};
sql.setDefaultConfig( config );

// CONFIG
// ===================================================================================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    if ('OPTIONS' == req.method){
        return res.send(200);
    }
    next();
});
app.use(function (req, res, next) {
	res.header('Content-Type', 'application/json; charset=utf-8');
	next();
});

// set the port
var port = process.env.PORT || 3000; 

// ROUTES FOR THE API
// ===================================================================================
var router = express.Router();
	
router.get('/highscore', function (req, res) {
	sql.execute({  
        query: 
			'SELECT Emotion, [Rank], U.[Name] as \'User\', Score  FROM ( ' +
				'SELECT \'Anger\' AS Emotion, RANK() OVER (ORDER BY Anger DESC) AS [Rank], [UserId], Anger AS Score FROM dbo.[Emotions] GROUP BY UserId, ImageId, Anger UNION ALL ' +
				'SELECT \'Contempt\' AS Emotion, RANK() OVER (ORDER BY Contempt DESC) AS [Rank], [UserId], Contempt AS Score FROM dbo.[Emotions] GROUP BY UserId, ImageId, Contempt UNION ALL ' +
				'SELECT \'Disgust\' AS Emotion, RANK() OVER (ORDER BY Disgust DESC) AS [Rank], [UserId], Disgust AS Score FROM dbo.[Emotions] GROUP BY UserId, ImageId, Disgust UNION ALL ' +
				'SELECT \'Fear\' AS Emotion, RANK() OVER (ORDER BY Fear DESC) AS [Rank], [UserId], Fear AS Score FROM dbo.[Emotions] GROUP BY UserId, ImageId, Fear UNION ALL ' +
				'SELECT \'Happiness\' AS Emotion, RANK() OVER (ORDER BY Happiness DESC) AS [Rank], [UserId], Happiness AS Score FROM dbo.[Emotions] GROUP BY UserId, ImageId, Happiness UNION ALL ' +
				'SELECT \'Neutral\' AS Emotion, RANK() OVER (ORDER BY Neutral DESC) AS [Rank], [UserId], Neutral AS Score FROM dbo.[Emotions] GROUP BY UserId, ImageId, Neutral UNION ALL ' +
				'SELECT \'Sadness\' AS Emotion, RANK() OVER (ORDER BY Sadness DESC) AS [Rank], [UserId], Sadness AS Score FROM dbo.[Emotions] GROUP BY UserId, ImageId, Sadness UNION ALL ' +
				'SELECT \'Surprise\' AS Emotion, RANK() OVER (ORDER BY Surprise DESC) AS [Rank], [UserId], Surprise AS Score FROM dbo.[Emotions] GROUP BY UserId, ImageId, Surprise' +				
			') A ' +
			'INNER JOIN dbo.[User] U ON U.Id = UserId ' +
			'WHERE [Rank] <= 3 ' +
			'ORDER BY Emotion, [Rank], U.[Name] '		
    }).then( function( results ) {
        res.send(results);
    }).catch(function(error){
		res.json(error);
		throw error;
	});	
});
router.route('/emotions')
	.post(function(req, res){
        // Add emotions			

        sql.execute({  
            query: 	'INSERT INTO [dbo].[Emotions]([UserId],[ImageId],[Anger],[Contempt],[Disgust],[Fear],[Happiness],[Neutral],[Sadness],[Surprise], [Added]) ' + 
					'VALUES (@userId, @imageId, @anger, @contempt, @disgust, @fear, @happiness, @neutral, @sadness, @surprise, GETDATE())',
            params: {
                userId: 	{ type: sql.INT, val: req.body.userId },
                imageId: 	{ type: sql.UNIQUEIDENTIFIER, val: req.body.imageId },
                anger: 		{ type: sql.NUMBER, val: req.body.anger },
				contempt: 	{ type: sql.NUMBER, val: req.body.contempt },
				disgust: 	{ type: sql.NUMBER, val: req.body.disgust },
				fear: 		{ type: sql.NUMBER, val: req.body.fear },
				happiness: 	{ type: sql.NUMBER, val: req.body.happiness },				
				neutral: 	{ type: sql.NUMBER,	val: req.body.neutral },				
				sadness: 	{ type: sql.NUMBER, val: req.body.sadness },				
				surprise: 	{ type: sql.NUMBER, val: req.body.surprise }
            }
        }).then( function() {
            res.json({success: true});
        }).catch(function(error){
            res.json({userId: req.body.userId, body : req.body, error : error});
            throw error;
        });														
	});
	
// REGISTER THE ROUTES
// ===================================================================================
app.use('/api', router);

// START THE SERVER
// ===================================================================================
app.listen(port);
console.log('Listening on port ' + port);
