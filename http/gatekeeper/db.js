// db.js

var log = require('../../common/logger.js')('database');
var config = require('../../private/config.js').db;
var mongclient = require('mongodb').MongoClient;
var crypto = require('./crypto.js');

log.info('Connecting to ' + config.connectionString() + '...');

mongclient.connect(config.connectionString(), function(err, db) {
	if(err) {
		log.error('Connect failed' + (err ? ', ' + err : ''));
		return;
	}

	log.info('Connected');

	module.exports.getuser = function(name, key, callback) {
		key = crypto.SHA256(key).toString();

		db.collection('users').find({
			login : name,
			pass : key
		},
		{
			login : 1,
			role : 1,
			root : 1,
			permit : 1
		}).toArray(function(err, items) {
			if(err) {
				callback();
			} else {
				callback(items);
			}
		});
	};
});

// some queries
// db.users.find({login : 'test', key : 'abc123'})
// db.users.find({role : {$all : ['user']}})