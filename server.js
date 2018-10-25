//Import modules
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

//Create server
var app = express();
var server = http.Server(app);
var io = socketIO(server);

//Network configuration
app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

//Start the server
server.listen(5000, function() {
    console.log('Starting server on port 5000');
});

var players = {};
//Add the WebSocket handlers
io.on('connection', function(socket) {
    
    socket.on('new player', function() {
        players[socket.id] = {
            x:300,
            y:300,
            up:false,
            left:false,
            right:false,
            down:false
        }
        console.log(players);
    });

    socket.on('movement', function(data) {
        var player = players[socket.id] || {};
        player.left = data.left;
        player.up = data.up;
        player.right = data.right;
        player.down = data.down;
    })
});

//Update players then send out state
setInterval(function() {

    for(var i in players) {
        var player = players[i];

        if(player.left == true)
            player.x -= 5;

        if(player.right == true)
            player.x += 5;

        if(player.up == true)
            player.y -= 5;
        
        if(player.down == true)
            player.y += 5;
    }

    io.sockets.emit('state', players);
}, 1000 / 60);

