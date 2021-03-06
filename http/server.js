// server.js

var log = require('../common/logger.js')('http');
var EventEmitter = require('events').EventEmitter;
var express = require('express');
var bodyParser = require('body-parser');
var gatekeeper = require('./gatekeeper/gatekeeper.js');
var util = require('../common/utility.js');

module.exports.Server = function(port) {
	log.info('Starting server...');

	var main = new EventEmitter();
	var app = express();

	app.use(bodyParser.json());
	app.get(['/favicon.ico', '/:path/favicon.ico'], function(req, res) { res.send(); });

	app.get('/:path', gatekeeper.frisk(null), function(req, res) {
		var path = req.params.path;

		if(!path || cache[path] == null) {
			res.status = 404;
			res.json({ status : 'invalid endpoint' });
		} else {
			res.status = 200;
			res.json(cache[path]);
		}
	})

	app.get('/:path/:datatype', gatekeeper.frisk(null), function(req, res) {
		var path = req.params.path;
		var datatype = req.params.datatype;

		if(!path || !datatype || cache[path] == null || cache[path][datatype] == null) {
			res.status = 404;
			res.json({ status : 'invalid endpoint' });
		} else {
			res.status = 200;
			res.json(cache[path][datatype]);
		}
	});

	app.put('/:path/:datatype', gatekeeper.frisk('admin'), function(req, res) {
		main.emit('data', req.user, req.body);

		var pathcache = cache[req.params.path];

		if(!pathcache) {
			pathcache = cache[req.params.path] = {};
		}

		pathcache[req.params.datatype] = req.body;

		log.info('Update cache [path: {0}/{1}, user: {2}]'.format(req.params.path, req.params.datatype, req.user.login));

		res.writeHead(200, 'ok');
		res.send();
	});

	app.listen(port);

	log.info('Server started');

	return main;
};

var cache = {};