var GameStructures = require("./gameStructures");
var Vector2D       = require("./../math/vector2d");
var md5            = require("md5");


function Game(origin, sizes, initialAmountOfFood, initialSnakeSize) {
	var mScene         = null;
	var mPlayers       = null;
	var mPlayersHashes = null;
	var mFood          = null;

	this.AddPlayer = function(color, name) {
		var playerId = mPlayers.push(new GameStructures.Snake(_generateSnakeBody(mScene, initialSnakeSize),
															  GameStructures.MOVE_DIRECTIONS.RIGHT, 
															  color, name)) - 1;

		var playerHash = md5(name + playerId + (Math.floor(Math.random() * 65535) + 1));

		mPlayersHashes[playerId] = playerHash;

		return {
			"playerId" : playerId,
			"playerHash" : playerHash
		};
	};

	this.RemovePlayer = function(playerData) {
		var playerId   = playerData.playerId;
		var playerHash = playerData.playerHash;

		if (playerId < 0 ||
			playerId >= mPlayers.length ||
			playerHash != mPlayersHashes[playerId]) {
			return false;
		}

		mPlayers = mPlayers.splice(playerId, 1);

		mPlayersHashes = mPlayersHashes.splice(playerId, 1);

		return true;
	};

	this.Update = function(onFinishedCallback) {
		var currPlayer = null;

		for (var i = 0; i < mPlayers.length; ++i) {
			currPlayer = mPlayers[i];

			//check collisions
			//check food
			//check other snakes

			//move
			currPlayer.Move();
		}

		if (onFinishedCallback != undefined) {
			onFinishedCallback();
		}
	};

	this.ChangePlayerDirection = function(playerData, dir) {
		if (playerId < 0 ||
			playerId >= mPlayers.length ||
			playerHash != mPlayersHashes[playerId]) {
			return false;
		}

		mPlayers[playerId].ChangeDirection(dir);

		return true;
	};

	var _initFoodArray = function(sceneInstance, maxNumOfEntities) {
		var foodArray = [];

		var pos = null;

		var halfSizes = Vector2D.Mul(sceneInstance.mSizes, 0.5);

		//this algorithm doesn't check up food overlapping
		for (var i = 0; i < maxNumOfEntities; ++i) {
			pos = new Vector2D(Math.floor(Math.random() * sceneInstance.mSizes.x) - halfSizes.x,
							   Math.floor(Math.random() * sceneInstance.mSizes.y) - halfSizes.y);

			foodArray[i] = new GameStructures.Food(pos);
		}

		return foodArray;
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

	function _init() {
		mScene = new GameStructures.Scene(origin, sizes);

		mFood = _initFoodArray(mScene, initialAmountOfFood || 20);

		mPlayers = [];

		mPlayersHashes = [];
	}

	_init();
}

module.exports = Game;