let config;
try {
	config = require(__dirname + '/../src/libs/config.js');
} catch(e) {
	throw new Error('***PLEASE CREATE A CONFIG.JS ON YOUR LOCAL SYSTEM. REFER TO LIBS/CONFIG.EXAMPLE.JS***');
}

const { MongoClient, ObjectId } = require('mongodb');

MongoClient.connect(config.mongodbURI, (err, db) => {
	if(err) throw err;

	const programmerData = db.collection('programmers');

	programmerData.find({}).toArray((err, programmers) => {
		console.log('programmers', programmers);

		const loop = i => {
			if (i < programmers.length) {
				const programmer = programmers[i];
				const createdTimestamp = programmer._id.getTimestamp();
				console.log('time for', programmer.programmer, 'is', createdTimestamp);

				programmerData.update({ _id: programmer._id }, { $set: { registered: createdTimestamp }}, err => {
					if (err) throw err;
					loop(++i);
				});
			} else {
				console.log(`All done! Updated registered times for ${programmers.length} programmers.`);
				process.exit();
			}
		};
		loop(0);
	});
});
