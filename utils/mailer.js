const mailer = require("nodemailer");
require("dotenv").config();

class Mailer {
	constructor() {
		this.#configuration = {
			host: process.env.gmailHost,
			port: process.env.smtpPort,
			secure: true,
			auth: {
				user: process.env.gmailEmail,
				pass: process.env.gmailPasswd
			}
		};
		this.#mailTransporter = mailer.createTransport(this.#configuration);
	}

	send(sender) {
		this.#mailBody = {
			from: sender.email,
			to: process.env.gmailEmail,
			subject: sender.subject,
			html: `
				<h1> ${sender.fname} sent a message </h1>
				<p> ${sender.message} </p>
			`
		};

		this.#mailTransporter.sendMail(this.#mailBody, function(err, info) {
			if(err) {
				console.log(err);
			}
			console.log(info);
		});
	}

	// Private members
	#mailBody
	#mailTransporter
	#configuration
}

exports.Mailer = Mailer;
