var GameStructures = require("./gameStructures");
var Vector2D       = require("./../math/vector2d");
var md5            = require("md5");


function Game(origin, sizes, initialAmountOfFood, initialSnakeSize) {
	var GAME_SPEED = 200;

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
		ON_ERROR : "onerror",
		ON_GAME_OVER : "ongameover"
	};

	var self              = this;
	var mScene            = null;
	var mPlayers          = null;
	var mPlayersHashes    = null;
	var mFood             = null;
	var mTickEventHandler = 0;
	var mClients          = null;

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

				mClients[playerData.playerId] = socket;
			});

			socket.on(SOCKET_MESSAGES.ON_CHANGE_DIRECTION, function(data) {
				self.ChangePlayerDirection(data.playerData, data.dirCode);
			});	

			socket.on(SOCKET_MESSAGES.ON_EXIT, function(data) {
				self.RemovePlayer(data);

				socket.disconnect(true);

				delete mClients[data.playerId];

				console.log("The user [" + data.playerId + "] was disconnected");
			});
		});

		if (mTickEventHandler == 0) {
			mTickEventHandler = setInterval(function() {
				self.Update(function(dataPacket) {
					connection.sockets.emit(SOCKET_MESSAGES.ON_SYNCHRONIZED, dataPacket); //broadcast message
				});
			}, GAME_SPEED);						
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

		var currPlayer = null;

		//generate a new portion of food if amount of it is low
		if (mFood.length < 10) {
			mFood = mFood.concat(_generateFoodArray(mScene, initialAmountOfFood || 20));

			console.log("A new portion of food was generated");
		}

		var cutPart = null;

		var intersectionData = null;

		for (var currPlayerId in mPlayers) {
			currPlayer = mPlayers[currPlayerId];

			if (currPlayer.mIsDead) {
				console.log("The player [" + currPlayerId + "] died");

				if (mClients[currPlayerId] != undefined) {
					mClients.emit(SOCKET_MESSAGES.ON_GAME_OVER, { score: currPlayer.mScore });
				}

				delete mPlayers[currPlayerId];

				continue;
			}

			//move
			cutPart = currPlayer.Move();

			//check collisions with other players
			for (var enemyId in mPlayers) {
				if (enemyId == currPlayerId) {
					continue;
				}

				//cut the enemy
				if ((intersectionData = currPlayer.Intersect(mPlayers[enemyId])).result) {
					var cutEnemyPart = mPlayers[enemyId].Cut(intersectionData.contactPoint);
					
					for (var i = 0; i < cutEnemyPart.length; ++i) {
						mFood.push(new GameStructures.Food(cutEnemyPart[i]));
					}

					break; //a snake can eat only one enemy snake at a moment
				}
			}

			for (var i = 0; i < mFood.length; ++i) {
				if (currPlayer.Intersect(mFood[i]).result) {
					currPlayer.Eat(mFood[i]);

					_removeFood(i);

					break;
				}
			}

			if (cutPart != null) {
				//create food cells from the snake's cut body
				for (var i = 0; i < cutPart.length; ++i) {
					mFood.push(new GameStructures.Food(cutPart[i]));
				}
			}

			//check other snakes

			currSnakePacket = [];

			currSnakeBody = currPlayer.GetBlocks();

			currSnakeBodyLength = currSnakeBody.length;

			for (var i = 0; i < currSnakeBodyLength; ++i) {
				currSnakePacket.push({ x : currSnakeBody[i].x, y : currSnakeBody[i].y });
			}

			packet.snakes[currPlayerId] = {
				body : currSnakePacket,
				color : currPlayer.mColor
			};
		}

		var foodArray = [];

		for (var i = 0; i < mFood.length; ++i) {
			var foodPos = mFood[i].mPos;

			foodArray[i] = { x : foodPos.x , y : foodPos.y };
		}

		packet.food = foodArray;	

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

		console.log("player [" + playerId + "] changed direction (dirCode: " + dirCode + ")" );

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

	var _generateFoodArray = function(sceneInstance, maxNumOfEntities) {
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
					intersectable.Intersect(intersectablesArray[i]).result) {
					return true;
				}
			}
		}
		else {
			for (var intersectableId in intersectablesArray) {
				if (intersectable != intersectablesArray[intersectableId] &&
					intersectable.Intersect(intersectablesArray[intersectableId]).result) {
					return true;
				}
			}
		}

		return false;
	};

	var _removeFood = function(index) {
		if (index == undefined ||
			isNaN(index - 0) ||
			index < -1 ||
			index >= mFood.length) {
			return false;
		}

		mFood.splice(index, 1);
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

		mFood = _generateFoodArray(mScene, initialAmountOfFood || 20);

		mPlayers = {};

		mPlayersHashes = {};

		mClients = {}; //store clients' sockets
	}

	_init();
}

module.exports = Game;