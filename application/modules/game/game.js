var GameStructures = require("./gameStructures");
var Vector2D = require("./../math/vector2d");


function Game(origin, sizes, initialAmountOfFood) {
	var mScene   = null;
	var mPlayers = null;
	var mFood    = null;

	this.AddPlayer = function(color, name) {
		mPlayers.push(new GameStructures.Player([], GameStructures.MOVE_DIRECTIONS.RIGHT, color, name));
	};

	this.Update = function() {
		var currPlayer = null;

		for (var i = 0; i < mPlayers.length; ++i) {
			currPlayer = mPlayers[i];

			//check collisions
			//check food
			//check other snakes

			//move
			currPlayer.Move();
		}
	};

	this.ChangePlayerDirection = function(playerId, dir) {
		if (playerId < 0 || playerId >= mPlayers.length) {
			return;
		}

		mPlayers[playerId].ChangeDirection(dir);
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

	function _init() {
		mScene = new GameStructures.Scene(origin, sizes);

		mFood = _initFoodArray(mScene, initialAmountOfFood || 20);

		mPlayers = [];
	}

	_init();
}

module.exports = Game;