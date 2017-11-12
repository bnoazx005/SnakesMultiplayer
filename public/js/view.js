function View() {
	var EVENT_TYPES = {
		ON_LOGIN : "onlogin",
	};

	var self          = this;

	var mSubscribers  = null;

	var mLoginButton  = null;

	var mLoginTextbox = null;

	var mLoginPage    = null;

	this.Free = function() {

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

	this.EnableLoginPage = function() {
		if (mLoginPage && mLoginPage.classList.contains("inactive")) {
			mLoginPage.classList.remove("inactive");
		}
	};

	this.DisableLoginPage = function() {
		if (mLoginPage && !mLoginPage.classList.contains("inactive")) {
			mLoginPage.classList.add("inactive");
		}
	}

	var _loginButtonClicked = function(eventData) {
		self.Notify(EVENT_TYPES.ON_LOGIN, mLoginTextbox.value);
	};

	function _init() {
		mSubscribers = [];

		for (var key in EVENT_TYPES) {
			mSubscribers[EVENT_TYPES[key]] = [];
		}

		mLoginButton = document.getElementById("login-button");

		mLoginTextbox = document.getElementById("login-textbox");

		mLoginPage = document.getElementById("login-page-div");

		mLoginButton.addEventListener("click", _loginButtonClicked);
	}	

	_init();
}