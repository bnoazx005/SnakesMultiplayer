var Chai   = require("chai");
var expect = Chai.expect;
var Game = require("./../../../application/modules/game/game");
var Vector2d = require("./../../../application/modules/math/vector2d");
var md5 = require("md5");


describe('GameTests', function() {
	it("AddPlayer tests", function() {
		var gameInstance = new Game(new Vector2d(0, 0), new Vector2d(20, 20), 20, 3);

		var playerName = "player";

		var result = gameInstance.AddPlayer("red", playerName);

		expect(result.status).to.equals("ok");

		var playerData = result.data;

		expect(playerData).to.have.property("playerId");
		expect(playerData).to.have.property("playerHash");
	});

	it("RemovePlayer tests", function() {
		var gameInstance = new Game(new Vector2d(0, 0), new Vector2d(20, 20), 20, 3);

		var playerName = "player";

		var result = gameInstance.AddPlayer("red", playerName);

		expect(result.status).to.equals("ok");

		var playerData = result.data;

		var incorrectPlayerData = { 
			"playerId" : playerData.playerId,
			"playerHash" : md5(playerName + 1)
		};

		expect(gameInstance.RemovePlayer(incorrectPlayerData).status).to.equals("fail");
		expect(gameInstance.RemovePlayer(playerData).status).to.equals("ok");
	});
});