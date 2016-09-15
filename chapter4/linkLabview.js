/**
 * Created by Ru on 15/9/16.
 */

var net = require('net');

var server = net.createServer(function (socket) {
   var id = socket.remoteAddress;
    console.log('------'+id);
    socket.on('data',function (data) {
        data = data.toString();

        console.log(data);
    });

});

server.listen(3000);