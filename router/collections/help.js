// root/router/collections/contact.js

const { Mailer } 	= require("../../utils/mailer");
const mailer 		= new Mailer();

const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
	if(req.session.token) {
		res.render("helping-form.ejs", { logged: true });
	}
	else {
		res.render("helping-form.ejs", { logged: false });
	}
});


router.post("/", function(req, res) {
	const mailBody = req.body;
	console.log(mailBody);
	mailer.sendHelp(mailBody);
	res.redirect("/help");
});

module.exports = router;
