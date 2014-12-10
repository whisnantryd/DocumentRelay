// db.js

var log = require('../../common/logger.js')('database');
var mongodb = require('mongodb');
var mongclient = mongodb.MongoClient;

mongclient.connect('mongodb://54.164.72.199:27017/docrelay', function(err, db) {
	if(err) {
		log.error('not connected');
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