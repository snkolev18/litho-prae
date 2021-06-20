const express 		= require("express");
const bodyParser 	= require("body-parser");
const session 		= require("express-session");
const app 			= express();
const { Database } 	= require("./utils/database");
const { log } 		= require("./log/logging");
const { ArticleRepository } = require("./repositories/ArticleRepository");
const inputValidation = require("./utils/validation");
const Middlewares = require("./middlewares/auth");
const { DbEx } = require("./utils/dbEx");
const helmet 		= require("helmet");
const db 			= new Database();
const articles = new ArticleRepository();
const PORT 			= process.env.PORT || 1337;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.disable("x-powered-by");
app.use(helmet());

// Configuring express to look for .ejs file in ./public directory
app.set("views", "./public");

app.use(session({
	secret: "keyboard cat",
	secure: true,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// Expires after 1 day
		expires: 24 * 60 * 60 * 1000
	}
}));

require("./router/router")(app);

app.get("/", async function(req, res) {
	const results = await db.testQuery();
	res.json(results);
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
	const errors = inputValidation.checkUserRegistrationData(usrData);
	if (errors.length) {
		req.session.errors = errors;
	}
	else {
		req.session.errors = [];
		const sc = await db.registerUserSP(usrData.fname, usrData.lname, usrData.usr, usrData.email, usrData.psw, 0);
		if (sc) req.session.errors.push({ message : "Account with this username or email already exist!" });
	}
	res.redirect("/register");
});

app.get("/articles", Middlewares.isAuthenticated, async function(req, res) {
	const _articles_ = await articles.getAll();
	res.json(_articles_);
});

app.get("/login", function(req, res) {
	if(req.session.token) {
		req.session.token = null;
	}
	res.render("test_login.ejs");
});

app.post("/login", async function(req, res) {
	const loginUsrData = req.body;
	console.log(loginUsrData);
	const result = await db.verifyLoginSP(loginUsrData.usr, loginUsrData.psw);
	console.log(result);

	if (result.idVerified) {
		req.session.token = {
			id: result.idVerified,
			username: loginUsrData.usr,
			roleId: result.roleId,
			status: result.status
		};

		console.log(req.session.token);

		if (req.session.returnUrl) {
			res.redirect(req.session.returnUrl);
		}
		else {
			res.send("Qsha, lognat si");
			console.log(`Current user ${req.session.token.username}`);
		}
	}
	else {
		res.send("Qsha, Ne si lognat");
	}
});

app.get("/taenpanel", Middlewares.isAdmin, async function(req, res) {
	res.send("Opa shefe");
});

app.get("/taenpanel/allArticles", Middlewares.isAdmin, async function(req, res) {
	const _articles_ = await articles.getAll();
	console.log(_articles_);
	res.render("test_adminArticles.ejs", {
		articles: _articles_
	});
});

app.get("/taenpanel/allArticles/edit/:id", Middlewares.isAdmin, async function(req, res) {
	if(isNaN(req.params.id)) {
		res.send({ message: "Invalid article" });
	}
	else {
		const id = parseInt(req.params.id);
		const article = await articles.getArticleById(id);

	}
});

app.get("/article/:id", async function(req, res) {
	if(isNaN(req.params.id)) {
		res.send({ message: "Invalid article" });
	}
	else {
		const id = parseInt(req.params.id);
		const article = await articles.getArticleById(id);
		console.log(article);
		res.send(article);
	}
});

app.get("/articles/new", Middlewares.isAuthenticated, async function(req, res) {
	res.render("test_createArticle.ejs");
});

app.post("/articles/new", Middlewares.isAuthenticated, async function(req, res) {
	const article = req.body;
	console.log(`Receiving new article: ${article}`);
	await articles.create(article, new Date(), req.session.token.id);
});

app.get("*", function(_, res) {
	res.status(404).send("<h1 align=\"center\">Page not found</h1>");
});

app.use(async (req, res, next) => {
	console.log("DEFAULT EXCEPTION HANDLER");
	next();
});

app.listen(PORT, async () => {
	// console.log(results);
	console.log("Connecting to DB...");
	await db.connectToDB();
	console.log("Raboti");
	const s = await DbEx.getInstance();
});

