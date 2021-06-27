// root/router/collections/contact.js

const { Mailer } 	= require("../../utils/mailer");
const mailer 		= new Mailer();

const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
	if(req.session.token) {
		res.render("contact.ejs", { logged: true });
	}
	else {
		res.render("contact.ejs", { logged: false });
	}
});


router.post("/", function(req, res) {
	const mailBody = req.body;
	console.log(mailBody);
	mailer.send(mailBody);
	res.redirect("/contact");
});

module.exports = router;
