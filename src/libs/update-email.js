'use strict';

/**
 * @file DO NOT RUN UNLESS YOU KNOW WHAT YOU ARE DOING! Sends an email to all members sending the update email in case they want to leave.
 */

// To prevent people from accidentally running the script
const actually = false; // DO NOT COMMIT WITH `TRUE`

const config = require(__dirname + '/config.js');
const mail = require(__dirname + '/mail.js');
const MongoClient = require('mongodb').MongoClient;

if (!actually) {
	throw new Error('You don\'t know what you\'re doing!');
}

MongoClient.connect(config.mongodbURI, function(err, db) {
	if(err) throw err;

	db.collection('programmers').find({}).toArray(function(err, people) {
		if(err) {
			throw err;
		}

		people = [{
			programmer: 'mgira',
			firstName: 'Michael',
			lastName: 'Gira',
			gradYear: 2019,
			level: 'advanced'
		}];

		console.log('Sending email to ' + people.length + ' people...');

		function sendMail(i) {
			if(i < people.length) {
				mail.sendHTML(people[i].programmer + '@micds.org', 'Programming Club - Update', __dirname + '/../html/messages/update.html', people[i], function(err) {
					if(err) {
						console.log('Error sending mail!', err);
						return;
					}
					console.log('Successfully sent email to ' + people[i].programmer + '@micds.org');
					sendMail(++i);
				});
			} else {
				console.log('**********');
				console.log('Finished!');
				console.log('**********');
				process.exit();
			}
		}
		sendMail(0);
	});
});
