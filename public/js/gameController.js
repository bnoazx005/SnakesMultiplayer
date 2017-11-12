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
	};

	var _subscribeToSocketEvents = function(socket) {
		mSocketInstance.on(SOCKET_MESSAGES.ON_JOINED, _setSessionData);

		mSocketInstance.on(SOCKET_MESSAGES.ON_ERROR, _showErrorMessage);
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

	function _init() {
		mView = view;

		var eventsTypes = mView.GetEventsTypes();

		mView.Subscribe(eventsTypes.ON_LOGIN, _tryToLogin);

		mSocketInstance = io('http://localhost:3000');

		_subscribeToSocketEvents(mSocketInstance);
	}

	_init();
}