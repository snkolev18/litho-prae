const mailer = require("nodemailer");
require("dotenv").config();

class Mailer {
	constructor() {
		this.configuration = {
			host: process.env.gmailHost,
			port: process.env.smtpPort,
			secure: true,
			auth: {
				user: process.env.gmailEmail,
				pass: process.env.gmailPasswd
			}
		};
		this.mailTransporter = mailer.createTransport(this.configuration);
	}

	send(sender) {
		this.mailBody = {
			from: sender.email,
			to: process.env.gmailEmail,
			subject: sender.topic,
			html: `
				<h1> ${sender.fname + " " + sender.lname} sent a message </h1>
				<p> ${sender.msg} </p>
			`
		};

		this.mailTransporter.sendMail(this.mailBody, function(err, info) {
			if(err) {
				console.log(err);
			}
			console.log(info);
		});
	}
}

exports.Mailer = Mailer;
