var Chai   = require("chai");
var expect = Chai.expect;
var GameStructures = require("./../../../application/modules/game/gameStructures");
var Vector2D = require("./../../../application/modules/math/vector2D");


var _areArraysSame = function(arr1, arr2, comparator) {
	if (!Array.isArray(arr1) || 
		!Array.isArray(arr2) ||
		comparator === undefined) {
		return false;
	}

	var arr1Length = arr1.length;
	var arr2Length = arr2.length;

	if (arr1Length != arr2Length) {
		return false;
	}

	for (var i = 0; i < arr1Length; ++i) {
		if (!comparator(arr1[i], arr2[i])) {
			return false;
		}
	}

	return true;
};

describe('GameStructuresTests', function() {
	describe('SnakeTests', function() {
		it("Snake's constructor test", function() {
			var snakeParams = {
				body :  [new Vector2D(0, 0), new Vector2D(1, 0)],
				name : "snake",
				color : "red"
			};

			var snakeConstructed = new GameStructures.Snake(snakeParams.body, GameStructures.MOVE_DIRECTIONS.UP, snakeParams.color, snakeParams.name);

			expect(snakeConstructed.mBody).to.equals(snakeParams.body);
			expect(snakeConstructed.mName).to.equals(snakeParams.name);
			expect(snakeConstructed.mColor).to.equals(snakeParams.color);
		});

		it("Snake's eat test", function() {
			var snakeParams = {
				body :  [new Vector2D(0, 0), new Vector2D(1, 0)],
				name : "snake",
				color : "red"
			};

			var expectedLength = snakeParams.body.length;

			var snake = new GameStructures.Snake(snakeParams.body, GameStructures.MOVE_DIRECTIONS.UP, snakeParams.color, snakeParams.name);

			var food = new GameStructures.Food(new Vector2D(0, 0), GameStructures.FOOD_TYPES.FOOD, 1);

			expect(snake.mScore).to.equals(0);

			snake.Eat(food); //after call of Eat method the food will be stored in mFood of Snake, so snake.Move() will increase its size later

			expect(snake.mBody.length).to.equals(expectedLength);
			expect(snake.mScore).to.equals(food.mWeight); 

			snake.Move(); // the snake moves up

			expect(snake.mBody.length).to.equals(expectedLength + 1);
		});

		it("Snake's die test", function() {
			var snakeParams = {
				body :  [new Vector2D(0, 0), new Vector2D(1, 0)],
				name : "snake",
				color : "red"
			};

			var snake = new GameStructures.Snake(snakeParams.body, GameStructures.MOVE_DIRECTIONS.UP, snakeParams.color, snakeParams.name);

			expect(snake.Die()).to.equals(snakeParams.body);
			expect(snake.mIsDead).to.equals(true);
		});

		it("Snake's cut test", function() {
			var snakeParams = {
				body :  [new Vector2D(0, 0), new Vector2D(1, 0), new Vector2D(1, -1)],
				name : "snake",
				color : "red"
			};

			var snake = new GameStructures.Snake(snakeParams.body, GameStructures.MOVE_DIRECTIONS.UP, snakeParams.color, snakeParams.name);

			var currLength = snakeParams.body.length;

			var bodyCopy = snakeParams.body.slice();

			expect(_areArraysSame(snakeParams.body, bodyCopy, Vector2D.Equals)).to.equals(true);

			console.log(snake.Cut(bodyCopy[1]));
			// for (var i = currLength - 1; i >= 0; --i) {
			// 	expect(_areArraysSame(snake.Cut(snakeParams.body[i]), bodyCopy.slice(i), Vector2D.Equals), "iteration: " + i).to.equals(true);
			// }
		});

		it("Snake's changeDirection test", function() {
			var snakeParams = {
				body :  [new Vector2D(0, 0), new Vector2D(1, 0)],
				name : "snake",
				color : "red"
			};

			var snake = new GameStructures.Snake(snakeParams.body, GameStructures.MOVE_DIRECTIONS.UP, snakeParams.color, snakeParams.name);

			for (var dir in GameStructures.MOVE_DIRECTIONS) {
				expect(snake.ChangeDirection(dir)).to.equals(GameStructures.MOVE_DIRECTIONS.UP ? false : true);
			}
		});
	});
});