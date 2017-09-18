'use strict';

/**
 * @file Quick little script that sends an email to a given address to test the automated email
 */

const address = 'mgira@micds.org';

const config = require(__dirname + '/config.js');
const mail = require(__dirname + '/mail.js');

const emailData = {
	firstName: 'Michael',
	lastName: 'Gira',
	treehouseEmail: config.treehouse.email,
	treehousePassword: config.treehouse.password
};

mail.sendHTML(address, 'Welcome to Programming Club!', __dirname + '/../html/messages/programming-club.html', emailData, function(err) {
	if(err) {
		console.log('Error sending mail!', err);
		return;
	}
	console.log('Successfully sent email to ' + address);
});
