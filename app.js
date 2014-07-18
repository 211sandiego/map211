var express = require('express');
var app = express();
var Request = require('request');

// The number of milliseconds in one day
var oneDay = 86400000;
var incidentsURL = "https://spreadsheets.google.com/feeds/list/1zkEJa9nmUQPAOTgqT8NQS0n9_ZfkDssUy7LWo2A2yuc/od6/public/values?alt=json";
var KMLURL = "https://spreadsheets.google.com/feeds/list/1zkEJa9nmUQPAOTgqT8NQS0n9_ZfkDssUy7LWo2A2yuc/ovf3s91/public/values?alt=json";
var callTypeURL = "https://spreadsheets.google.com/feeds/list/1zkEJa9nmUQPAOTgqT8NQS0n9_ZfkDssUy7LWo2A2yuc/oxrpksk/public/values?alt=json";


// Use compress middleware to gzip content
//app.use(express.compress());

// Serve up content from public directory
app.use(express.static(__dirname + '/static', { maxAge: oneDay }));


// allow cross domain
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get('/calltype', function (req, resp, next) {
    Request.get(callTypeURL, function search (error, response, body) {
        if (error) {
            resp.writeHead(400);
            resp.end(error.message);
        }
        else {
            resp.contentType = 'application/json';
            resp.end(body);
        }
    });
});


// set up routes
app.get('/content', function (req, resp, next) {
    Request.get(incidentsURL, function search (error, response, body) {
        var incidents = {},
            KML = {};
        if (error) {
            resp.writeHead(400);
            resp.end(error.message);
        }
        else {
            incidents = body;
            Request.get(KMLURL, function search (error, response, body) {
                if (error) {
                    resp.writeHead(400);
                    resp.end(error.message);
                }
                else {
                    KML = body;
                    resp.contentType = 'application/json';
                    resp.end('{"incidents" : ' + incidents + ', "KML" : ' + KML + '}')
                }
            });
        }
    })
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
    console.log("Listening on " + port);
});


