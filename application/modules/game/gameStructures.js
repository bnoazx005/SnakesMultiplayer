var Vector2D = require("./../math/vector2d");

var ExportedObject = {};

ExportedObject.Scene = function(origin, sizes) {
	this.mOrigin = origin instanceof Vector2D ? origin : new Vector2D(0, 0);
	this.mSizes  = sizes instanceof Vector2D ? sizes : new Vector2D(20, 20);
};

ExportedObject.Intersectable = function() {
	this.Intersect = function(intersectable) {
		return false;
	};

	this.GetBlocks = function() {
		return [];
	};
};

ExportedObject.FOOD_TYPES = {
	FOOD : "food",
	SNAKE : "snake"
};

ExportedObject.Food = function(pos, type, weight) {
	var self = new ExportedObject.Intersectable(); // Food derives Intersectable

	self.mPos    = pos instanceof Vector2D ? pos : new Vector2D(0, 0);
	self.mType   = type || ExportedObject.FOOD_TYPES.FOOD;
	self.mWeight = weight || 1;

	self.Intersect = function(intersectable) {
		var intersectableBlocks = intersectable.GetBlocks();

		var intersectableBlocksLength = intersectableBlocks.length;

		for (var i = 0; i < intersectableBlocksLength; ++i) {
			if (Vector2D.Equals(self.mPos, intersectableBlocks[i])) {
				return true;
			}
		}

		return false;
	};

	self.GetBlocks = function() {
		return [self.mPos];
	};

	return self;
};

ExportedObject.MOVE_DIRECTIONS = {
	LEFT : new Vector2D(-1, 0),
	RIGHT : new Vector2D(1, 0),
	UP : new Vector2D(0, 1),
	DOWN : new Vector2D(0, -1)
};

ExportedObject.Snake = function(body, initialDir, color, name) {
	var self = new ExportedObject.Intersectable(); //Snake derives Intersectable

	self.mColor  = 0;
	self.mName   = null;
	self.mBody   = null; //head is stored in 0 cell of the array
	self.mScore  = 0;
	self.mIsDead = false;

	var mFood    = null; //the stack that contains eaten food
	var mCurrDir = null;

	self.Cut = function(cutPoint, isSelfEating) {
		var index = -1;

		isSelfEating = isSelfEating || false;

		//if the situation is a self-eating we should skip a head cell
		//because right now it has the same position as cut point
		for (var i = isSelfEating ? 1 : 0; i < self.mBody.length; ++i) {
			if (Vector2D.Equals(self.mBody[i], cutPoint)) {
				index = i;

				break;
			}
		}

		console.log(index);
		
		if (index == 0 && self.mBody.length == 1) {
			return self.Die();
		}

		var cutBodyPart = self.mBody.slice(index); //cut part of a body

		self.mBody = self.mBody.slice(0, index); // cut the current snake's body

		return cutBodyPart;
	};

	self.Move = function() {
		var bodyLength = self.mBody.length;

		if (mFood.length > 0) { //we have eaten food, so move a new created body's part not the tail
			var headPart = self.mBody[0];

			var newBodyPart = Vector2D.Sum(headPart, mCurrDir);

			//insert a new body part before the head
			self.mBody.unshift(newBodyPart);

			mFood.pop();

			//check self-intersection
			var collisionPoint = -1;

			if ((collisionPoint = _checkCollision()) >= 0) {	//self-intersected
				return self.Cut(self.mBody[collisionPoint], true);
			}

			return null;
		}

		if (bodyLength == 1) {
			self.mBody[0] = Vector2D.Sum(self.mBody[0], mCurrDir);

			return null;
		}

		var newHeadPart = Vector2D.Sum(self.mBody[0], mCurrDir); //move it

		self.mBody.pop(); //remote tail
		self.mBody.unshift(newHeadPart); //insert a new head

		//check self-intersection
		var collisionPoint = -1;

		if ((collisionPoint = _checkCollision()) >= 0) {	//self-intersected
			return self.Cut(self.mBody[collisionPoint], true);
		}

		return null;
	};

	self.ChangeDirection = function(dir) {
		if (!(dir instanceof Vector2D)) {
			return false;
		}

		// the current movement direction is opposite to the specified one
		// in this case the snake will move without changing previous direction's value
		// in other words we should prevent a snake's reversing
		if (mCurrDir != null && Math.abs(Vector2D.Dot(mCurrDir, dir) + 1) < 0.001) { 
			return false;
		}

		mCurrDir = dir;

		return true;
	};

	self.Eat = function(food) {
		self.mScore += food.mWeight;

		mFood.push(food);
	};

	self.Die = function() {
		self.mIsDead = true;

		return self.mBody;
	};

	self.Intersect = function(intersectable) {
		var intersectableBlocks = intersectable.GetBlocks();

		var intersectableBlocksLength = intersectableBlocks.length;
		var bodyLength                = self.mBody.length;

		for (var i = 0; i < bodyLength; ++i) {
			for (var j = 0; j < intersectableBlocksLength; ++j) {
				if (Vector2D.Equals(self.mBody[i], intersectableBlocks[j])) {
					return true;
				}
			}
		}

		return false;
	};

	self.GetBlocks = function() {
		return self.mBody;
	};

	var _checkCollision = function() {
		var head = self.mBody[0];

		for (var i = 1; i < self.mBody.length; ++i) {
			if (Vector2D.Equals(head, self.mBody[i])) {
				return i;
			}
		}

		return -1;
	};

	function _init() {
		self.mColor = color || "green";
		self.mName  = name;
		self.mBody  = body;
		
		mFood  = [];

		mCurrDir = initialDir instanceof Vector2D ? initialDir : ExportedObject.MOVE_DIRECTIONS.RIGHT;
	}

	_init();

	return self;
};


module.exports = ExportedObject;