const bunyan = require("bunyan");
const seq = require("bunyan-seq");

const log = bunyan.createLogger({
	name: "litho-prae",
	streams: [
		{
			stream: process.stdout,
			level: "warn"
		},
		seq.createStream({
			serverUrl: "http://localhost:5341",
			level: "info",
			type: "stream"
		})
	]
});


module.exports.log = log;
