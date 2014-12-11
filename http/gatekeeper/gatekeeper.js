// gatekeeper.js

var log = require('../../common/logger.js')('gatekeeper');
var basicauth = require('./basicauth.js');
var db = require('./db.js');

function status(msg) {
	return {
		status : msg
	};
}

var deny = function(res, msg, setheader) {
	res.setHeader("Content-Type", "application/json");
	setheader(res);

	if(msg) {
		res.end(JSON.stringify(msg));
	} else {
		res.end();
	}
}

var headers = {
	noauth : function(res) {
		res.statusCode = 401;
		res.setHeader("WWW-Authenticate", "Basic realm='DocumentRelay.gatekeeper'");
	},
	nopermit : function(res) {
		res.statusCode = 403;
	}
};

var authenticate = function(req, res, next) {
	db.getuser(req.user.name, req.user.pass, function(authuser) {
		if(authuser) {
			switch(authuser.length) {
				case 0 :
					deny(res, status('invalid username or password'), headers.noauth);
					break;
				case 1 :
					req.user = authuser[0];
					authorize(req, res, next);
					break;
				default :
					deny(res, status('gatekeeper returned more than one entity, please contact admin'), headers.noauth);
					break;
			}
		}
	});
};

var authorize = function(req, res, next) {
	var reqtype = req.params.datatype;
	var role = req.user.role;
	var permit = req.user.permit;

	if(role.indexOf('admin') + role.indexOf('user') == -2) {
		deny(res, status('access not provided for role(s) ' + JSON.stringify(role)), headers.noauth);
	} else {
		if(permit.indexOf(reqtype) + permit.indexOf('*') == -2) {
			deny(res, status('access not permitted, available endpoints are ' + JSON.stringify(permit)), headers.nopermit);
		} else {
			return next();
		}
	}
};

module.exports.frisk = function(authtype) {
	return function(req, res, next) {
		var user = basicauth.user(req);

		if(!user || user == undefined) {
			return deny(res, null, headers.noauth);
		} else {
			req.user = user;
			authenticate(req, res, next);
		}
	};
};