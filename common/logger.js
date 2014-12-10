// logger.js
var BLOCK = 22;

module.exports = function(module) {
	if(module.length > BLOCK) {
	    module = module.substring(0, BLOCK - 4) + "...";
	}

	var header = function(type) {
		return new Date().toISOString().replace(/[T]|[Z]/g, ' ') + ' [' + 
			module + Array(BLOCK - module.length).join("-") + 
			type + '] - ';
	};

	return {
		info : function(data) {
			console.log(header('info') + data);
		},
		warn : function(data) {
			console.log(header('warn') + data);
		},
		error : function(data) {
			console.log(header('err') + data);
		}
	};
};