// heartbeat.js

function Keepalive() {
	return {
		type : 'ka',
		date : new Date().toISOString().replace(/[0-9]{3}[Z]/, '000Z'),
		msg : {}
	}
}

module.exports = Keepalive;