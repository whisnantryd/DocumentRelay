// server.js

var config = require('./private/config.js');
var tcpserver = require('./tcpsocket/server').Server(config.tcp.port);
var wsserver = require('./websocket/server.js').Server(config.websocket.port);
var httpserver = require('./http/server.js').Server(config.http.port);

var broadcast = function(data) {
	tcpserver.broadcast(data);
	wsserver.broadcast(data);

	delete data;
};

tcpserver.on('data', function(client, data) {
	broadcast(data);
});

wsserver.on('data', function(client, data) {
	broadcast(data);
});

httpserver.on('data', function(client, data) {
	broadcast(data);
});