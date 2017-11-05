window.onload = function() {
	var socket = io('http://localhost:3000');

	socket.on("onconnected", function() {
		console.log("connected");
	});
};