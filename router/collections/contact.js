// root/router/collections/contact.js

const { Mailer } 	= require("../../utils/mailer");
const mailer 		= new Mailer();

const express = require("express");
const router = express.Router();

router.get("/", function(req, res) {
	res.render("test_contact.ejs");
});


router.post("/", function(req, res) {
	const mailBody = req.body;
	console.log(mailBody);
	mailer.send(mailBody);
});

module.exports = router;
