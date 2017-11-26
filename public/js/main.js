var viewInstance       = null;
var controllerInstance = null;

window.onload = function() {
	viewInstance = new View();
	controllerInstance = new GameController(viewInstance);

	viewInstance.Resize(window.innerWidth, window.innerHeight);
};

window.onbeforeunload = function() {
	controllerInstance.Free();
};

window.onresize = function() {
	viewInstance.Resize(window.innerWidth, window.innerHeight);
};