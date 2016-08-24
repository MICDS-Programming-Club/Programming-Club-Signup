const port = 420;

const _ = require('underscore');
const http = require('http');

const express = require('express');
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);

const levelTypes = [
	'beginner',
	'intermediate',
	'advanced'
];

app.use('/', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/html/index.html');
});

server.listen(port, function() {
	console.log('Server listening on *:' + port);
});

io.on('connection', function(socket) {
	console.log('User connected!')

	socket.on('signup', function(data) {
		if(typeof data.email !== 'string' || data.email === '') {
			socket.emit('signup response', false, 'Invalid email!');
			return;
		}
		if(!_.contains(levelTypes, data.level)) {
			socket.emit('signup response', false, 'Invalid programming level!');
			return;
		}

		console.log('User signup!', data)
	});
});
