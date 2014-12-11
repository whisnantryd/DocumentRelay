// db.js

var log = require('../../common/logger.js')('database');
var config = require('../../private/config.js').db;
var mongodb = require('mongodb');
var mongclient = mongodb.MongoClient;

log.info('Connecting to ' + config.host + '...');

mongclient.connect(config.connectionString(), function(err, db) {
	if(err) {
		log.error('Connect failed' + (err ? ', ' + err : ''));
		return;
	}

	log.info('Connected');

	module.exports.getuser = function(name, pass, callback) {
		db.collection('users').find({login : name, pass : pass}).toArray(function(err, items) {
			if(err) {
				callback();
			} else {
				callback(items);
			}
		});
	};
});

// some queries
// db.users.find({login : 'test', pass : 'abc123'})
// db.users.find({role : {$all : ['user']}})