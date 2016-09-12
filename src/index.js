'use strict';

/**
 * @file Main file of the whole project.
 */

try {
	var config = require(__dirname + '/libs/config.js');
} catch(e) {
	throw new Error('***PLEASE CREATE A CONFIG.JS ON YOUR LOCAL SYSTEM. REFER TO LIBS/CONFIG.EXAMPLE.JS***');
}

const port = config.port;

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const signup = require(__dirname + '/libs/signup.js');
const MongoClient = require('mongodb').MongoClient;

/*
 * Routes and Middleware
 */

// Parse POST variables
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static assets
app.use('/', express.static(__dirname + '/public'));

// Default index.html
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/html/index.html');
});

/*
 * Connect to Database
 */

MongoClient.connect(config.mongodbURI, function(err, db) {
	if(err) throw err;

	// Signup API Route
	app.post('/signup', function(req, res) {

		// Convert graduation year to int
		req.body.gradYear = parseInt(req.body.gradYear);

		signup.signup(db, req.body, function(err) {
			let errorMessage = null;
			if(err) {
				errorMessage = err.message;
			}
			res.json({ error: errorMessage });
		});
	});
});

/*
 * Initialize Server
 */

app.listen(port, function() {
	console.log('Server listening on *:' + port);
});
