// logger.js

module.exports = function(module) {
	var header = function(type) {
		return new Date().toString() + ' [' + module + ', ' + type + '] - ';
	};

	return {
		info : function(data) {
			console.log(header('info') + data);
		},
		warn : function(data) {
			console.log(header('warning') + data);
		},
		error : function(data) {
			console.log(header('error') + data);
		}
	};
};