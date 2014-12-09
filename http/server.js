// server.js

var log = require('../common/logger.js')('http server');
var EventEmitter = require('events').EventEmitter;
var express = require('express');
var bodyParser = require('body-parser');
var gatekeeper = require('./gatekeeper.js');
var users = require('../private/users.js');

module.exports.Server = function(port) {
	log.info('Starting server...');

	var main = new EventEmitter();

	main.app = express();
	main.app.use(bodyParser.json());

	main.app.get('/:datatype', gatekeeper.frisk(null), function(req, res) {
		var reqtype = req.params.datatype;

		if(reqtype == 'favicon.ico') {
			// send the icon
			res.status = 200;
			res.end();
		} else {
			if(!reqtype || cache[reqtype] == null) {
				res.status = 404;
				res.send('invalid request');
			} else {
				res.status = 200;
				res.send(cache[reqtype]);
			}
		}
	});

	main.app.put('/:datatype', gatekeeper.frisk('admin'), function(req, res) {
		var reqtype = req.params.datatype;

		if(reqtype == 'favicon.ico') {
			// send the icon
			res.status = 200;
			res.end();
		} else {
			main.emit('data', req.user, req.body)
			res.writeHead(200, "ok");
			res.send();
		}
	});

	main.process = function(data) {
		if(data.cache) {
			log.info('Update cache for [' + data.type + ']');
			cache[data.type] = data;
		}
	};

	main.app.listen(port);

	log.info('Server started');

	return main;
};

var cache = {};