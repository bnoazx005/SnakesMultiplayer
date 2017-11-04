var Chai   = require("chai");
var expect = Chai.expect;
var GameStructures = require("./../../../application/modules/game/gameStructures");


describe('GameStructuresTests', function() {
	describe('SnakeTests', function() {
		it("Check Snake's constructor", function() {
			var snake = new GameStuctures.Snake([new Vector2D(0, 0), new Vector2D(1, 0)], GameStuctures.MOVE_DIRECTIONS.UP, "red", "snake");
		});
	});
});