// server.js

var tcpserver = require('./tcpsocket/server').Server(8000);
var wsserver = require('./websocket/server.js').Server(8001);
var httpserver = require('./http/server.js').Server(8002);

broadcast = function(data) {
	tcpserver.broadcast(data);
	wsserver.broadcast(data);

	delete data;
}

tcpserver.on('data', function(client, data) {
	broadcast(data);
});

wsserver.on('data', function(client, data) {
	broadcast(data);
});

httpserver.on('data', function(client, data) {
	broadcast(data);
});