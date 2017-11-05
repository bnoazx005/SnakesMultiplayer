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

    io.on("connection", function(socket) {
    	console.log("A new user was connected");

    	socket.emit("onconnected", {});

		socket.on("onjoingame", function(data) {
			if (data == undefined) {
				return;
			}

			var playerId = gameInstance.AddPlayer(data.color, data.name);

			console.log("User joined the game");

			socket.emit("onjoined", { id : playerId });
		});

		socket.on("onchangedirection", function(data) {
			//gameInstance.ChangePlayerDirection(socket)
		});

		socket.on("onsynchronize", function(data) {
			gameInstance.Update(function() {
				console.log("The game's state was updated");
			});
		});
    });
});