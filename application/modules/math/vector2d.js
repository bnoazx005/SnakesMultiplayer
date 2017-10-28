function Vector2D(x, y) {
	this.x = x - 0 || 0;
	this.y = y - 0 || 0;

	this.GetLength = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};

	this.Normalize = function() {
		var invLength = 1.0 / Math.sqrt(this.x * this.x + this.y * this.y);

		this.x *= invLength;
		this.y *= invLength;
	};
};

Vector2D.Sum = function(a, b) {
	if (!(a instanceof Vector2D) || !(b instanceof Vector2D)) {
		return NaN;
	}

	return new Vector2D(a.x + b.x, a.y + b.y);
};

Vector2D.Sub = function(a, b) {
	if (!(a instanceof Vector2D) || !(b instanceof Vector2D)) {
		return NaN;
	}

	return new Vector2D(a.x - b.x, a.y - b.y);
};

Vector2D.Mul = function(a, scalar) {
	if (!(a instanceof Vector2D)) {
		return NaN;
	}

	scalar = scalar - 0;

	if (isNaN(scalar)) {
		return scalar;
	}

	return new Vector2D(a.x * scalar, a.y * scalar);
};

Vector2D.Dot = function(a, b) {
	if (!(a instanceof Vector2D) || !(b instanceof Vector2D)) {
		return NaN;
	}

	return a.x * b.x + a.y * b.y;
};

Vector2D.Equals = function(a, b) {
	if (!(a instanceof Vector2D) || !(b instanceof Vector2D)) {
		return false;
	}

	if ((Math.abs(a.x - b.x) > 0.001) || (Math.abs(a.y - b.y) > 0.001)) {
		return false;
	}

	return true;
};

module.exports = Vector2D;