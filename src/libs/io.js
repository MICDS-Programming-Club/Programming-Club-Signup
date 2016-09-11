'use strict';

/**
 * @file Manages the Socket.io interactions
 * @module io
 */

const signup = require(__dirname + '/signup.js');

module.exports = function(io, db) {
	io.on('connection', function(socket) {

		socket.on('signup', function(data) {
			signup.signup(db, data, function(err) {
				if(err) {
					socket.emit('signup response', false, err.message);
					return;
				}

				socket.emit('signup response', true, 'Success!');
			});
		});
	});
}
