var Vector2D = require("./../math/vector2d");

var ExportedObject = {};

ExportedObject.Scene = function(origin, sizes) {
	this.mOrigin = origin instanceof Vector2D ? origin : new Vector2D(0, 0);
	this.mSizes  = sizes instanceof Vector2D ? sizes : new Vector2D(20, 20);
};

ExportedObject.FOOD_TYPES = {
	FOOD : "food",
	SNAKE : "snake"
};

ExportedObject.Food = function(pos, type, weight) {
	this.mPos    = pos instanceof Vector2D ? pos : new Vector2D(0, 0);
	this.mType   = type || ExportedObject.FOOD_TYPES.FOOD;
	this.mWeight = weight || 1;
};

ExportedObject.MOVE_DIRECTIONS = {
	LEFT : new Vector2D(-1, 0),
	RIGHT : new Vector2D(1, 0),
	UP : new Vector2D(0, 1),
	DOWN : new Vector2D(0, -1)
};

ExportedObject.Snake = function(body, initialDir, color, name) {
	var self = this;

	this.mColor  = 0;
	this.mName   = null;
	this.mBody   = null; //head is stored in 0 cell of the array
	this.mScore  = 0;
	this.mIsDead = false;

	var mFood    = null; //the stack that contains eaten food
	var mCurrDir = null;

	this.Cut = function(cutPoint) {
		var index = -1;

		for (var i = 0; i < this.mBody.length; ++i) {
			if (Vector2D.Equals(this.mBody[i], cutPoint)) {
				index = i;

				break;
			}
		}
		
		if (index == 0 && this.mBody.length == 1) {
			return this.Die();
		}

		var cutBodyPart = this.mBody.slice(index); //cut part of a body

		this.mBody = this.mBody.slice(0, index); // cut the current snake's body

		return cutBodyPart;
	};

	this.Move = function() {
		var bodyLength = this.mBody.length;

		if (mFood.length > 0) { //we have eaten food, so move a new created body's part not the tail
			var headPart = this.mBody[0];

			var newBodyPart = Vector2D.Sum(headPart, mCurrDir);

			//insert a new body part before the head
			this.mBody.unshift(newBodyPart);

			mFood.pop();

			//check self-intersection
			var collisionPoint = -1;

			if ((collisionPoint = _checkCollision()) >= 0) {	//self-intersected
				return this.Cut(this.mBody[collisionPoint]);
			}

			return null;
		}

		if (bodyLength == 1) {
			this.mBody[0] = Vector2D.Sum(this.mBody[0], mCurrDir);

			return null;
		}

		var newHeadPart = Vector2D.Sum(this.mBody[0], mCurrDir); //move it

		this.mBody.pop(); //remote tail
		this.mBody.unshift(newHeadPart); //insert a new head

		//check self-intersection
		var collisionPoint = -1;

		if ((collisionPoint = _checkCollision()) >= 0) {	//self-intersected
			return this.Cut(this.mBody[collisionPoint]);
		}

		return null;
	};

	this.ChangeDirection = function(dir) {
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

	this.Eat = function(food) {
		this.mScore += food.mWeight;

		mFood.push(food);
	};

	this.Die = function() {
		this.mIsDead = true;

		return this.mBody;
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
};


module.exports = ExportedObject;