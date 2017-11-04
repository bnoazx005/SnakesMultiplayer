var GameStuctures = require("./gameStructures");
var Vector2D = require("./../math/vector2d");

function Game() {
	var snake = new GameStuctures.Snake([new Vector2D(0, 0), new Vector2D(1, 0)], GameStuctures.MOVE_DIRECTIONS.UP, "red", "snake");

	console.log("init");
	console.log(snake.mBody);

	snake.Move();
	console.log("step:");
	console.log(snake.mBody);

	snake.Eat(new GameStuctures.Food(new Vector2D(0, 0), GameStuctures.FOOD_TYPES.FOOD, 1));
	snake.ChangeDirection(GameStuctures.MOVE_DIRECTIONS.RIGHT);
	snake.Move();
	console.log("step:");
	console.log(snake.mBody);

	snake.Eat(new GameStuctures.Food(new Vector2D(0, 0), GameStuctures.FOOD_TYPES.FOOD, 1));
	snake.ChangeDirection(GameStuctures.MOVE_DIRECTIONS.DOWN);
	snake.Move();
	console.log("step:");
	console.log(snake.mBody);

	snake.Eat(new GameStuctures.Food(new Vector2D(0, 0), GameStuctures.FOOD_TYPES.FOOD, 1));
	snake.ChangeDirection(GameStuctures.MOVE_DIRECTIONS.DOWN);
	snake.Move();
	console.log("step:");
	console.log(snake.mBody);

	snake.Eat(new GameStuctures.Food(new Vector2D(0, 0), GameStuctures.FOOD_TYPES.FOOD, 1));
	snake.ChangeDirection(GameStuctures.MOVE_DIRECTIONS.UP);
	snake.Move();
	console.log("step:");
	console.log(snake.mBody);
}

module.exports = Game;