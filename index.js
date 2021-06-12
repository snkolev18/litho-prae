const express 		= require("express");
const bodyParser 	= require("body-parser");
const app 			= express();
const { Database } 	= require("./database");
const { Logger }	= require("./log/logger");
const logger 		= new Logger();
const db 			= new Database("litho-prae-db", "DESKTOP-M33791J\\SQLExpress", true, false);
const PORT 			= process.env.PORT || 1337;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.set("views", "./public");

app.get("/", async function(req, res) {
	const results = await db.testQuery();
	res.json(results);
});

app.get("/register", function(req, res) {
	res.render("test_register.ejs");
});

app.post("/registerUser", async function(req, res) {
	const usrData = req.body;
	console.log(usrData);
	await db.registerUserSP(usrData.fname, usrData.lname, usrData.usr, usrData.email, usrData.psw, 0);
	logger.logRegisteredUser(usrData.usr, usrData);
});

app.listen(PORT, async () => {
	// console.log(results);
	await db.connectToDB();
	console.log("Raboti");
});
