'use strict';

/**
 * @file Manages the signup of members
 * @module signup
 */

const config = require(__dirname + '/config.js');

const _       = require('underscore');
const async   = require('async');
const mail    = require(__dirname + '/mail.js');
const request = require('request');

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

function signup(db, data, callback) {
	if(typeof callback !== 'function') {
		callback = function() {};
	}

	if(typeof db !== 'object') {
		callback(new Error('Invalid database connection!'));
		return;
	}
	if(typeof data.email !== 'string' || data.email === '') {
		callback(new Error('Invalid email!'));
		return;
	} else {
		data.email = data.email.toLowerCase();
	}
	if(typeof data.firstName !== 'string' || data.firstName === '') {
		callback(new Error('Invalid first name!'));
		return;
	}
	if(typeof data.lastName !== 'string' || data.lastName === '') {
		callback(new Error('Invalid last name!'));
		return;
	}
	if(typeof data.gradYear !== 'number' || data.gradYear % 1 !== 0) {
		callback(new Error('Invalid graduation year!'));
		return;
	}
	if(!_.contains(levelTypes, data.level)) {
		callback(new Error('Invalid programming level!'));
		return;
	}

	const newProgrammer = {
		programmer: data.email,
		firstName: data.firstName,
		lastName: data.lastName,
		gradYear: data.gradYear,
		level: data.level
	};

	const emailData = {
		firstName: data.firstName,
		lastName: data.lastName,
		treehouseEmail: config.treehouse.email,
		treehousePassword: config.treehouse.password
	};

	// Register user
	async.parallel([
		// Insert user in database
		function(callback) {
			var programmerData = db.collection('programmers');

			programmerData.update({ programmer: data.email }, newProgrammer, { upsert: true }, function(err, results) {
				if(err) {
					callback(new Error('There was a problem inserting the student into the database!'));
					return;
				}

				callback(null);

			});
		},
		// Send email
		function(callback) {
			mail.sendHTML(data.email + '@micds.org', 'Programming Club', __dirname + '/../html/messages/programming-club.html', emailData, function(err) {
				if(err) {
					callback(err);
					return;
				}

				callback(null);

			});
		},
		// Invite to Slack group
		function(callback) {
			request({
				url: 'https://' + config.slack.group + '.slack.com/api/users.admin.invite',
				method: 'POST',
				form: {
					email: data.email + '@micds.org',
					token: config.slack.token
				}
			}, function(err, response, body) {
				body = JSON.parse(body);

				let allowedErrors = [
					'already_invited',
					'already_in_team'
				];

				if(err || !body || (!body.ok && !_.contains(allowedErrors, body.error))) {
					callback(new Error('There was a problem inviting the user to the Slack group!'));
					return;
				}

				callback(null);

			});
		}
	], function(err, results) {
		if(err) {
			callback(err);
			return;
		}

		callback(null);

		// Send a message to Slack chat to celebrate!
		request({
			url: 'https://' + config.slack.group + '.slack.com/api/chat.postMessage',
			method: 'POST',
			form: {
				token: config.slack.token,
				channel: config.slack.announceChannel,
				text: '*' + data.firstName + ' ' + data.lastName + ' (' + data.gradYear + ')* just registered for the Programming Club! An invitation has been sent to *' + data.email + '@micds.org*. This person has described their skill level at *' + data.level + '*.'
			}
		});

	});
}

module.exports.signup = signup;
