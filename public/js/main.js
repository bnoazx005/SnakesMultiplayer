var socket = io('http://localhost:3000');

var Data = null;

window.onload = function() {

	// test code
	socket.on("onconnected", function() {
		console.log("connected");

		socket.emit("onjoingame", { color : "red", name : "player" + Math.floor(Math.random() * 10) });
	});

	socket.on("onjoined", function(data) {
		Data = data;
		console.log(data);
	});
};

window.onbeforeunload = function() {
	socket.emit("onexit", Data);
	//socket.close();
};