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

const http = require('http');
const express = require('express');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

const MongoClient = require('mongodb').MongoClient;

/*
 * Connect to Database
 */

MongoClient.connect(config.mongodbURI, function(err, db) {
	if(err) throw err;

	/*
	 * Socket.io
	 */

	require(__dirname + '/libs/io.js')(io, db);
});

/*
 * Routes
 */

app.use('/', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/html/index.html');
});

/*
 * Initialize Server
 */

server.listen(port, function() {
	console.log('Server listening on *:' + port);
});
