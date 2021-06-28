const mailer = require("nodemailer");
require("dotenv").config();

class Mailer {
	constructor() {
		this.#configuration = {
			host: process.env.HOST,
			port: process.env.SMTP_PORT,
			secure: true,
			auth: {
				user: process.env.EMAIL,
				pass: process.env.EMAIL_PASSWORD
			}
		};
		this.#mailTransporter = mailer.createTransport(this.#configuration);
	}

	send(sender) {
		this.#mailBody = {
			from: sender.email,
			to: process.env.EMAIL,
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
	}H

	sendHelp(sender) {
		this.#mailBody = {
			from: sender.email,
			to: 'lithoprae@gmail.com',
			subject: `Съобщение от ${sender.name}:  ${sender.typeOfAnimal} има проблем - ${sender.type}`,
			text: `
         			Населено място: ${sender.settlePoint}
					 Квартал: ${sender.addressQuarterText}
					 Улица: ${sender.addressStreetText}
					 Улица №: ${sender.addressStreetNumberText}
					 Описание на местоположението: ${sender.addressCommentsText}
					 Е-Поща: ${sender.email}
					 Телефон: ${sender.phone}
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
