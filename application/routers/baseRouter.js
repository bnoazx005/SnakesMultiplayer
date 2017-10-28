function CBaseRouter() {
	var ERROR = {
		2000: 'Parameters are not numbers',
		2001: 'There is no a solution of the equation',
		2002: 'A leading coefficient cannot equal to zero',
		2003: "There is no a coefficients' list",
		2004: "An amount of coefficients doesn't correspond to an equation's type",
		3000: "An incorrect type of the equation",
		3001: "A type of an equation should be an integer value",
		4000: "All vectors should have a same dimension",
		4001: "The addition operation is not commutative",
		4002: "The addition operation is not associative",
		4003: "There is no a zero vector in the space",
		4004: "There is no an inverse vector for one or several vectors",
		4005: "The operation of scalar multiplication is not compatible",
		4006: "Incorrect multiplication by identity scalar",
		4007: "There is no a distributivity of scalar multiplication with respect to vector addition",
		4008: "There is no a distributivity of scalar multiplication with respect to field addition",
		4009: "Couldn't parse an input vectors sequence",
		4010: "An amount of input vectors doesn't correspond to the specified parameter",
		4011: "An incorrect (or didn't) specified addition's operator",
		4012: "An incorrect (or didn't) specified multiplication's operator",
		9000: 'An undefined error',
		404:  'The page not found'
	};

	this.answer = function(data) {
		return {
			result: 'ok',
			data: data,
		};
	};

	this.error = function(code) {
		var error = (code && ERROR[code]) ? { code: code, text: ERROR[code] } : { code: 9000, text: ERROR[9000] } ;
		return {
			result: 'error',
			error: error,
		};
	};
}

module.exports = CBaseRouter;