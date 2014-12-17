// gatekeeper.js

var log = require('../../common/logger.js')('gatekeeper');
var basicauth = require('./basicauth.js');
var db = require('./db.js');

Array.prototype.allow = function(datatype) {
	return (this.indexOf(datatype) + this.indexOf('*')) > -2;
};

var deny = function(res, msg, setheader) {
	res.setHeader("Content-Type", "application/json");
	setheader(res);

	if(msg) {
		res.end(JSON.stringify(msg));
	} else {
		res.end();
	}
};

var headers = {
	noauth : function(res) {
		res.statusCode = 401;
		res.setHeader("WWW-Authenticate", "Basic realm='Document Relay'");
	},
	nopermit : function(res) {
		res.statusCode = 403;
	}
};

module.exports.frisk = function(authtype) {
	return function(req, res, next) {
		var user = basicauth.user(req);

		if(!user || user == undefined)
			return deny(res, null, headers.noauth);

		db.getuser(user.name, user.pass, function(authuser) {
			if(authuser) {
				switch(authuser.length) {
					case 0 :
						deny(res, { status : 'access denied' }, headers.noauth);
						break;
					case 1 :
						authuser = authuser[0];

						if(authtype == null || authuser.role.allow(authtype)) {
							if(authuser.root.allow(req.params.path) && authuser.permit.allow(req.params.datatype)) {
								req.user = authuser;
								return next();
							} else {
								deny(res, { status : 'access denied, permitted paths = ' + JSON.stringify(root) + '/' + JSON.stringify(permit) }, headers.nopermit);
							}
						} else {
							deny(res, { status : 'access denied, inadequate account level' }, headers.noauth)
						}
						
						break;
					default :
						deny(res, { status : 'returned more than one entity, please contact admin' }, headers.noauth);
						break;
				}
			}
		});
	}
};