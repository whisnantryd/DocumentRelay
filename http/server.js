// server.js

var log = require('../common/logger.js')('http server');
var EventEmitter = require('events').EventEmitter;
var express = require('express');
var bodyParser = require('body-parser');
var auth = require('./basicauth.js');

var unauth = function(res) {
	res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="example"' });
    res.end();
};

var authorize = function(authtype) {
	return function(req, res, next) {
		var user = auth(req);

		if(!user || user == undefined) {
			return unauth(res);
		}

		req.user = user;

		return next();
	};
}

module.exports.Server = function(port) {
	log.info('Starting server...');

	var main = new EventEmitter();

	main.app = express();
	main.app.use(bodyParser.json());

	main.app.get('/:datatype', authorize(null), function(req, res) {
		var reqtype = req.params.datatype;

		if(reqtype == 'favicon') {
			// send the icon
		} else {
			if(!reqtype || cache[reqtype] == null) {
				res.status = 404;
				res.send('invalid request');
			} else {
				res.writeHead(200, "ok");
				res.send(cache[reqtype]);
			}
		}
	});

	main.app.put('/:datatype', authorize(null), function(req, res) {
		var reqtype = req.params.datatype;

		if(reqtype == 'favicon') {
			// send the icon
		} else {
			main.emit('data', req.user, req.body)
		}

		res.writeHead(200, "ok");
		res.send();
	});

	main.process = function(data) {
		log.info('update cache for [' + data.type + ']');
		cache[data.type] = data;
	};

	main.app.listen(port);

	log.info('Server started');

	return main;
};

var cache = {};