var GameStructures = require("./gameStructures");
var Vector2D       = require("./../math/vector2d");
var md5            = require("md5");


function Game(origin, sizes, initialAmountOfFood, initialSnakeSize) {
	var ERROR_TYPES = {
		1 : "The specified player's name already exists",
		2 : "Authentication error",

		DEFAULT_ERROR : "Unknown error"
	};

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

	var self              = this;
	var mScene            = null;
	var mPlayers          = null;
	var mPlayersHashes    = null;
	var mFood             = null;
	var mTickEventHandler = 0;

	this.AddPlayer = function(color, name) {
		if (name in mPlayers) {
			return _error(1);
		}

		var player = null;

		do {
			player = new GameStructures.Snake(_generateSnakeBody(mScene, initialSnakeSize),
											  GameStructures.MOVE_DIRECTIONS.RIGHT, 
											  color, name);
		}
		while (_checkIntersections(player, mPlayers))

		mPlayers[name] = player;

		var playerHash = md5(name + (Math.floor(Math.random() * 65535) + 1));

		mPlayersHashes[name] = playerHash;

		return _result({
			"playerId" : name,
			"playerHash" : playerHash
		});
	};

	this.RemovePlayer = function(playerData) {
		var playerId   = playerData.playerId;
		var playerHash = playerData.playerHash;

		if (playerId == undefined ||
			playerHash == undefined ||
			playerHash != mPlayersHashes[playerId]) {
			return _error(2);
		}

		delete mPlayers[playerId];
		delete mPlayersHashes[playerId];

		return _result({});
	};

	this.ProcessConnection = function(connection) {
		if (connection == undefined) {
			return;
		}

		connection.on("connection", function(socket) {
			console.log("A new user was connected");

			socket.emit(SOCKET_MESSAGES.ON_CONNECTED, {});

			socket.on(SOCKET_MESSAGES.ON_JOIN_GAME, function(data) {
				if (data == undefined) {
					return;
				}

				var result = self.AddPlayer(data.color, data.name);

				if (result.status != "ok") {
					socket.emit(SOCKET_MESSAGES.ON_ERROR, result.data);

					return;
				}

				var playerData = result.data;

				console.log("User [" + playerData.playerId + "] joined the game");

				socket.emit(SOCKET_MESSAGES.ON_JOINED, { "playerId" : playerData.playerId, "playerHash" : playerData.playerHash });
			});

			socket.on(SOCKET_MESSAGES.ON_CHANGE_DIRECTION, function(data) {
				self.ChangePlayerDirection(data.playerData, data.direction);
			});	

			socket.on(SOCKET_MESSAGES.ON_EXIT, function(data) {
				self.RemovePlayer(data);

				socket.disconnect(true);

				console.log("The user [" + data.playerId + "] was disconnected");
			});
		});

		if (mTickEventHandler == 0) {
			mTickEventHandler = setInterval(function() {
				self.Update(function(dataPacket) {
					connection.sockets.emit(SOCKET_MESSAGES.ON_SYNCHRONIZED, dataPacket); //broadcast message
				});
			}, 1000 / 60); //update every 16 ms						
		}

	};

	this.Update = function(onFinishedCallback) {
		var packet = {
			food: [],
			snakes: {}
		};

		var currSnakeBody = null;

		var currSnakeBodyLength = 0;

		var currSnakePacket = null;

		for (var currPlayerId in mPlayers) {
			//move
			mPlayers[currPlayerId].Move();

			//check collisions
			//check food
			//check other snakes

			currSnakePacket = [];

			currSnakeBody = mPlayers[currPlayerId].GetBlocks();

			currSnakeBodyLength = currSnakeBody.length;

			for (var i = 0; i < currSnakeBodyLength; ++i) {
				currSnakePacket.push({ x : currSnakeBody[i].x, y : currSnakeBody[i].y });
			}

			packet.snakes[currPlayerId] = currSnakePacket;

			console.log(packet);
		}

		if (onFinishedCallback != undefined) {
			onFinishedCallback(packet);
		}
	};

	this.ChangePlayerDirection = function(playerData, dirCode) {
		if (playerData == undefined) {
			return _error(2);
		}

		var playerId   = playerData.playerId;
		var playerHash = playerData.playerHash;

		if (playerId == undefined ||
			playerHash == undefined ||
			playerHash != mPlayersHashes[playerId]) {
			return _error(2);
		}

		mPlayers[playerId].ChangeDirection(_dirCodeToVector(dirCode));

		return _result({});
	};

	var _dirCodeToVector = function(dirCode) {
		switch (dirCode) {
			case 0:
				return new Vector2D(-1, 0);
			case 1:
				return new Vector2D(0, 1);
			case 2:
				return new Vector2D(1, 0);
			case 3:
				return new Vector2D(0, -1);
		}

		return new Vector2D();
	};

	var _initFoodArray = function(sceneInstance, maxNumOfEntities) {
		var foodArray = [];

		var halfSizes = Vector2D.Mul(sceneInstance.mSizes, 0.5);

		//this algorithm doesn't check up food overlapping
		for (var i = 0; i < maxNumOfEntities; ++i) {
			do {
				foodArray[i] = _generateFoodObject(sceneInstance, halfSizes);
			}
			while (_checkIntersections(foodArray[i], foodArray.slice(0, i)))
		}

		return foodArray;
	};

	var _generateFoodObject = function(sceneInstance, halfSceneSize) {
		var pos = new Vector2D(Math.floor(Math.random() * sceneInstance.mSizes.x) - halfSceneSize.x,
							   Math.floor(Math.random() * sceneInstance.mSizes.y) - halfSceneSize.y);

		return new GameStructures.Food(pos);
	};

	var _generateSnakeBody = function(sceneInstance, snakeSize) {
  		var isHorizontal = Math.floor(Math.random() * 2) == 0 ? true : false;

  		var shiftValue = Math.floor(Math.random() * 2) == 0 ? 1 : -1;

		var halfSizes = Vector2D.Mul(sceneInstance.mSizes, 0.5);

  		var head = new Vector2D(Math.floor(Math.random() * sceneInstance.mSizes.x) - halfSizes.x,
							    Math.floor(Math.random() * sceneInstance.mSizes.y) - halfSizes.y);

  		var snakeBody = [head];

  		var prevSegment = head;
  		var currSegment = null;

  		var dir = isHorizontal ? new Vector2D(shiftValue , 0) : new Vector2D(0, shiftValue);

  		// initial snake will be placed as vertial or horizontal line
  		for (var i = 1; i < snakeSize; ++i) {
  			currSegment = Vector2D.Sum(prevSegment, dir);

  			snakeBody.push(currSegment);

  			prevSegment = currSegment;
  		}

  		return snakeBody;
	};

	var _checkIntersections = function(intersectable, intersectablesArray) {
		if (intersectable == undefined ||
			intersectablesArray == undefined) {
			return false;
		}

		if (Array.isArray(intersectablesArray)) {
			var intersectablesArrayLength = intersectablesArray.length;

			for (var i = 0; i< intersectablesArrayLength; ++i) {
				if (intersectable != intersectablesArray[i] &&
					intersectable.Intersect(intersectablesArray[i])) {
					return true;
				}
			}
		}
		else {
			for (var intersectableId in intersectablesArray) {
				if (intersectable != intersectablesArray[intersectableId] &&
					intersectable.Intersect(intersectablesArray[intersectableId])) {
					return true;
				}
			}
		}

		return false;
	};

	var _error = function(code) {
		return {
			status : "fail",
			data : (code && ERROR_TYPES[code]) ? 
				{ code: code, text: ERROR_TYPES[code] } :
				{ code: DEFAULT_ERROR, text: ERROR[DEFAULT_ERROR] }
		};
	};

	var _result = function(data) {
		return {
			status : "ok",
			data : data
		};
	};

	function _init() {
		mScene = new GameStructures.Scene(origin, sizes);

		mFood = _initFoodArray(mScene, initialAmountOfFood || 20);

		mPlayers = {};

		mPlayersHashes = {};
	}

	_init();
}

module.exports = Game;