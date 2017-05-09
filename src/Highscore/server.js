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
        query: sql.fromFile( './sql/highscore' )			
    }).then(function(results) {
        res.send(results);
    }).catch(function(error) {
        res.json(error);
        throw error;
    });
});
router.get('/users/:userId', function (req, res) {
	sql.execute({
		query: sql.fromFile( './sql/user' ),
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
        sql.execute({
            query: sql.fromFile( './sql/addEmotions' ),
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
