// root/router/collections/register.js


const express = require("express");
const router = express.Router();

const { Database } 	= require("../../utils/database");
const db 			= new Database("litho-prae-db", ".\\SQLExpress", true, false);
const { log } 		= require("../../log/logging");
const inputValidation = require("../../utils/validation");

router.get("/", function(req, res) {
	log.info("Invoking register");
	const errors = req.session.errors;
	res.render("test_register.ejs", { errors });
});

router.post("/", async function(req, res) {
	const usrData = req.body;

	log.info(usrData, `Trying to register a user ${usrData.email}`);

	console.log(usrData);

	const errors = inputValidation.checkUserRegistrationData(usrData);

	if (errors.length) {
		req.session.errors = errors;
	}
	else {
		req.session.errors = null;
		await db.registerUserSP(usrData.fname, usrData.lname, usrData.usr, usrData.email, usrData.psw, 0);
		// logger.logRegisteredUser(usrData.usr, usrData);
	}
	res.redirect("/register");
});

module.exports = router;
