function View() {
	var EVENT_TYPES = {
		ON_LOGIN : "onlogin",
		ON_RESTART : "onrestart"
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

	var mPlayerUIRoot       = null;

	var mPlayerUIScore      = null;

	var mRestartButton      = null;

	this.Free = function() {
		mLoginButton.removeEventListener("click", _loginButtonClicked);
		mRestartButton.removeEventListener("click", _restartButtonClicked);
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

		var currSnake     = null;
		var currSnakeBody = null;

		for (var snakeId in snakes) {
			currSnake = snakes[snakeId];

			currSnakeBody = currSnake.body;

			for (var j = 0; j < currSnakeBody.length; ++j) {
				mRenderInstance.DrawQuad(new Vector2D(currSnakeBody[j].x, currSnakeBody[j].y), mZoomCoeff, currSnake.color);
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

	this.UpdateUI = function(data) {
		var playerScore = data.score;

		mPlayerUIScore.innerHTML = playerScore;
	};

	this.SetActivePlayerUI = function(value) {
		switch (value) {
			case true:
				if (mPlayerUIRoot.classList.contains("inactive")) {
					mPlayerUIRoot.classList.remove("inactive");
				}
				break;
			case false:
				if (!mPlayerUIRoot.classList.contains("inactive")) {
					mPlayerUIRoot.classList.add("inactive");
				}
				break;
		}
	};

	var _loginButtonClicked = function(eventData) {
		self.Notify(EVENT_TYPES.ON_LOGIN, mLoginTextbox.value);
	};

	var _restartButtonClicked = function(eventData) {
		self.Notify(EVENT_TYPES.ON_RESTART, {});
	};

	function _init() {
		mSubscribers = [];

		for (var key in EVENT_TYPES) {
			mSubscribers[EVENT_TYPES[key]] = [];
		}

		mPages = {};

		mLoginButton = document.getElementById("login-button");

		mRestartButton = document.getElementById("restart-button");

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
		mRestartButton.addEventListener("click", _restartButtonClicked);

		mScoreLabel = document.getElementById("score-label");

		mPlayerUIRoot = document.getElementById("player-ui-div");

		mPlayerUIScore = document.getElementById("current-score-label");

		self.SetActivePlayerUI(false);
	}	

	_init();
}