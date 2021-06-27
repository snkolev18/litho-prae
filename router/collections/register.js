// root/router/collections/register.js


const express = require("express");
const router = express.Router();

const { UserRepository } 	= require("../../repositories/UserRepository");
const { DbEx } = require("../../utils/dbEx");
let db 			= undefined;
const { log } 		= require("../../log/logging");
const inputValidation = require("../../utils/validation");

router.get("/", function(req, res) {
	log.info("Invoking register");
	const errors = req.session.errors;
	if(req.session.token) {
		res.render("registration.ejs", {
			errors: errors,
			logged: true
		});
	}
	else {
		res.render("registration.ejs", {
			errors: errors,
			logged: false
		});
	}
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
		req.session.errors = [];
		const sc = await db.registerUserSP(usrData.fname, usrData.lname, usrData.username, usrData.email, usrData.password, 0);
		if (sc) req.session.errors.push({ message : "Account with this username or email already exist!" });
	}
	res.redirect("/register");
});

module.exports = router;

(async () => {
	const s = await DbEx.getInstance();
	db = new UserRepository();
	console.log("Connected");
})();
