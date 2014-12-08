// server.js

var log = require('../common/logger.js')('websocket server');
var EventEmitter = require('events').EventEmitter;
var WebSocketServer = require('ws').Server;

module.exports.Server = function(portnum) {
	log.info('Starting server...');

	var main = new EventEmitter();

	main.clients = [];
	main.server = new WebSocketServer({ port: portnum });

	main.server.on('connection', function(client) {
		client.on('error', function(err) {});
		
		client.on('message', function(data) {
			main.emit('data', client, JSON.parse(data));
		});
		
		client.on('close', function(err) {
			var i = main.clients.indexOf(client);
			
			if(i > -1) {
				main.clients.splice(i, 1);
				log.info('Client removed, ' + main.clients.length + ' total');
			}
		});
		
		if(main.clients.indexOf(client) == -1) {
			main.clients.push(client);
			log.info('Client connected, ' + main.clients.length + ' total');
		}
	});

	main.broadcast = function(data) {
		var msg = '';

		if(typeof data == 'object') {
			msg = JSON.stringify(data) + '\r\n';
		} else {
			msg = data.toString();
		}

		main.clients.forEach(function(client) {
			client.send(msg);
		});
	};

	log.info('Server started');

	return main;
}