var Config = (function() {
	var mExports = {};

	mExports.INPUT_ACTION_BINDINGS = {
		LEFT     : 37,
		UP       : 38,
		RIGHT    : 39,
		DOWN     : 40,
		ZOOM_IN  : 61,
		ZOOM_OUT : 173
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