var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.sockets = {};
channel.subscritions = {};

channel.on('join',function (id,socket) {
	this.sockets[id] = socket;
	this.subscritions[id] = function (senderId,data) {
		if (id != senderId) {
			this.sockets[id].write(senderId + data);
		}
	}
	this.on('broadcast',this.subscritions[id]);
});

channel.on('leave',function (id) {
	channel.removeListener('broadcast',this.subscritions[id]);
	channel.emit('broadcast',id,id+" has left the chat!\n");
});


var server = net.createServer(function (socket) {
	var id = socket.remoteAddress + ':' + socket.remotePort;

	channel.emit('join',id,socket);

	socket.on('data',function (data) {
		data = data.toString();
		channel.emit('broadcast',id,data);
	});

	socket.on('close',function () {
		channel.emit('leave',id);
	})


});
server.listen(8888);