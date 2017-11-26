function GameController(view) {
	var SOCKET_MESSAGES = {
		ON_CONNECTED : "onconnected",
		ON_JOIN_GAME : "onjoingame",
		ON_JOINED : "onjoined",
		ON_CHANGE_DIRECTION : "onchangedirection",
		ON_SYNCHRONIZE : "onsynchronize",
		ON_SYNCHRONIZED : "onsynchronized",
		ON_EXIT : "onexit",
		ON_ERROR : "onerror"
	};

	var mColorsArray = [
		"red", "green", "blue"
	];

	var mView           = null;

	var mSocketInstance = null;

	var mPlayerSessionData = null;

	this.Free = function() {
		if (mSocketInstance != undefined &&
			mPlayerSessionData != undefined) {
			mSocketInstance.emit("onexit", mPlayerSessionData);
		}

		document.removeEventListener("keydown", _processInput);
	};

	var _subscribeToSocketEvents = function(socket) {
		mSocketInstance.on(SOCKET_MESSAGES.ON_JOINED, _setSessionData);
		mSocketInstance.on(SOCKET_MESSAGES.ON_ERROR, _showErrorMessage);
		mSocketInstance.on(SOCKET_MESSAGES.ON_SYNCHRONIZED, _updateFrame);
	};

	var _tryToLogin = function(loginName) {
		mSocketInstance.emit(SOCKET_MESSAGES.ON_JOIN_GAME, {
			"color" : _getRandomColor(),
			"name" : loginName
		});
	};

	var _setSessionData = function(playerData) {
		mPlayerSessionData = playerData;

		console.log("Player [" + playerData.playerId + "] joined the game");

		mView.DisableLoginPage();
	};

	var _getRandomColor = function() {
		var numOfColors = mColorsArray.length;

		var randIndex = Math.floor(Math.random() * numOfColors);

		return mColorsArray[randIndex];
	};

	var _showErrorMessage = function(data) {
		alert(data.text);
	};

	var _updateFrame = function() {
		//we get the data from server, now we can use it to refresh the view
		mView.Render();
	};

	var _synchronizeState = function() {
		// just ask server to give the current game state to us
		mSocketInstance.emit(SOCKET_MESSAGES.ON_SYNCHRONIZE, {});
	};

	var _processInput = function(event) {
		if (mPlayerSessionData == undefined) { // the player hasn't authorized yet, so we don't need to process his/her input
			return;
		}

		var request = {};

		request.playerData = mPlayerSessionData;

		switch (event.keyCode) {
			case 37: //left arrow key
				request.dirCode = 0;
				break;
			case 38: //up arrow key
				request.dirCode = 1;
				break;
			case 39: //right arrow key
				request.dirCode = 2;
				break;
			case 40: //down arrow key
				request.dirCode = 3;
				break;
		}

		mSocketInstance.emit(SOCKET_MESSAGES.ON_CHANGE_DIRECTION, request);
	};

	function _init() {
		mView = view;

		var eventsTypes = mView.GetEventsTypes();

		mView.Subscribe(eventsTypes.ON_LOGIN, _tryToLogin);

		mSocketInstance = io('http://localhost:3000');

		_subscribeToSocketEvents(mSocketInstance);

		setInterval(_synchronizeState, 1 / 60);

		document.addEventListener("keydown", _processInput);
	}

	_init();
}