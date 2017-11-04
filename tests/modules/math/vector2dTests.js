var Chai   = require("chai");
var expect = Chai.expect;
var Vector2D = require("./../../../application/modules/math/vector2D");

describe('MathTests', function() {
	describe('Vector2DTests', function() {
		it("Vector2D constructor test", function() {
			var vec2D = new Vector2D(4, 2);

			expect(vec2D.x).to.equals(4);
			expect(vec2D.y).to.equals(2);
		});

		it("Vector2D constructor without params test", function() {
			var vec2D = new Vector2D();

			expect(vec2D.x).to.equals(0);
			expect(vec2D.y).to.equals(0);
		});

		it("Vector2D GetLength() test", function() {
			var samples = [
				{
					vector: new Vector2D(1, 0),
					length: 1
				},
				{
					vector: new Vector2D(1, -1),
					length: Math.sqrt(2)
				},
			];

			for (var i = 0; i < samples.length; ++i) {
				expect(samples[i].vector.GetLength()).to.equals(samples[i].length);
			}
		});

		it("Vector2D Equals() test", function() {
			var samples = [
				{
					first: new Vector2D(5, 0),
					second: new Vector2D(5, 0),
					expectedResult: true
				},
				{
					first: new Vector2D(1, -1),
					second: new Vector2D(1, -0.9999),
					expectedResult: true
				},
				{
					first: new Vector2D(0, 0),
					second: new Vector2D(1, -0.99),
					expectedResult: false
				},
			];

			for (var i = 0; i < samples.length; ++i) {
				expect(Vector2D.Equals(samples[i].first, samples[i].second), "iter= " + i).to.equals(samples[i].expectedResult);
			}
		});

	});
});