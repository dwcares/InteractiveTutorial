var express = require('express');
var app = express();
app.use(express.static('public')); 
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var numClients = 0;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/default.html');
});

http.listen(port, function() {
    console.log('listening on *: ' + port);
});

io.on('connection', function(socket) {
    console.log('new connection');
    numClients++; 

    io.emit("clientsChanged", numClients);

    socket.on('message', function(msg) {
        console.log('Got message from client: ' + msg);     
    });

    socket.on('disconnect', function(socket) {
        numClients--;
        io.emit("clientsChanged", numClients);

    });
});
