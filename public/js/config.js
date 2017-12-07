var Config = (function() {
	var mExports = {};

	mExports.INPUT_ACTION_BINDINGS = {
		LEFT     : 37,
		UP       : 38,
		RIGHT    : 39,
		DOWN     : 40,
		ZOOM_IN  : navigator.userAgent.search("Firefox") > -1 ? 61 : 187, //should be tested more
		ZOOM_OUT : navigator.userAgent.search("Firefox") > -1 ? 173 : 189 //and why the browsers use different key codes?!
	};

	mExports.ZoomStep = 5;

	mExports.MinZoomValue = 5;

	mExports.MaxZoomValue = 30;

	mExports.ColorsArray = [
		"green",
		"blue",
		"yellow",
		"pink",
		"purple"
	];

	return mExports;
})();