var viewInstance       = null;
var controllerInstance = null;

window.onload = function() {
	viewInstance = new View();
	controllerInstance = new GameController(viewInstance);
};

window.onbeforeunload = function() {
	controllerInstance.Free();
};