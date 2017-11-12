var socket = io('http://localhost:3000');

window.onload = function() {

	// test code
	socket.on("onconnected", function() {
		console.log("connected");

		socket.emit("onjoingame", { color : "red", name : "player" });
	});

	socket.on("onjoined", function(data) {
		console.log(data);
	});
};

window.onbeforeunload = function() {
	socket.close();
};