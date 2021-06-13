const express 		= require("express");
const bodyParser 	= require("body-parser");
const session 		= require("express-session");
const app 			= express();
const { Database } 	= require("./database");
// const { Logger }	= require("./log/logger");
const { log } 		= require("./log/logging");
const { ArticleRepository } = require("./repositories/ArticleRepository");
const { Mailer } 	= require("./utils/mailer");
const helmet 		= require("helmet");
const mailer 		= new Mailer();
// const logger 		= new Logger();
const db 			= new Database("litho-prae-db", ".\\SQLExpress", true, false);
const articles = new ArticleRepository();
const PORT 			= process.env.PORT || 1337;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.set("views", "./public");
app.use(helmet());


app.use(session({
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: true
}));

app.get("/", async function(req, res) {
	// const results = await db.testQuery();
	// res.json(results);
});

app.get("/register", function(req, res) {
	log.info("Invoking register");
	const errors = req.session.errors;
	res.render("test_register.ejs", { errors });
});

app.post("/registerUser", async function(req, res) {
	const usrData = req.body;

	log.info(usrData, `Trying to register a user ${usrData.email}`);

	console.log(usrData);

	req.session.errors = [{ message: "I like cookies!" }];
	res.redirect("/register");

	// await db.registerUserSP(usrData.fname, usrData.lname, usrData.usr, usrData.email, usrData.psw, 0);
	// logger.logRegisteredUser(usrData.usr, usrData);
	// res.render();
});

app.get("/articles", async function(req, res) {
	const _aritcles_ = await articles.getAll();
	res.json(_aritcles_);
});

app.get("/contact", function(req, res) {
	res.render("test_contact.ejs");
});

app.post("/sendEmail", function(req, res) {
	const mailBody = req.body;
	console.log(mailBody);
	mailer.send(mailBody);
});

app.listen(PORT, async () => {
	// console.log(results);
	await db.connectToDB();
	console.log("Raboti");
});
