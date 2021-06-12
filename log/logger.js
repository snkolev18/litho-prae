const seq = require("seq-logging");

class Logger {
	constructor() {
		this.logger = new seq.Logger({ serverUrl: "http://localhost:5341" });
	}

	logRegisteredUser(username, fullCredentials) {
		this.logger.emit({
			timestamp: new Date(),
			level: "Information",
			messageTemplate: "New user {username} has been registered!!!",
			properties: {
				username: username,
				credentials: fullCredentials
			}
		});
	}
}

exports.Logger = Logger;
