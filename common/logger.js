// logger.js
var BLOCK = 32;

module.exports = function(logname, onwrite) {
	if(logname.length > BLOCK) {
	    logname = logname.substring(0, BLOCK - 4) + "...";
	}

	var color = {
		grey : '\u001b[39m',
		green : '\u001b[32m',
		yellow : '\u001b[33m',
		red : '\u001b[31m'
	};

	var levelcolor = {
		info : color.green,
		warn : color.yellow,
		err : color.red
	};

	var colorize = function(level) {
		return levelcolor[level] + level + color.grey;
	};

	var header = function(type) {
		var len = logname.length + type.length;

		if(len > BLOCK - 1) {
			logname = logname.slice(0, (BLOCK -1) - len);
			len = logname.length + type.length;
		}

		var ret = new Date().toISOString().replace(/[T]|[Z]/g, ' ') + '[' + 
			logname + Array((BLOCK + 1) - len).join("-") +
			type + '] : ';

		return ret;
	};

	var write = function(data, level) {
		if(onwrite && typeof onwrite == 'function') {
			onwrite(header(level) + data);
		} else {
			console.log(header(colorize(level)) + data);
		}
	};

	var ret = {
		info : function(data) {
			write(data, 'info');
		},
		warn : function(data) {
			write(data, 'warn');
		},
		error : function(data) {
			write(data, 'err');
		}
	};

	return ret;
};