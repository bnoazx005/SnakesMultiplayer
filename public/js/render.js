function Render(canvas) {
	var mCanvasInstance = null;
	var mCanvasContext  = null;

	this.DrawQuad = function(pos, size, color) {
		if (!(pos instanceof Vector2D) ||
			isNaN(size - 0)) {
			return;
		}

		size = Math.floor(size);

		var hSize = 0.5 * size;

		mCanvasContext.fillStyle = color;

		mCanvasContext.fillRect(pos.x - hSize, pos.y - hSize, size, size);
	};

	this.DrawSprite = function(image, pos, size, color) {
		if (image == undefined ||
			!(pos instanceof Vector2D) ||
			isNaN(size - 0)) {
			return;
		}

		size = Math.floor(size);

		var hSize = 0.5 * size;

		mCanvasContext.fillStyle = color;
		mCanvasContext.drawImage(image, pos.x - hSize, pos.y - hSize, size, size);
	};

	this.BeginBatch = function() {
		mCanvasContext.beginPath();
	};

	this.EndBatch = function(isFilled) {
		if (isFilled) {
			mCanvasContext.fill();

			return;
		}

		mCanvasContext.stroke();
	};

	this.Clear = function(color) {
		mCanvasInstance.fillStyle = color;
		mCanvasContext.fillRect(0, 0, mCanvasInstance.width, mCanvasInstance.height);
	};

	function _init() {
		mCanvasInstance = canvas;
		mCanvasContext  = canvas.getContext("2d");
	}

	_init();
}