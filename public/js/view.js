function View() {
	var EVENT_TYPES = {
		ON_LOGIN : "onlogin",
	};

	var PAGES = {
		LOGIN_PAGE : "login_page",
		GAME_OVER_PAGE : "gameover_page",
		INGAME_PAGE : "ingame_page"
	};

	var self                = this;

	var mSubscribers        = null;

	var mLoginButton        = null;

	var mLoginTextbox       = null;

	var mGameFieldCanvas    = null;

	var mRenderInstance     = null;

	var mPages              = null;

	var mCurrActivePageName = null;

	var mScoreLabel         = null;

	var mZoomCoeff          = 10;

	this.Free = function() {

	};

	this.GetPagesNames = function() {
		return PAGES;
	};

	this.Subscribe = function(eventType, callback) {
		var eventSubscribers = mSubscribers[eventType];

		if (eventSubscribers && callback instanceof Function) {
			eventSubscribers.push(callback);

			console.log("A new subscriber was added to " + eventType + " event");
		}
	};

	this.Notify = function(eventType, data) {
		var eventSubscribersArray = null;

		if (eventSubscribersArray = mSubscribers[eventType]) {
			var callback = null;

			for (var i = 0; i < eventSubscribersArray.length; ++i) {
				callback = eventSubscribersArray[i];

				if (!(callback instanceof Function)) {
					continue;
				}

				callback(data);

				console.log("The data was sent to all subscribers" + "(" + eventType + ")" + ", data: " +  data);
			}
		}
	};

	this.GetEventsTypes = function() {
		return EVENT_TYPES;
	};

	this.EnablePage = function(pageName) {
		if (mCurrActivePageName != undefined) {
			self.DisablePage(mCurrActivePageName);
		}

		if (mCurrActivePageName == PAGES.INGAME_PAGE) {
			return;
		}

		if (mPages[pageName] && mPages[pageName].classList.contains("inactive")) {
			mPages[pageName].classList.remove("inactive");

			mCurrActivePageName = pageName;
		}
	};

	this.DisablePage = function(pageName) {
		if (pageName == PAGES.INGAME_PAGE) {
			return;
		}

		if (mPages[pageName] && !mPages[pageName].classList.contains("inactive")) {
			mPages[pageName].classList.add("inactive");
		}
	}

	this.Render = function(dataPacket) {
		mRenderInstance.Clear();

		var food = dataPacket.food;

		for (var i = 0; i < food.length; ++i) {
			mRenderInstance.DrawQuad(new Vector2D(food[i].x, food[i].y), mZoomCoeff, "red");
		}

		var snakes = dataPacket.snakes;

		for (var snakeId in snakes) {
			var currSnake = snakes[snakeId];

			for (var j = 0; j < currSnake.length; ++j) {
				mRenderInstance.DrawQuad(new Vector2D(currSnake[j].x, currSnake[j].y), mZoomCoeff, "green");
			}
		}
	};

	this.Resize = function(width, height) {
		mGameFieldCanvas.width = width;
		mGameFieldCanvas.height = height;
	};

	this.ShowGameOverScore = function(score) {
		self.EnablePage(PAGES.GAME_OVER_PAGE);

		mScoreLabel.innerHTML = score;
	};

	this.SetZoomCoefficient = function(zoomCoeff) {
		mZoomCoeff = Math.max(Config.MinZoomValue, Math.min(Config.MaxZoomValue, zoomCoeff));
	};

	this.GetZoomCoefficient = function() {
		return mZoomCoeff;
	};

	var _loginButtonClicked = function(eventData) {
		self.Notify(EVENT_TYPES.ON_LOGIN, mLoginTextbox.value);
	};

	function _init() {
		mSubscribers = [];

		for (var key in EVENT_TYPES) {
			mSubscribers[EVENT_TYPES[key]] = [];
		}

		mPages = {};

		mLoginButton = document.getElementById("login-button");

		mLoginTextbox = document.getElementById("login-textbox");

		mPages[PAGES.LOGIN_PAGE]     = document.getElementById("login-page-div");
		mPages[PAGES.GAME_OVER_PAGE] = document.getElementById("game-over-div");

		for (var pageName in mPages) {
			self.DisablePage(pageName);
		}

		self.EnablePage(PAGES.LOGIN_PAGE);

		mGameFieldCanvas = document.getElementById("game-field-canvas");

		mRenderInstance = new Render(mGameFieldCanvas);

		mLoginButton.addEventListener("click", _loginButtonClicked);

		mScoreLabel = document.getElementById("score-label");
	}	

	_init();
}