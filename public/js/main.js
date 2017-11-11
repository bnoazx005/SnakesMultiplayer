window.onload = function() {
	var socket = io('http://localhost:3000');

	// test code
	socket.on("onconnected", function() {
		console.log("connected");

		socket.emit("onjoingame", { color : "red", name : "player" });
	});

	socket.on("onjoined", function(data) {
		console.log(data);
	});
};