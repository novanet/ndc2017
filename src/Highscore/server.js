// BASE SETUP
// =============================================================================
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');

// AZURE SQL DATABASE CONNECTION USING SERIATE
// ===================================================================================
var sql = require("seriate");
var config = {
    "server": process.env.server,
    "port": 1433,
    "user": process.env.user,
    "password": process.env.password,
    "database": process.env.database,
    "pool": {
        "max": 5,
        "min": 1
    },
    "options": {
        "encrypt": true
    }
};
sql.setDefaultConfig(config);

// CONFIG
// ===================================================================================
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'OPTIONS,POST');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    if ('OPTIONS' == req.method) {
        return res.send(200);
    }
    next();
});

// set the port
var port = process.env.PORT || 3000;

// ROUTES FOR THE API
// ===================================================================================
var router = express.Router();

router.get('/lastPhoto', function(req, res) {
    sql.execute({
        query: sql.fromFile( './sql/lastPhoto' )
    }).then(function(results) {
        res.send(results);
    }).catch(function(error) {
        res.json(error);
        throw error;
    });
});

router.get('/highscore', function(req, res) {
    sql.execute({
        query: 
			'SELECT Emotion, [Rank], U.[Name] as [User], Score, P.BlobUri FROM ( ' +
				'SELECT \'Anger\' AS Emotion, RANK() OVER (ORDER BY Anger DESC) AS [Rank], PhotoId, Anger AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Anger UNION ALL ' +
				'SELECT \'Contempt\' AS Emotion, RANK() OVER (ORDER BY Contempt DESC) AS [Rank], PhotoId, Contempt AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Contempt UNION ALL ' +
				'SELECT \'Disgust\' AS Emotion, RANK() OVER (ORDER BY Disgust DESC) AS [Rank], PhotoId, Disgust AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Disgust UNION ALL ' +
				'SELECT \'Fear\' AS Emotion, RANK() OVER (ORDER BY Fear DESC) AS [Rank], PhotoId, Fear AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Fear UNION ALL ' +
				'SELECT \'Happiness\' AS Emotion, RANK() OVER (ORDER BY Happiness DESC) AS [Rank], PhotoId, Happiness AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Happiness UNION ALL ' +
				'SELECT \'Neutral\' AS Emotion, RANK() OVER (ORDER BY Neutral DESC) AS [Rank], PhotoId, Neutral AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Neutral UNION ALL ' +
				'SELECT \'Sadness\' AS Emotion, RANK() OVER (ORDER BY Sadness DESC) AS [Rank], PhotoId, Sadness AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Sadness UNION ALL ' +
				'SELECT \'Surprise\' AS Emotion, RANK() OVER (ORDER BY Surprise DESC) AS [Rank], PhotoId, Surprise AS Score FROM dbo.[Emotions] WHERE PhotoId IN (SELECT Id FROM dbo.Photo) GROUP BY PhotoId, Surprise ' +
            ') A ' +
            'INNER JOIN dbo.[Photo] P ON P.Id = A.PhotoId ' +
            'INNER JOIN dbo.[User] U ON U.Id = P.UserId ' +
            'WHERE [Rank] <= 5 ' +
			'AND LEN(P.BlobUri) > 1 ' +
            'ORDER BY Emotion, [Rank], U.[Name] '
    }).then(function(results) {
        res.send(results);
    }).catch(function(error) {
        res.json(error);
        throw error;
    });
});
router.get('/users/:userId', function (req, res) {
	sql.execute({
		query: 
			'SELECT * FROM ( ' +
				'SELECT  U.Id AS UserId, U.NAME AS UserName, ' +
                        'E.Anger, E.Contempt, E.Disgust, E.Fear, E.Happiness, E.Neutral, E.Sadness, E.Surprise, ' +
                        '(SELECT TOP 1 x FROM (VALUES (\'Anger\', Anger), (\'Contempt\', Contempt), (\'Disgust\', Disgust), (\'Fear\', Fear), (\'Happiness\', Happiness), (\'Neutral\', Neutral), (\'Sadness\', Sadness), (\'Surprise\', Surprise)) AS value(x,y) ORDER BY y DESC) as [HighestScore],' +
                        'RANK() OVER (ORDER BY Anger DESC) AS [RankAnger], ' +
                        'RANK() OVER (ORDER BY Contempt DESC) AS [RankContempt], ' +
                        'RANK() OVER (ORDER BY Disgust DESC) AS [RankDisgust], ' +
                        'RANK() OVER (ORDER BY Happiness DESC) AS [RankHappiness], ' +
                        'RANK() OVER (ORDER BY Neutral DESC) AS [RankNeutral], ' +
                        'RANK() OVER (ORDER BY Sadness DESC) AS [RankSadness], ' +
                        'RANK() OVER (ORDER BY Surprise DESC) AS [RankSurprise], ' +
                        'P.Id AS PhotoId, ' +
                        'P.BlobUri ' +
					'FROM dbo.[Emotions] E ' +
					'INNER JOIN dbo.[Photo] P ON P.Id = E.PhotoId  ' +
					'INNER JOIN dbo.[User] U ON U.Id = P.UserId ' +
					'AND LEN(P.BlobUri) > 1  ' +
				') P ' +
			'WHERE P.UserId = @userId ',
		params: {
			userId: {
			    type: sql.INT,
			    val: req.params.userId,
			}
		}
	    }).then(function (results) {
			res.send(results);
	    }).catch(function (error) {
			res.json(error);
			throw error;
	    });	
});
router.route('/emotions')
    .post(function (req, res) {
        // Add emotions			

        sql.execute({
            query:
            'INSERT INTO [dbo].[Emotions]([PhotoId],[Anger],[Contempt],[Disgust],[Fear],[Happiness],[Neutral],[Sadness],[Surprise], [Added]) ' +
            'VALUES (@photoId, @anger, @contempt, @disgust, @fear, @happiness, @neutral, @sadness, @surprise, GETDATE())',
            params: {
                photoId: {
                    type: sql.UNIQUEIDENTIFIER,
                    val: req.body.photoId
                },
                anger: {
                    type: sql.NVarChar,
                    val: req.body.anger
                },
                contempt: {
                    type: sql.NVarChar,
                    val: req.body.contempt
                },
                disgust: {
                    type: sql.NVarChar,
                    val: req.body.disgust
                },
                fear: {
                    type: sql.NVarChar,
                    val: req.body.fear
                },
                happiness: {
                    type: sql.NVarChar,
                    val: req.body.happiness
                },
                neutral: {
                    type: sql.NVarChar,
                    val: req.body.neutral
                },
                sadness: {
                    type: sql.NVarChar,
                    val: req.body.sadness
                },
                surprise: {
                    type: sql.NVarChar,
                    val: req.body.surprise
                }
            }
        }).then(function () {
            res.json({
                success: true
            });
        }).catch(function (error) {
            res.json({
                userId: req.body.userId,
                body: req.body,
                error: error
            });
            throw error;
        });
    });

// REGISTER THE ROUTES
// ===================================================================================
app.use('/api', router);

//Serve web
app.use('/', express.static(__dirname));

app.get('/', function (req, res) {
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.sendFile('index.html');
});

// START THE SERVER
// ===================================================================================
app.listen(port);
console.log('Listening on port ' + port);
