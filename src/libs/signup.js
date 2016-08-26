'use strict';

/**
 * @file Manages the signup of members
 * @module signup
 */

const _    = require('underscore');
const mail = require(__dirname + '/mail.js');

const levelTypes = [
	'beginner',
	'intermediate',
	'advanced'
];

/**
 * Sign a user up for the programming club
 * @function signup
 *
 * @param {Object} data - Data about user
 * @param {string} data.email - Users's school email (ends with @micds.org)
 * @param {string} data.level - User's programming level ('beginner'|'intermediate'|'advanced')
 * @param {signupCallback} callback - Callback
 */

/**
 * Returns error if any while signing up user
 * @callback signupCallback
 *
 * @param {Object} err - Null if success, error object if failure.
 */

function signup(data, callback) {
	if(typeof data.email !== 'string' || data.email === '') {
		callback(new Error('Invalid email!'));
		return;
	}
	if(!_.contains(levelTypes, data.level)) {
		callback(new Error('Invalid programming level!'));
		return;
	}

	mail.sendHTML(data.email + '@micds.org', 'Programming Club', __dirname + '/../html/messages/programming-club.html', {}, function(err) {
		if(err) {
			callback(err);
			return;
		}

		callback(null);

	});
}

module.exports.signup = signup;
