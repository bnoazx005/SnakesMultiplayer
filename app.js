var express = require('express');
var http    = require('http');
var app     = express();
var server  = http.createServer(app);
var io      = require('socket.io').listen(server);

var Router = require('./application/routers/routes');
var Game = require('./application/modules/game/game');

var gameInstance = new Game();

app.use(express.static(__dirname + '/public'));

app.use('/', Router);

server.listen(3000, function() {
    console.log('server start at port 3000');

    console.log(gameInstance);
});