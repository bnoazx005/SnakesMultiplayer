var express = require('express');
var router  = express.Router();

var baseRouter = require('./baseRouter');

var baseRouterInstance = new baseRouter();

router.get("/*", function (req, res) {
	res.send(baseRouterInstance.error(404));
});

module.exports = router;