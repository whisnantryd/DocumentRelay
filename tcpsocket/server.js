// server.js

var log = require('../common/logger.js')('tcpsocket');
var EventEmitter = require('events').EventEmitter;
var net = require('net');
var Keepalive = require('./keepalive.js');

module.exports.Server = function(port) {
	log.info('Starting server...');

	var main = new EventEmitter();

	main.clients = [];
	main.server = net.createServer();
		
	main.server.on('connection', function(client) {
		client.on('error', function(err) {});
		
		client.on('data', function(data) {				
			main.emit('data', client, data);
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

	main.create = function() {
		main.server.listen(port);
	};

	main.broadcast = function(data) {
		var msg = '';

		if(typeof data == 'object') {
			msg = JSON.stringify(data) + '\r\n';
		} else {
			msg = data.toString();
		}

		main.clients.forEach(function(client) {
			client.write(msg);
		});

		delete msg;
		delete data;
	};

	main.server.on('error', function(err) { delete err; });
	
	main.server.on('close', function() {
		setTimeout(main.create, 5000);
	});

	main.create();

	setInterval(function() {
		var ka = new Keepalive();
		main.broadcast(ka);
		delete ka;
	}, 998);

	log.info('Server started');

	return main;
}