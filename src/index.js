const port = 420;

const express = require('express');
const app = express();

app.use('/', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/html/index.html');
});

app.listen(port, function() {
	console.log('Server listening on *:' + port);
});
