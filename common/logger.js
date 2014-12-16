// logger.js
var BLOCK = 22;

module.exports = function(logname) {
	if(logname.length > BLOCK) {
	    logname = logname.substring(0, BLOCK - 4) + "...";
	}

	var color = {
		grey : '\u001b[39m',
		green : '\u001b[32m',
		yellow : '\u001b[33m',
		red : '\u001b[31m'
	}

	var header = function(type) {
		return new Date().toISOString().replace(/[T]|[Z]/g, ' ') + ' [' + 
			logname + Array(BLOCK - (logname.length + type.length)).join("-") + 
			type + color.grey + '] : ';
	};

	return {
		info : function(data) {
			console.log(header(color.green + 'info') + data);
		},
		warn : function(data) {
			console.log(header(color.yellow + 'warn') + data);
		},
		error : function(data) {
			console.log(header(color.red + 'err') + data);
		}
	};
};